# 📖 BookFinder — Buscador de Libros

Aplicación RIA para buscar libros utilizando la [Open Library API](https://openlibrary.org/developers/api). Permite buscar por título, autor, ISBN o tema, ver detalles de cada libro y gestionar una lista de lecturas pendientes.

**Curso:** Rich Internet Applications (RIA) 2026  
**Tarea:** Laboratorio 2 — Escenario #6: Buscador de Libros  
**Integrantes:** [Nombre 1], [Nombre 2]

---

## 🛠️ Tecnologías

| Categoría       | Tecnología                            |
|-----------------|---------------------------------------|
| Framework       | React 18 + Vite                       |
| UI              | React-Bootstrap 2 + Bootstrap 5       |
| Routing         | React Router DOM 6                    |
| API             | Open Library API                      |
| Persistencia    | LocalStorage                          |
| Testing         | Vitest + React Testing Library        |
| Deploy          | Docker + Nginx                        |

## 📁 Estructura del Proyecto

```
bookfinder/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── NavigationBar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── BookCard.jsx
│   │   └── PaginationBar.jsx
│   ├── views/             # Páginas principales
│   │   ├── HomePage.jsx
│   │   ├── BookDetailPage.jsx
│   │   └── ReadingListPage.jsx
│   ├── services/          # Llamadas a APIs y lógica de datos
│   │   ├── openLibraryApi.js
│   │   └── readingListService.js
│   ├── router/            # Configuración de rutas
│   │   └── index.jsx
│   ├── App.jsx            # Layout principal
│   ├── App.css            # Estilos custom
│   └── main.jsx           # Entry point
├── tests/                 # Pruebas unitarias e integración
├── docker/                # Dockerfile y config de Nginx
│   ├── Dockerfile
│   └── nginx.conf
├── prompts/               # Registro de prompts de IA
├── docker-compose.yml
└── README.md
```

## 🚀 Cómo Levantar el Proyecto

### Opción 1: Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/bookfinder.git
cd bookfinder

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Opción 2: Docker

```bash
# Build y run con Docker Compose
docker-compose up --build

# La app estará en http://localhost:3000
```

### Opción 3: Build de Producción

```bash
npm run build
npm run preview
```

## 📄 Rutas de la Aplicación

| Ruta              | Descripción                               |
|-------------------|-------------------------------------------|
| `/`               | Página principal con buscador             |
| `/book/:workId`   | Detalle de un libro específico            |
| `/reading-list`   | Lista de lecturas pendientes (LocalStorage)|

## 🔌 APIs Consumidas

### Open Library API (Principal)

- **Búsqueda:** `GET https://openlibrary.org/search.json?q={query}`
- **Detalle:** `GET https://openlibrary.org/works/{id}.json`
- **Portadas:** `https://covers.openlibrary.org/b/id/{cover_id}-{size}.jpg`

**Alternativas contempladas:**
- Google Books API
- ISBNdb

### Funcionalidades

- Búsqueda por título, autor, ISBN y tema
- Paginación de resultados
- Vista de detalle con descripción, temas, año, ediciones y rating
- Lista de lecturas pendientes persistida en LocalStorage
- Diseño responsive (mobile y desktop)

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

### Performance (Lighthouse)

> Completar con capturas de Lighthouse > 80 en Performance, Accessibility, Best Practices y SEO.

## 🎥 Video Demo

> [Link al video de 30 segundos]

## 🤖 Uso de Inteligencia Artificial

Se utilizaron las siguientes herramientas de IA durante el desarrollo:

- **Claude (Anthropic):** Generación de estructura del proyecto, componentes y servicios.

Los prompts relevantes están guardados en la carpeta `prompts/`.

## 📋 Checklist de Entregables

- [ ] Mockups (Figma/Excalidraw)
- [x] Código en GitHub con README.md completo
- [ ] Tests Unitarios e Integración (capturas de éxito)
- [ ] Video de 30 segundos
- [ ] PPT de presentación (mínimo 7 slides)

## 📝 Licencia

Proyecto académico — RIA 2026.
