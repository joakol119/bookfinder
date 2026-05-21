import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Button, Spinner, Badge, Collapse, Card } from "react-bootstrap";
import {
  getBookDetail,
  getCoverUrl,
  getDescription,
  getAuthorInfo,
} from "../services/openLibraryApi";
import { isBookInList, toggleReadingList } from "../services/readingListService";

function BookDetailPage() {
  const { workId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Datos básicos del libro (pasados por state o cargados)
  const bookFromState = location.state?.book || null;

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  const workKey = `/works/${workId}`;

  useEffect(() => {
    setSaved(isBookInList(workKey));
  }, [workKey]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getBookDetail(workKey);
        setDetail(data);
      } catch (err) {
        console.error("Error al cargar detalle:", err);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [workKey]);

  const handleToggle = () => {
    const book = bookFromState || { key: workKey, title: detail?.title || "Sin título" };
    toggleReadingList(book);
    setSaved(!saved);
    window.dispatchEvent(new Event("readinglist-updated"));
  };

  const handleShowAuthor = async () => {
    if (showAuthor) {
      setShowAuthor(false);
      return;
    }
    if (!authorInfo) {
      setAuthorLoading(true);
      const firstAuthor = bookFromState?.author_name?.[0] || authors?.split(",")[0]?.trim();
      const info = await getAuthorInfo(firstAuthor);
      setAuthorInfo(info);
      setAuthorLoading(false);
    }
    setShowAuthor(true);
  };

  const title = bookFromState?.title || detail?.title || "Cargando...";
  const authors = bookFromState?.author_name?.join(", ") || "Autor desconocido";
  const coverId = bookFromState?.cover_i || detail?.covers?.[0];
  const coverImg = getCoverUrl(coverId, "L");
  const year = bookFromState?.first_publish_year;
  const pages = bookFromState?.number_of_pages_median;
  const editions = bookFromState?.edition_count;
  const rating = bookFromState?.ratings_average;
  const languages = bookFromState?.language?.slice(0, 5) || [];
  const desc = getDescription(detail);
  const subjects = detail?.subjects?.slice(0, 10) || [];

  // Mapa de códigos de idioma comunes
  const langNames = {
    eng: "Inglés", spa: "Español", fre: "Francés", ger: "Alemán",
    por: "Portugués", ita: "Italiano", jpn: "Japonés", chi: "Chino",
    rus: "Ruso", ara: "Árabe", kor: "Coreano", dut: "Holandés",
    swe: "Sueco", pol: "Polaco", cat: "Catalán",
  };

  return (
    <div className="fade-in-up">
      <Button
        variant="link"
        className="text-decoration-none mb-3 px-0"
        style={{ color: "var(--bf-text-muted)" }}
        onClick={() => navigate(-1)}
      >
        ← Volver
      </Button>

      {loading && !bookFromState && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "var(--bf-accent)" }} />
          <p className="text-muted mt-2">Cargando detalles...</p>
        </div>
      )}

      <Row className="g-4">
        <Col md={4} className="text-center">
          {coverImg ? (
            <img
              src={coverImg}
              alt={title}
              className="detail-cover-img"
              style={{ maxHeight: 450 }}
            />
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center rounded-3"
              style={{
                height: 400,
                background: "#f0ebe3",
              }}
            >
              <span style={{ fontSize: "3rem" }}>📕</span>
              <span className="text-muted mt-2">Sin portada disponible</span>
            </div>
          )}
        </Col>

        <Col md={8}>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
          <p className="fs-5" style={{ color: "var(--bf-text-muted)" }}>
            {authors}
          </p>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {year && <Badge bg="light" text="dark" className="border">📅 {year}</Badge>}
            {pages && <Badge bg="light" text="dark" className="border">📄 {pages} págs</Badge>}
            {editions && <Badge bg="light" text="dark" className="border">📚 {editions} ediciones</Badge>}
            {rating && <Badge bg="light" text="dark" className="border">⭐ {rating.toFixed(1)}</Badge>}
            {languages.length > 0 && (
              <Badge bg="light" text="dark" className="border">
                🌐 {languages.map((l) => langNames[l] || l).join(", ")}
              </Badge>
            )}
          </div>

          {loading && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <Spinner size="sm" animation="border" style={{ color: "var(--bf-accent)" }} />
              <span className="text-muted">Cargando descripción...</span>
            </div>
          )}

          {desc && (
            <p
              className="mb-3"
              style={{
                color: "var(--bf-text-muted)",
                lineHeight: 1.7,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {desc}
            </p>
          )}

          {subjects.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-4">
              {subjects.map((s, i) => (
                <span key={i} className="subject-badge">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="d-flex flex-wrap gap-2">
            <Button
              className={saved ? "btn btn-secondary" : "btn-accent"}
              onClick={handleToggle}
            >
              {saved ? "🔖 Guardado" : "📑 Agregar a lecturas"}
            </Button>
            {authors !== "Autor desconocido" && (
              <Button
                variant="outline-secondary"
                onClick={handleShowAuthor}
                disabled={authorLoading}
              >
                {authorLoading ? (
                  <><Spinner size="sm" animation="border" className="me-1" /> Cargando...</>
                ) : showAuthor ? "✍️ Ocultar autor" : "✍️ Sobre el autor"}
              </Button>
            )}
            <Button
              variant="outline-dark"
              href={`https://openlibrary.org${workKey}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en Open Library ↗
            </Button>
          </div>

          {authors !== "Autor desconocido" && (
            <Collapse in={showAuthor}>
              <div className="mt-3">
                {authorInfo ? (
                  <Card className="border" style={{ background: "var(--bf-bg, #faf7f2)" }}>
                    <Card.Body>
                      <h5 style={{ fontFamily: "'Playfair Display', serif" }}>
                        {authorInfo.name}
                      </h5>
                      {(authorInfo.birthDate || authorInfo.deathDate) && (
                        <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                          {authorInfo.birthDate && `📅 ${authorInfo.birthDate}`}
                          {authorInfo.birthDate && authorInfo.deathDate && " — "}
                          {authorInfo.deathDate && `✝ ${authorInfo.deathDate}`}
                        </p>
                      )}
                      {authorInfo.bio ? (
                        <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "var(--bf-text-muted, #6b5445)", maxHeight: 200, overflowY: "auto" }}>
                          {authorInfo.bio.length > 800 ? authorInfo.bio.slice(0, 800) + "..." : authorInfo.bio}
                        </p>
                      ) : (
                        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                          No hay biografía disponible para este autor.
                        </p>
                      )}
                      {authorInfo.wikipedia && (
                        <a
                          href={authorInfo.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "0.85rem", color: "var(--bf-accent, #c45d3e)" }}
                        >
                          📖 Ver en Wikipedia ↗
                        </a>
                      )}
                    </Card.Body>
                  </Card>
                ) : (
                  <p className="text-muted">No se encontró información del autor.</p>
                )}
              </div>
            </Collapse>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default BookDetailPage;
