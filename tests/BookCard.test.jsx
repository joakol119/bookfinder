import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookCard from "../src/components/BookCard";

// Mock de react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockBook = {
  key: "/works/OL123W",
  title: "Ficciones",
  author_name: ["Jorge Luis Borges"],
  cover_i: 12345,
  first_publish_year: 1944,
};

const mockBookNoCover = {
  key: "/works/OL456W",
  title: "Libro sin portada",
  author_name: [],
  cover_i: null,
  first_publish_year: null,
};

describe("BookCard", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  it("renderiza título, autor y año del libro", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    expect(screen.getByText("Ficciones")).toBeInTheDocument();
    expect(screen.getByText("Jorge Luis Borges")).toBeInTheDocument();
    expect(screen.getByText("1944")).toBeInTheDocument();
  });

  it("muestra 'Autor desconocido' cuando no hay autor", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBookNoCover} />
      </MemoryRouter>
    );

    expect(screen.getByText("Autor desconocido")).toBeInTheDocument();
  });

  it("muestra la imagen de portada cuando hay cover_i", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const img = screen.getByAltText("Portada de Ficciones");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("covers.openlibrary.org");
    expect(img.src).toContain("12345");
  });

  it("muestra 'Sin portada' cuando no hay cover_i", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBookNoCover} />
      </MemoryRouter>
    );

    expect(screen.getByText("Sin portada")).toBeInTheDocument();
  });

  it("navega al detalle al hacer clic en la card", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    await user.click(screen.getByText("Ficciones"));
    expect(mockNavigate).toHaveBeenCalledWith("/book/OL123W", expect.any(Object));
  });

  it("tiene un botón de bookmark", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const btn = screen.getByTitle(/Agregar a lecturas/i);
    expect(btn).toBeInTheDocument();
  });
});
