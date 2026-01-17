export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}
