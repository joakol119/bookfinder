import { Pagination as BsPagination } from "react-bootstrap";

function PaginationBar({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const pages = [];

  let start, end;
  if (totalPages <= maxVisible) {
    start = 1;
    end = totalPages;
  } else if (currentPage <= 3) {
    start = 1;
    end = maxVisible;
  } else if (currentPage >= totalPages - 2) {
    start = totalPages - maxVisible + 1;
    end = totalPages;
  } else {
    start = currentPage - 2;
    end = currentPage + 2;
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <BsPagination className="justify-content-center mt-4">
      <BsPagination.Prev
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {pages.map((pg) => (
        <BsPagination.Item
          key={pg}
          active={pg === currentPage}
          onClick={() => onPageChange(pg)}
        >
          {pg}
        </BsPagination.Item>
      ))}
      <BsPagination.Next
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </BsPagination>
  );
}

export default PaginationBar;
