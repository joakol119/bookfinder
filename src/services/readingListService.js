const LS_KEY = "bookfinder_reading_list";

/**
 * Obtiene la lista de lecturas desde LocalStorage.
 * @returns {Array}
 */
export function getReadingList() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guarda la lista de lecturas en LocalStorage.
 * @param {Array} list
 */
export function saveReadingList(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

/**
 * Verifica si un libro está en la lista.
 * @param {string} bookKey
 * @returns {boolean}
 */
export function isBookInList(bookKey) {
  return getReadingList().some((b) => b.key === bookKey);
}

/**
 * Agrega un libro a la lista de lecturas.
 * @param {Object} book - Objeto del libro con key, title, etc.
 * @returns {Array} Lista actualizada
 */
export function addToReadingList(book) {
  const list = getReadingList();
  if (list.some((b) => b.key === book.key)) return list;

  const entry = {
    key: book.key,
    title: book.title,
    author: book.author_name?.[0] || book.author || "Autor desconocido",
    cover_i: book.cover_i,
    first_publish_year: book.first_publish_year,
    addedAt: new Date().toISOString(),
  };

  const newList = [...list, entry];
  saveReadingList(newList);
  return newList;
}

/**
 * Quita un libro de la lista de lecturas.
 * @param {string} bookKey
 * @returns {Array} Lista actualizada
 */
export function removeFromReadingList(bookKey) {
  const list = getReadingList();
  const newList = list.filter((b) => b.key !== bookKey);
  saveReadingList(newList);
  return newList;
}

/**
 * Alterna un libro en la lista (agrega si no está, quita si está).
 * @param {Object} book
 * @returns {{list: Array, added: boolean}}
 */
export function toggleReadingList(book) {
  if (isBookInList(book.key)) {
    return { list: removeFromReadingList(book.key), added: false };
  } else {
    return { list: addToReadingList(book), added: true };
  }
}
