import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Alert, Button, Form } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import PaginationBar from "../components/PaginationBar";
import SkeletonGrid from "../components/SkeletonGrid";
import { searchBooks } from "../services/openLibraryApi";

const LIMIT = 12;

// Pool de búsquedas populares — se muestran 5 al azar en cada visita
const POPULAR_AUTHORS = [
  "Jorge Luis Borges", "Gabriel García Márquez", "Mario Vargas Llosa",
  "Isabel Allende", "Julio Cortázar", "Pablo Neruda", "Octavio Paz",
  "Roberto Bolaño", "Haruki Murakami", "Stephen King",
  "George Orwell", "Franz Kafka", "Ernest Hemingway",
  "Virginia Woolf", "Jane Austen", "Fyodor Dostoevsky",
  "Oscar Wilde", "Edgar Allan Poe", "Agatha Christie",
  "Ray Bradbury", "Isaac Asimov", "Shakespeare",
  "H.P. Lovecraft", "Antoine de Saint-Exupéry",
];

const POPULAR_BOOKS = [
  "Cien años de soledad", "Don Quijote", "1984",
  "El Principito", "Harry Potter", "Rayuela",
  "Crimen y castigo", "El Gran Gatsby", "Fahrenheit 451",
  "Orgullo y prejuicio", "Drácula", "Frankenstein",
  "El Hobbit", "Moby Dick", "La Odisea",
  "El nombre de la rosa", "Los miserables", "It",
  "Ficciones", "La sombra del viento",
];

function HomePage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState("");
  const [lastType, setLastType] = useState("q");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Ordenar resultados
  const sortedResults = useMemo(() => {
    if (sortBy === "relevance") return results;
    const sorted = [...results];
    switch (sortBy) {
      case "year_desc":
        return sorted.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
      case "year_asc":
        return sorted.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
      case "rating":
        return sorted.sort((a, b) => (b.ratings_average || 0) - (a.ratings_average || 0));
      case "title":
        return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      default:
        return sorted;
    }
  }, [results, sortBy]);

  // Resetear búsqueda al hacer clic en el logo
  useEffect(() => {
    const handleReset = () => {
      setResults([]);
      setTotalResults(0);
      setLastQuery("");
      setLastType("q");
      setCurrentPage(1);
      setError(null);
    };
    window.addEventListener("search-reset", handleReset);
    return () => window.removeEventListener("search-reset", handleReset);
  }, []);

  // Elegir sugerencias al azar
  const pickRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const authorPicks = useMemo(() => pickRandom(POPULAR_AUTHORS, 4), []);
  const bookPicks = useMemo(() => pickRandom(POPULAR_BOOKS, 4), []);

  const doSearch = useCallback(async (query, type, page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(query, type, page, LIMIT);
      setResults(data.docs || []);
      setTotalResults(data.numFound || 0);
    } catch (err) {
      setError("Error al buscar libros. Intentá de nuevo.");
      console.error(err);
    }
    setLoading(false);
  }, []);

  // Si venimos del detalle con una búsqueda de autor
  useEffect(() => {
    const incoming = location.state;
    if (incoming?.searchQuery && incoming?.searchType) {
      setLastQuery(incoming.searchQuery);
      setLastType(incoming.searchType);
      setCurrentPage(1);
      setSortBy("relevance");
      doSearch(incoming.searchQuery, incoming.searchType, 1);
      // Limpiar el state para que no se repita si vuelve
      window.history.replaceState({}, "");
    }
  }, [location.state, doSearch]);

  const handleSearch = (query, type) => {
    if (!query) {
      // Limpiar búsqueda
      setResults([]);
      setTotalResults(0);
      setLastQuery("");
      setLastType(type);
      setCurrentPage(1);
      return;
    }
    setLastQuery(query);
    setLastType(type);
    setCurrentPage(1);
    doSearch(query, type, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    doSearch(lastQuery, lastType, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.min(Math.ceil(totalResults / LIMIT), 50);

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        loading={loading}
        initialQuery={lastQuery}
        initialType={lastType}
      />

      {error && (
        <Alert variant="warning" className="text-center">
          {error}
        </Alert>
      )}

      {loading && <SkeletonGrid count={12} />}

      {!loading && results.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 className="mb-0">Resultados</h3>
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: "auto", fontSize: "0.85rem" }}
                aria-label="Ordenar resultados"
              >
                <option value="relevance">Relevancia</option>
                <option value="year_desc">Más recientes</option>
                <option value="year_asc">Más antiguos</option>
                <option value="rating">Mejor rating</option>
                <option value="title">Título A-Z</option>
              </Form.Select>
              <span className="text-muted" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                {totalResults.toLocaleString()} encontrados
              </span>
            </div>
          </div>

          <Row xs={2} md={3} lg={4} xl={5} className="g-3">
            {sortedResults.map((book, i) => (
              <Col key={book.key + i}>
                <BookCard
                  book={book}
                  onToggleBookmark={() => setRefreshKey((k) => k + 1)}
                />
              </Col>
            ))}
          </Row>

          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && lastQuery && results.length === 0 && !error && (
        <div className="text-center py-5">
          <p style={{ fontSize: "2.5rem" }}>🔍</p>
          <h4>Sin resultados</h4>
          <p className="text-muted">
            No encontramos libros para &ldquo;{lastQuery}&rdquo;. Probá con otro
            término.
          </p>
        </div>
      )}

      {!loading && !lastQuery && (
        <div className="text-center py-5">
          <p style={{ fontSize: "3rem" }}>📚</p>
          <h4>Empezá tu búsqueda</h4>
          <p className="text-muted">
            Escribí un título, autor, ISBN o tema para encontrar libros.
          </p>
          <div className="mt-4" style={{ maxWidth: 500, margin: "0 auto" }}>
            <p className="text-muted small mb-2">📖 Libros populares:</p>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
              {bookPicks.map((term) => (
                <Button
                  key={term}
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill"
                  onClick={() => {
                    setLastQuery(term);
                    setLastType("q");
                    setCurrentPage(1);
                    doSearch(term, "q", 1);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
            <p className="text-muted small mb-2">✍️ Autores populares:</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {authorPicks.map((term) => (
                <Button
                  key={term}
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill"
                  onClick={() => {
                    setLastQuery(term);
                    setLastType("author");
                    setCurrentPage(1);
                    doSearch(term, "author", 1);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
