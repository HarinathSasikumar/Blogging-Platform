// Generates a consistent hue from any string
function stringToHue(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

const sizes = {
  xs: { dim: 24, font: '0.6rem' },
  sm: { dim: 34, font: '0.75rem' },
  md: { dim: 44, font: '1rem' },
  lg: { dim: 80, font: '1.75rem' },
  xl: { dim: 120, font: '2.5rem' },
};

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const { dim, font } = sizes[size] || sizes.md;
  const hue = stringToHue(user?.username || user?.email || '');
  const initials = getInitials(user?.username || user?.name || '');
  const imgSrc = user?.profileImage ? `/uploads/${user.profileImage}` : null;

  const style = {
    width: dim,
    height: dim,
    borderRadius: '50%',
    fontSize: font,
    flexShrink: 0,
    objectFit: 'cover',
  };

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={user?.username || 'User'}
        style={style}
        className={`user-avatar ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`user-avatar user-avatar--initials ${className}`}
      style={{
        ...style,
        background: `linear-gradient(135deg, hsl(${hue},70%,45%), hsl(${(hue + 40) % 360},70%,60%))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        letterSpacing: '0.03em',
        userSelect: 'none',
      }}
      aria-label={user?.username || 'User avatar'}
    >
      {initials || '?'}
    </div>
  );
}
