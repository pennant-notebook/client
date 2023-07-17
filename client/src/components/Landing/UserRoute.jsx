import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../UI/LoadingSpinner';
import { fetchUserFromDynamo } from '../../services/dynamo';
import Navbar from '../Notebook/Navbar';
import Dashboard from './Dashboard';

export const UserRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await fetchUserFromDynamo(username);
      setUser(fetchedUser);
      setLoading(false);
    };
    fetchUser();
  }, [username]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return (
      <div>
        <Navbar />
        <h2>User not found</h2>
      </div>
    );
  }
  return <Dashboard />;
};
