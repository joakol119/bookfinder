import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../views/HomePage";
import BookDetailPage from "../views/BookDetailPage";
import ReadingListPage from "../views/ReadingListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "book/:workId", element: <BookDetailPage /> },
      { path: "reading-list", element: <ReadingListPage /> },
    ],
  },
]);

export default router;
