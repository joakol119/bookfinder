const API_BASE = "https://openlibrary.org";
const COVER_BASE = "https://covers.openlibrary.org/b/id";

// Campos mínimos necesarios para la búsqueda (reduce el tamaño de respuesta ~90%)
const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "cover_i",
  "first_publish_year",
  "edition_count",
  "number_of_pages_median",
  "ratings_average",
  "language",
].join(",");

// Cache simple en memoria para evitar requests repetidos
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Busca libros en Open Library.
 * Usa el parámetro `fields` para pedir solo los datos necesarios (mucho más rápido).
 * @param {string} query - Término de búsqueda
 * @param {string} type - Tipo: "q" (título), "author", "isbn", "subject"
 * @param {number} page - Página actual (1-indexed)
 * @param {number} limit - Resultados por página
 * @returns {Promise<{docs: Array, numFound: number}>}
 */
export async function searchBooks(query, type = "q", page = 1, limit = 12) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    [type]: query.trim(),
    fields: SEARCH_FIELDS,
    limit: String(limit),
    offset: String(offset),
  });

  const cacheKey = params.toString();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}/search.json?${params}`);
  if (!res.ok) throw new Error(`Error en búsqueda: ${res.status}`);

  const data = await res.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Obtiene detalles de un libro (work).
 * @param {string} workKey - Ej: "/works/OL12345W"
 * @returns {Promise<Object>}
 */
export async function getBookDetail(workKey) {
  const res = await fetch(`${API_BASE}${workKey}.json`);
  if (!res.ok) throw new Error(`Error al obtener detalle: ${res.status}`);
  return res.json();
}

/**
 * Genera la URL de la portada de un libro.
 * @param {number|string} coverId - ID de la portada
 * @param {"S"|"M"|"L"} size - Tamaño
 * @returns {string|null}
 */
export function getCoverUrl(coverId, size = "M") {
  if (!coverId) return null;
  return `${COVER_BASE}/${coverId}-${size}.jpg`;
}

/**
 * Extrae la descripción de un objeto de detalle.
 * @param {Object} detail
 * @returns {string|null}
 */
export function getDescription(detail) {
  if (!detail) return null;
  if (typeof detail.description === "string") return detail.description;
  if (detail.description?.value) return detail.description.value;
  return null;
}

/**
 * Busca info de un autor por nombre.
 * @param {string} name - Nombre del autor
 * @returns {Promise<Object|null>} Datos del autor o null
 */
export async function getAuthorInfo(name) {
  try {
    // Buscar el autor
    const searchRes = await fetch(`${API_BASE}/search/authors.json?q=${encodeURIComponent(name)}&limit=1`);
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    if (!searchData.docs?.length) return null;
    const authorKey = searchData.docs[0].key;

    // Obtener detalles
    const detailRes = await fetch(`${API_BASE}/authors/${authorKey}.json`);
    if (!detailRes.ok) return null;
    const detail = await detailRes.json();

    return {
      name: detail.name || name,
      bio: typeof detail.bio === "string" ? detail.bio : detail.bio?.value || null,
      birthDate: detail.birth_date || null,
      deathDate: detail.death_date || null,
      photoId: detail.photos?.[0] || null,
      wikipedia: detail.wikipedia || null,
    };
  } catch {
    return null;
  }
}
