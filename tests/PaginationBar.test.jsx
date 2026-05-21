import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationBar from "../src/components/PaginationBar";

describe("PaginationBar", () => {
  it("no renderiza nada si totalPages es 1", () => {
    const { container } = render(
      <PaginationBar currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("no renderiza nada si totalPages es 0", () => {
    const { container } = render(
      <PaginationBar currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renderiza botones de página cuando hay más de 1 página", () => {
    render(
      <PaginationBar currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("llama a onPageChange al hacer clic en un número de página", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <PaginationBar currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    await user.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("deshabilita el botón 'anterior' en la primera página", () => {
    render(
      <PaginationBar currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );

    // Bootstrap renderiza Prev/Next con visually-hidden spans
    const prevText = screen.getByText("Previous");
    const prevItem = prevText.closest("li");
    expect(prevItem).toHaveClass("disabled");
  });

  it("deshabilita el botón 'siguiente' en la última página", () => {
    render(
      <PaginationBar currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );

    const nextText = screen.getByText("Next");
    const nextItem = nextText.closest("li");
    expect(nextItem).toHaveClass("disabled");
  });

  it("marca la página actual como activa", () => {
    render(
      <PaginationBar currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );

    const activePage = screen.getByText("3");
    expect(activePage.closest("li")).toHaveClass("active");
  });
});
