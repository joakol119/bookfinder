# 00 - Memory Bank: BookFinder

## Contexto del Proyecto
- **Materia:** Rich Internet Applications (RIA) 2026
- **Tarea:** Laboratorio 2 — Escenario #6: Buscador de Libros
- **API principal:** Open Library API (https://openlibrary.org/developers/api)
- **Stack:** React 18 + Vite + React-Bootstrap + React Router DOM 6
- **Persistencia:** LocalStorage para lista de lecturas pendientes

## Decisiones Técnicas
1. **Framework:** React — ecosistema amplio, buena documentación, fácil integración con Bootstrap.
2. **UI Library:** React-Bootstrap — implementación oficial de Bootstrap para React, componentes listos.
3. **Routing:** React Router DOM v6 con `createBrowserRouter` — rutas anidadas bajo layout principal.
4. **Estado:** useState local por componente + eventos custom para sincronizar navbar badge.
5. **API Service:** Capa de servicios separada en `src/services/` para desacoplar lógica de fetch.
6. **Docker:** Multi-stage build (Node para build → Nginx para serve) con SPA fallback.

## Arquitectura de Componentes
```
App (Layout + Navbar + Outlet)
├── HomePage
│   ├── SearchBar (input + filtros)
│   ├── BookCard[] (grilla de resultados)
│   └── PaginationBar
├── BookDetailPage (info completa + agregar a lista)
└── ReadingListPage (libros guardados en LocalStorage)
```

## Endpoints de API Utilizados
- Búsqueda: `GET /search.json?q=|author=|isbn=|subject={term}&limit=12&offset=N`
- Detalle de obra: `GET /works/{workId}.json`
- Portadas: `https://covers.openlibrary.org/b/id/{coverId}-{S|M|L}.jpg`

## Estado Actual
- [x] Estructura del proyecto creada
- [x] Componentes implementados
- [x] Servicios de API y LocalStorage
- [x] Rutas configuradas
- [x] Docker configurado
- [x] README completo
- [ ] Tests unitarios e integración
- [ ] Mockups en Figma/Excalidraw
- [ ] Video demo de 30s
- [ ] PPT de presentación
