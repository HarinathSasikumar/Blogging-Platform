export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* Image placeholder */}
      <div className="skeleton skeleton-card__img" />

      <div className="skeleton-card__body">
        {/* Category */}
        <div className="skeleton skeleton-card__badge" />

        {/* Title lines */}
        <div className="skeleton skeleton-card__title-1" />
        <div className="skeleton skeleton-card__title-2" />

        {/* Description */}
        <div className="skeleton skeleton-card__desc-1" />
        <div className="skeleton skeleton-card__desc-2" />

        {/* Footer row */}
        <div className="skeleton-card__footer">
          <div className="skeleton skeleton-card__avatar" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton skeleton-card__meta-1" />
            <div className="skeleton skeleton-card__meta-2" />
          </div>
        </div>
      </div>

      <style>{`
        .skeleton-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .skeleton-card__img {
          height: 200px;
          width: 100%;
          border-radius: 0;
        }
        .skeleton-card__body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .skeleton-card__badge {
          height: 22px;
          width: 80px;
          border-radius: 999px;
        }
        .skeleton-card__title-1 {
          height: 22px;
          width: 90%;
        }
        .skeleton-card__title-2 {
          height: 22px;
          width: 60%;
        }
        .skeleton-card__desc-1 {
          height: 16px;
          width: 100%;
        }
        .skeleton-card__desc-2 {
          height: 16px;
          width: 75%;
        }
        .skeleton-card__footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .skeleton-card__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .skeleton-card__meta-1 {
          height: 14px;
          width: 100px;
        }
        .skeleton-card__meta-2 {
          height: 14px;
          width: 70px;
        }
      `}</style>
    </div>
  );
}
