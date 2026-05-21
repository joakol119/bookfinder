import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import { getReadingList, removeFromReadingList } from "../services/readingListService";
import { getCoverUrl } from "../services/openLibraryApi";

function ReadingListPage() {
  const [list, setList] = useState(getReadingList);
  const navigate = useNavigate();

  const handleRemove = (key) => {
    const newList = removeFromReadingList(key);
    setList(newList);
    window.dispatchEvent(new Event("readinglist-updated"));
  };

  const handleClickBook = (book) => {
    const workId = book.key.replace("/works/", "");
    navigate(`/book/${workId}`, {
      state: {
        book: {
          ...book,
          author_name: [book.author],
        },
      },
    });
  };

  return (
    <div className="fade-in-up">
      <div className="text-center mb-4">
        <h2 style={{ fontFamily: "'Playfair Display', serif" }}>
          📚 Mi Lista de Lecturas
        </h2>
        <p className="text-muted">
          {list.length} {list.length === 1 ? "libro guardado" : "libros guardados"}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ fontSize: "3rem" }}>🔖</p>
          <h4>Tu lista está vacía</h4>
          <p className="text-muted">
            Buscá libros y hacé clic en el marcador para guardarlos.
          </p>
          <Button className="btn-accent mt-2" onClick={() => navigate("/")}>
            🔍 Buscar libros
          </Button>
        </div>
      ) : (
        <ListGroup
          variant="flush"
          className="mx-auto"
          style={{ maxWidth: 700 }}
        >
          {list.map((book) => {
            const cover = getCoverUrl(book.cover_i, "S");
            return (
              <ListGroup.Item
                key={book.key}
                className="d-flex align-items-center gap-3 reading-item border rounded-3 mb-2 px-3 py-3"
              >
                <div className="reading-item-cover">
                  {cover ? (
                    <img src={cover} alt={book.title} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      📕
                    </div>
                  )}
                </div>

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <h6
                    className="mb-0 text-truncate"
                    style={{
                      cursor: "pointer",
                      fontFamily: "'Playfair Display', serif",
                    }}
                    onClick={() => handleClickBook(book)}
                  >
                    {book.title}
                  </h6>
                  <small className="text-muted">{book.author}</small>
                  {book.first_publish_year && (
                    <small className="text-muted d-block">
                      {book.first_publish_year}
                    </small>
                  )}
                </div>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemove(book.key)}
                  title="Quitar de la lista"
                >
                  🗑️
                </Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
}

export default ReadingListPage;
