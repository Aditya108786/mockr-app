
// components/ProtectedRoute.js
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push('/auth'); // Redirect to login if no user is authenticated
    } else {
      setLoading(false); // Set loading to false once user state is verified
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking for authentication
  }

  if (!user) {
    return null; // Prevent rendering protected content if user is not authenticated
  }

  return children;
}
