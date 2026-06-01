# Prompt 01 — Desarrollo del proyecto

**Fecha:** Mayo 2026
**Herramienta:** Claude (Anthropic)

---

## Configuración inicial

> Esa es la tarea que tengo que hacer, una página web de un buscador de libros, cumpliendo los requisitos de ese PDF.

Se adjuntó el PDF de la guía de Laboratorio 2. A partir de los requisitos se definió el stack (React + Vite + React-Bootstrap + React Router DOM v6) y la estructura de carpetas. Se generó el proyecto base con 3 rutas, los componentes principales y la conexión a la Open Library API.

---

## Búsqueda lenta

> Busca super lento los libros, como podemos arreglar eso?

La API devolvía todos los campos disponibles por resultado. Se agregó el parámetro `fields` al request para pedir solo los datos necesarios, reduciendo el payload considerablemente. También se implementó un caché en memoria para no repetir llamadas con el mismo término de búsqueda.

---

## Mejoras de interfaz

> Quiero que mientras carga muestre algo mejor que un spinner.

> Que tenga sugerencias de búsqueda populares rotando.

> Agregar un dropdown para ordenar los resultados.

> El footer no queda pegado abajo.

> Quiero un botón para limpiar la búsqueda.

Se reemplazó el spinner por skeleton loaders con la forma de las tarjetas. Se añadieron sugerencias rotativas de búsqueda en la pantalla principal. Se incorporó ordenamiento por relevancia, título y año. El footer se corrigió con flexbox. Se añadió botón ✕ para limpiar el input.

---

## Detalle del libro

> Que en el detalle del libro aparezca la biografía del autor.

> Por qué si busco por "Título" y por "Autor" los resultados parecen iguales?

Se agregó una llamada al endpoint de autores de Open Library para mostrar la biografía en la vista de detalle, dentro de una sección colapsable. Se explicó que la búsqueda general de la API puede solapar resultados entre filtros, y el filtro "Título" fue renombrado a "General" para reflejar mejor su comportamiento real.

---

## Tests

> Hay que agregar tests, unitarios e integración, con Vitest y React Testing Library.

Se escribieron tests para los componentes principales (BookCard, SearchBar, PaginationBar), el servicio de LocalStorage y la integración completa de HomePage con mock de la API. Total: 48 tests pasando.

---

## Accesibilidad y Lighthouse

> Hay que mejorar el puntaje de Lighthouse, en Performance, Accessibility, Best Practices y SEO.

Se agregaron meta tags, un enlace skip-to-content, atributos ARIA en botones e inputs, estilos para focus visible y hints de preconnect a los dominios de la API. Se creó un favicon SVG con las iniciales "LR" y se renombró la app de "BookFinder" a "Libre RIA".

---

## Mockups y diagramas

> Qué son los mockups exactamente?

> Generame ejemplos de un mockup mobile y uno desktop con anotaciones.

> Generame el diagrama de flujo de navegación y el de arquitectura de componentes.

Se generaron ejemplos SVG de mockups anotados (mobile y desktop) y dos diagramas: flujo de navegación entre las 3 rutas y arquitectura de componentes React. Los mockups finales fueron realizados en Excalidraw.
