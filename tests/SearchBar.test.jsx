import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../src/components/SearchBar";

describe("SearchBar", () => {
  it("renderiza el título, subtítulo y el input", () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);

    expect(screen.getByText("Descubrí tu próximo libro")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscá por título/i)).toBeInTheDocument();
    expect(screen.getByText("🔍 Buscar")).toBeInTheDocument();
  });

  it("renderiza los 4 filtros de búsqueda", () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);

    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Autor")).toBeInTheDocument();
    expect(screen.getByText("ISBN")).toBeInTheDocument();
    expect(screen.getByText("Tema")).toBeInTheDocument();
  });

  it("llama a onSearch al hacer submit con texto", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} loading={false} />);

    const input = screen.getByPlaceholderText(/Buscá por título/i);
    await user.type(input, "Borges");
    await user.click(screen.getByText("🔍 Buscar"));

    expect(onSearch).toHaveBeenCalledWith("Borges", "q");
  });

  it("no llama a onSearch si el input está vacío", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} loading={false} />);
    await user.click(screen.getByText("🔍 Buscar"));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("cambia el tipo de búsqueda al hacer clic en un filtro", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} loading={false} />);

    const input = screen.getByPlaceholderText(/Buscá por título/i);
    await user.type(input, "García Márquez");
    await user.click(screen.getByText("Autor"));

    expect(onSearch).toHaveBeenCalledWith("García Márquez", "author");
  });

  it("muestra 'Buscando...' cuando loading es true", () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />);
    expect(screen.getByText("Buscando...")).toBeInTheDocument();
  });

  it("deshabilita el botón cuando loading es true", () => {
    render(<SearchBar onSearch={vi.fn()} loading={true} />);
    expect(screen.getByText("Buscando...")).toBeDisabled();
  });
});
