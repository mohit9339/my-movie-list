import { useEffect, useState } from 'react';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchList();
  }, [activeTab]);

  const fetchList = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get(`/list/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(res.data);
    } catch (err) {
      setError('Error fetching list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (tmdbId) => {
    try {
      await API.delete(`/list/${activeTab}/${tmdbId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((movie) => movie.tmdbId !== tmdbId));
    } catch (err) {
      alert('Failed to remove movie');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>🎬 Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveTab('favorites')}>⭐ Favorites</button>
        <button onClick={() => setActiveTab('watched')}>✅ Watched</button>
        <button onClick={() => setActiveTab('recommended')}>💡 Recommended</button>
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : movies.length === 0 ? (
        <p>No movies in this list</p>
      ) : (
        movies.map((movie) => (
          <MovieCard
            key={movie.tmdbId}
            movie={movie}
            onRemove={() => handleRemove(movie.tmdbId)}
          />
        ))
      )}
    </div>
  );
}

export default Dashboard;
