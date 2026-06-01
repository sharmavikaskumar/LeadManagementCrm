import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/dashboard" />;
  }

  if (role && user.role !== role) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl font-semibold text-red-500">
          You are not authorized
        </h1>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;