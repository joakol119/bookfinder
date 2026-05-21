import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { getReadingList } from "../services/readingListService";
import { useState, useEffect } from "react";

function NavigationBar() {
  const [count, setCount] = useState(getReadingList().length);
  const navigate = useNavigate();

  // Escuchar cambios en localStorage para actualizar el badge
  useEffect(() => {
    const handleStorage = () => setCount(getReadingList().length);
    window.addEventListener("readinglist-updated", handleStorage);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("readinglist-updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleBrandClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("search-reset"));
    navigate("/");
  };

  return (
    <Navbar bg="white" expand="sm" className="border-bottom shadow-sm sticky-top">
      <Container>
        <Navbar.Brand
          href="/"
          onClick={handleBrandClick}
          className="d-flex align-items-center gap-2"
        >
          <span style={{ fontSize: "1.5rem" }}>📚</span>
          <span className="navbar-brand-text">
            Libre<span>RIA</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              🏠 Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/reading-list">
              🔖 Lecturas{" "}
              {count > 0 && (
                <Badge bg="danger" pill className="ms-1">
                  {count}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
