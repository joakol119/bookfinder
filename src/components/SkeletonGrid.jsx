import { Card } from "react-bootstrap";

function SkeletonCard() {
  return (
    <Card className="h-100 rounded-3 shadow-sm border-0 overflow-hidden">
      <div className="skeleton-cover" />
      <Card.Body className="p-3">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-author" />
        <div className="skeleton-line skeleton-year" />
      </Card.Body>
    </Card>
  );
}

function SkeletonGrid({ count = 12 }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="skeleton-line" style={{ width: 120, height: 24 }} />
        <div className="skeleton-line" style={{ width: 160, height: 16 }} />
      </div>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
        {Array.from({ length: count }).map((_, i) => (
          <div className="col" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
            <SkeletonCard />
          </div>
        ))}
      </div>
    </>
  );
}

export { SkeletonCard };
export default SkeletonGrid;
