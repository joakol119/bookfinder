import { describe, it, expect, beforeEach } from "vitest";
import {
  getReadingList,
  saveReadingList,
  isBookInList,
  addToReadingList,
  removeFromReadingList,
  toggleReadingList,
} from "../src/services/readingListService";

// Mock de un libro
const mockBook = {
  key: "/works/OL123W",
  title: "La ciudad y los perros",
  author_name: ["Mario Vargas Llosa"],
  cover_i: 12345,
  first_publish_year: 1963,
};

const mockBook2 = {
  key: "/works/OL456W",
  title: "Cien años de soledad",
  author_name: ["Gabriel García Márquez"],
  cover_i: 67890,
  first_publish_year: 1967,
};

describe("readingListService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getReadingList", () => {
    it("retorna un array vacío cuando no hay datos en localStorage", () => {
      expect(getReadingList()).toEqual([]);
    });

    it("retorna la lista guardada en localStorage", () => {
      localStorage.setItem(
        "bookfinder_reading_list",
        JSON.stringify([{ key: "/works/OL123W", title: "Test" }])
      );
      const list = getReadingList();
      expect(list).toHaveLength(1);
      expect(list[0].title).toBe("Test");
    });

    it("retorna array vacío si localStorage tiene JSON inválido", () => {
      localStorage.setItem("bookfinder_reading_list", "not-json");
      expect(getReadingList()).toEqual([]);
    });
  });

  describe("saveReadingList", () => {
    it("guarda la lista en localStorage", () => {
      const list = [{ key: "/works/OL123W", title: "Test" }];
      saveReadingList(list);
      const stored = JSON.parse(localStorage.getItem("bookfinder_reading_list"));
      expect(stored).toEqual(list);
    });
  });

  describe("isBookInList", () => {
    it("retorna false si el libro no está en la lista", () => {
      expect(isBookInList("/works/OL123W")).toBe(false);
    });

    it("retorna true si el libro está en la lista", () => {
      addToReadingList(mockBook);
      expect(isBookInList("/works/OL123W")).toBe(true);
    });
  });

  describe("addToReadingList", () => {
    it("agrega un libro a la lista", () => {
      const list = addToReadingList(mockBook);
      expect(list).toHaveLength(1);
      expect(list[0].key).toBe("/works/OL123W");
      expect(list[0].title).toBe("La ciudad y los perros");
      expect(list[0].author).toBe("Mario Vargas Llosa");
    });

    it("no agrega un libro duplicado", () => {
      addToReadingList(mockBook);
      const list = addToReadingList(mockBook);
      expect(list).toHaveLength(1);
    });

    it("puede agregar múltiples libros distintos", () => {
      addToReadingList(mockBook);
      const list = addToReadingList(mockBook2);
      expect(list).toHaveLength(2);
    });

    it("persiste los datos en localStorage", () => {
      addToReadingList(mockBook);
      const stored = JSON.parse(localStorage.getItem("bookfinder_reading_list"));
      expect(stored).toHaveLength(1);
    });
  });

  describe("removeFromReadingList", () => {
    it("quita un libro de la lista", () => {
      addToReadingList(mockBook);
      addToReadingList(mockBook2);
      const list = removeFromReadingList("/works/OL123W");
      expect(list).toHaveLength(1);
      expect(list[0].key).toBe("/works/OL456W");
    });

    it("no hace nada si el libro no existe", () => {
      addToReadingList(mockBook);
      const list = removeFromReadingList("/works/INEXISTENTE");
      expect(list).toHaveLength(1);
    });
  });

  describe("toggleReadingList", () => {
    it("agrega el libro si no está en la lista", () => {
      const { list, added } = toggleReadingList(mockBook);
      expect(added).toBe(true);
      expect(list).toHaveLength(1);
    });

    it("quita el libro si ya está en la lista", () => {
      addToReadingList(mockBook);
      const { list, added } = toggleReadingList(mockBook);
      expect(added).toBe(false);
      expect(list).toHaveLength(0);
    });
  });
});
