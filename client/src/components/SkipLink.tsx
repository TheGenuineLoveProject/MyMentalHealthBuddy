export function SkipLink() {
  return (
    <a
      href="#main-content"
      data-testid="link-skip-to-content"
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1rem 2rem',
        background: 'var(--gradient-primary)',
        color: 'white',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
        zIndex: 9999,
        textDecoration: 'none',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '1rem';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100%';
      }}
    >
      Skip to main content
    </a>
  );
}
