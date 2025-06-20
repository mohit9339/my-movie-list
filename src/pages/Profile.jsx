import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    favorites: 0,
    watched: 0,
    recommended: 0,
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [fav, watched, rec] = await Promise.all([
        API.get('/list/favorites', { headers }),
        API.get('/list/watched', { headers }),
        API.get('/list/recommended', { headers }),
      ]);
      setCounts({
        favorites: fav.data.length,
        watched: watched.data.length,
        recommended: rec.data.length,
      });
    } catch (err) {
      alert('Error fetching profile data');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>👤 Profile</h1>
      <p><strong>Username:</strong> {user?.username || 'Unknown'}</p>
      <ul>
        <li>⭐ Favorites: {counts.favorites}</li>
        <li>✅ Watched: {counts.watched}</li>
        <li>💡 Recommended: {counts.recommended}</li>
      </ul>
    </div>
  );
}

export default Profile;
