# 00 — Memory Bank: Libre RIA

## Descripción del proyecto

Aplicación web de búsqueda de libros desarrollada como Laboratorio 2 de la materia Rich Internet Applications (RIA) 2026. Consume la Open Library API y permite buscar libros, ver su detalle y guardar una lista de lecturas pendientes.

## Stack tecnológico

- **React 18 + Vite** — framework principal
- **React-Bootstrap** — componentes de UI
- **React Router DOM v6** — navegación entre vistas
- **Vitest + React Testing Library** — testing
- **Docker + Nginx** — despliegue local

## Estructura del proyecto

```
bookfinder/
├── src/
│   ├── components/   # NavigationBar, SearchBar, BookCard, PaginationBar
│   ├── views/        # HomePage, BookDetailPage, ReadingListPage
│   ├── services/     # openLibraryApi.js, readingListService.js
│   └── router/       # AppRouter.jsx
├── tests/
├── docker/
├── prompts/
├── README.md
└── docker-compose.yml
```

## API utilizada

**Open Library API** — pública, sin autenticación.

- Búsqueda: `GET https://openlibrary.org/search.json?q={query}&fields=...`
- Detalle de obra: `GET https://openlibrary.org/works/{id}.json`
- Detalle de autor: `GET https://openlibrary.org/authors/{id}.json`
- Portadas: `https://covers.openlibrary.org/b/id/{cover_id}-M.jpg`

Se usa el parámetro `fields` para limitar los datos recibidos y mejorar el rendimiento.

## Decisiones de diseño

- Se eligió Open Library por ser gratuita y no requerir API key.
- La persistencia de la lista de lectura se maneja con LocalStorage via `readingListService.js`.
- El caché en memoria evita repetir llamadas para la misma búsqueda dentro de la misma sesión.
- El filtro de búsqueda "Título" fue renombrado a "General" porque la API no distingue búsqueda exacta por título.

## Herramienta de IA utilizada

**Claude (Anthropic)** — asistencia en el desarrollo de componentes, servicios, configuración de tests y mejoras de accesibilidad. Los prompts relevantes están registrados en esta carpeta.
