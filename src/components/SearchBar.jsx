import { useState, useEffect } from "react";
import { Form, InputGroup, Button, ButtonGroup } from "react-bootstrap";

const SEARCH_TYPES = [
  { value: "q", label: "General" },
  { value: "author", label: "Autor" },
  { value: "isbn", label: "ISBN" },
  { value: "subject", label: "Tema" },
];

function SearchBar({ onSearch, loading, initialQuery = "", initialType = "q" }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);

  // Sincronizar si cambian las props (al volver de detalle)
  useEffect(() => {
    setQuery(initialQuery);
    setSearchType(initialType);
  }, [initialQuery, initialType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("", searchType);
  };

  return (
    <div className="search-hero">
      <h2>Descubrí tu próximo libro</h2>
      <p>Buscá entre millones de libros en Open Library</p>

      <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 600 }}>
        <InputGroup size="lg" className="mb-3 shadow-sm rounded-3 overflow-hidden">
          <Form.Control
            type="text"
            placeholder="Buscá por título, autor o ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0"
            aria-label="Buscar libros"
          />
          {query && (
            <Button
              variant="light"
              className="border-0 px-3"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              style={{ color: "var(--bf-text-muted)", fontSize: "1.2rem" }}
            >
              ✕
            </Button>
          )}
          <Button
            type="submit"
            className="btn-accent px-4"
            disabled={loading || !query.trim()}
          >
            {loading ? "Buscando..." : "🔍 Buscar"}
          </Button>
        </InputGroup>

        <ButtonGroup size="sm" className="flex-wrap">
          {SEARCH_TYPES.map((t) => (
            <Button
              key={t.value}
              variant={searchType === t.value ? "dark" : "outline-secondary"}
              className={`filter-chip ${searchType === t.value ? "active" : ""}`}
              onClick={() => {
                setSearchType(t.value);
                if (query.trim()) onSearch(query.trim(), t.value);
              }}
            >
              {t.label}
            </Button>
          ))}
        </ButtonGroup>
      </Form>
    </div>
  );
}

export default SearchBar;
