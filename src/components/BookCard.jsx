import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getCoverUrl } from "../services/openLibraryApi";
import { isBookInList, toggleReadingList } from "../services/readingListService";

function BookCard({ book, onToggleBookmark }) {
  const navigate = useNavigate();
  const saved = isBookInList(book.key);
  const cover = getCoverUrl(book.cover_i);

  const handleClick = () => {
    // book.key es "/works/OL12345W" → extraemos el ID
    const workId = book.key.replace("/works/", "");
    navigate(`/book/${workId}`, { state: { book } });
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggleReadingList(book);
    window.dispatchEvent(new Event("readinglist-updated"));
    if (onToggleBookmark) onToggleBookmark();
  };

  return (
    <Card
      className="book-card h-100 rounded-3 shadow-sm fade-in-up"
      onClick={handleClick}
      role="article"
      aria-label={`${book.title} por ${book.author_name?.[0] || "autor desconocido"}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="book-cover-wrapper">
        <Button
          variant="light"
          size="sm"
          className="bookmark-btn-float"
          onClick={handleBookmark}
          aria-label={saved ? `Quitar ${book.title} de lecturas` : `Agregar ${book.title} a lecturas`}
          title={saved ? "Quitar de lecturas" : "Agregar a lecturas"}
        >
          {saved ? "🔖" : "📑"}
        </Button>
        {cover ? (
          <img src={cover} alt={`Portada de ${book.title}`} loading="lazy" />
        ) : (
          <div className="text-muted d-flex flex-column align-items-center gap-1">
            <span style={{ fontSize: "2rem" }}>📕</span>
            <small>Sin portada</small>
          </div>
        )}
      </div>
      <Card.Body className="p-3">
        <Card.Title
          className="fs-6 fw-semibold mb-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {book.title}
        </Card.Title>
        <Card.Text className="text-muted mb-0" style={{ fontSize: "0.83rem" }}>
          {book.author_name?.[0] || "Autor desconocido"}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-1">
          {book.first_publish_year && (
            <small className="text-muted">{book.first_publish_year}</small>
          )}
          {book.ratings_average && (
            <small className="text-warning fw-semibold">
              ⭐ {book.ratings_average.toFixed(1)}
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
