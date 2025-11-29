import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  
  const { currentUser, token } = useSelector((state) => state.user);

  if(!currentUser || !token) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

