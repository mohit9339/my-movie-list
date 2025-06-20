import { useState } from 'react';
import axios from 'axios';
import API from '../services/api';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('token');

  const searchTMDB = async () => {
    if (!query) return;
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${query}`
      );
      setResults(res.data.results);
    } catch (err) {
      alert('TMDB search failed');
    }
  };

  const handleAdd = async (movie, listType) => {
    const payload = {
      tmdbId: movie.id,
      title: movie.title || movie.name,
      poster: movie.poster_path,
      type: movie.media_type,
      genre: [], // You can extend this by fetching genres
      year: parseInt((movie.release_date || movie.first_air_date || '').slice(0, 4)) || 0,
    };

    try {
      await API.post(`/list/${listType}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Added to ${listType}`);
    } catch (err) {
      alert(`Failed to add to ${listType}`);
    }
  };

  return (
    <div>
      <h1>🔍 Search Movies / TV Shows</h1>
      <input
        type="text"
        placeholder="Search title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchTMDB}>Search</button>

      <div>
        {results.length > 0 &&
          results.map((movie) => (
            <div key={movie.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
              <h3>{movie.title || movie.name}</h3>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title || movie.name}
                />
              )}
              <p>Type: {movie.media_type}</p>
              <p>Year: {(movie.release_date || movie.first_air_date || '').slice(0, 4)}</p>
              <button onClick={() => handleAdd(movie, 'favorites')}>⭐ Add to Favorites</button>
              <button onClick={() => handleAdd(movie, 'watched')}>✅ Add to Watched</button>
              <button onClick={() => handleAdd(movie, 'recommended')}>💡 Add to Recommended</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Search;
