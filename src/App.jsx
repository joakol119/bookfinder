import { Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <div className="app-wrapper">
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <NavigationBar />
      <main id="main-content" className="container py-4" role="main">
        <Outlet />
      </main>
      <footer className="text-center py-3 border-top mt-4" role="contentinfo">
        <small className="text-muted">
          Desarrollado con React + Bootstrap · Datos de{" "}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Library API
          </a>
        </small>
      </footer>
    </div>
  );
}

export default App;
