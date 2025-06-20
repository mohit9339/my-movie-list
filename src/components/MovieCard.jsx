function MovieCard({ movie, onRemove }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        backgroundColor: '#f9f9f9',
      }}
    >
      {movie.poster && (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
          alt={movie.title}
          style={{ borderRadius: '6px' }}
        />
      )}

      <div>
        <h3 style={{ margin: '0 0 0.3rem' }}>{movie.title}</h3>
        <p style={{ margin: '0.2rem 0' }}>📅 Year: {movie.year}</p>
        <p style={{ margin: '0.2rem 0' }}>🎬 Type: {movie.type}</p>
        {movie.genre && (
          <p style={{ margin: '0.2rem 0' }}>🏷️ Genre: {movie.genre.join(', ')}</p>
        )}

        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🗑 Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
