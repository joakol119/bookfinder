# Prompt 01 — Configuración inicial del proyecto

**Fecha:** 2026-05-12  
**Herramienta:** Claude (Anthropic)

## Prompt del usuario
> Esa es la tarea que tengo que hacer, una página web de un buscador de libros, cumpliendo los requisitos de ese PDF.

Se adjuntó el PDF de la guía de laboratorio (Tarea 2 RIA 2026).

## Decisiones tomadas con IA
- **Framework:** React 18 + Vite (elegido por ecosistema amplio y facilidad de integración)
- **UI:** React-Bootstrap (implementación oficial de Bootstrap para React)
- **Estructura:** Basada en la estructura sugerida por la cátedra (components, views, services, router)

## Resultado
Se generó el proyecto completo con:
- Estructura de carpetas según lineamientos de la tarea
- Componentes: NavigationBar, SearchBar, BookCard, PaginationBar
- Vistas: HomePage, BookDetailPage, ReadingListPage
- Servicios: openLibraryApi.js (búsqueda y detalle), readingListService.js (LocalStorage)
- Configuración de React Router DOM v6 con 3 rutas
- Docker (Dockerfile multi-stage + Nginx + docker-compose.yml)
- README.md completo con instrucciones de ejecución
