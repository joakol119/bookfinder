import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchBooks,
  getBookDetail,
  getCoverUrl,
  getDescription,
} from "../src/services/openLibraryApi";

// Mock de fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("openLibraryApi", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("getCoverUrl", () => {
    it("genera la URL correcta con tamaño M por defecto", () => {
      expect(getCoverUrl(12345)).toBe(
        "https://covers.openlibrary.org/b/id/12345-M.jpg"
      );
    });

    it("genera la URL con tamaño L", () => {
      expect(getCoverUrl(12345, "L")).toBe(
        "https://covers.openlibrary.org/b/id/12345-L.jpg"
      );
    });

    it("genera la URL con tamaño S", () => {
      expect(getCoverUrl(12345, "S")).toBe(
        "https://covers.openlibrary.org/b/id/12345-S.jpg"
      );
    });

    it("retorna null si no hay coverId", () => {
      expect(getCoverUrl(null)).toBeNull();
      expect(getCoverUrl(undefined)).toBeNull();
      expect(getCoverUrl(0)).toBeNull();
    });
  });

  describe("getDescription", () => {
    it("retorna null si no hay detail", () => {
      expect(getDescription(null)).toBeNull();
      expect(getDescription(undefined)).toBeNull();
    });

    it("extrae descripción como string directo", () => {
      expect(getDescription({ description: "Una gran novela" })).toBe(
        "Una gran novela"
      );
    });

    it("extrae descripción como objeto con value", () => {
      expect(
        getDescription({ description: { value: "Una gran novela" } })
      ).toBe("Una gran novela");
    });

    it("retorna null si no hay descripción", () => {
      expect(getDescription({})).toBeNull();
      expect(getDescription({ title: "Test" })).toBeNull();
    });
  });

  describe("searchBooks", () => {
    it("hace fetch con los parámetros correctos", async () => {
      const mockData = { docs: [], numFound: 0 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await searchBooks("vargas llosa", "author", 1, 12);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain("/search.json");
      expect(calledUrl).toContain("author=vargas+llosa");
      expect(calledUrl).toContain("limit=12");
      expect(calledUrl).toContain("offset=0");
      expect(result).toEqual(mockData);
    });

    it("calcula el offset correctamente en página 3", async () => {
      const mockData = { docs: [], numFound: 0 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await searchBooks("test", "q", 3, 12);

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain("offset=24");
    });

    it("lanza error si la respuesta no es ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(searchBooks("test")).rejects.toThrow("Error en búsqueda: 500");
    });

    it("incluye el parámetro fields para optimizar la respuesta", async () => {
      const mockData = { docs: [], numFound: 0 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await searchBooks("test");

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain("fields=");
    });
  });

  describe("getBookDetail", () => {
    it("hace fetch al endpoint correcto", async () => {
      const mockDetail = { title: "Test", description: "Desc" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      });

      const result = await getBookDetail("/works/OL123W");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://openlibrary.org/works/OL123W.json"
      );
      expect(result).toEqual(mockDetail);
    });

    it("lanza error si la respuesta no es ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getBookDetail("/works/OL999W")).rejects.toThrow(
        "Error al obtener detalle: 404"
      );
    });
  });
});
