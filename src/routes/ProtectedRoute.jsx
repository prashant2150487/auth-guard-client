import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Generic guard component to prevent unauthorized access.
 * - Redirects unauthenticated users to /sign-in.
 * - Optionally enforces role or permission checks if provided.
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackPath = "/",
}) => {
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const location = useLocation();

  //   if (requireAuth && !isLoggedIn) {
  //     return (
  //       <Navigate
  //         to="/sign-in"
  //         replace
  //         state={{ from: location.pathname + location.search }}
  //       />
  //     );
  //   }

  //   if (allowedRoles.length > 0) {
  //     const role =
  //       typeof user?.role === "string" ? user.role : user?.role?.name ?? null;
  //     const roleAllowed = Boolean(role && allowedRoles.includes(role));
  //     if (!roleAllowed) {
  //       return <Navigate to={fallbackPath} replace />;
  //     }
  //   }

  //   if (requiredPermissions.length > 0) {
  //     const userPermissions = user?.permissions || [];
  //     const hasAllPermissions = requiredPermissions.every((permission) =>
  //       userPermissions.includes(permission)
  //     );

  //     if (!hasAllPermissions) {
  //       return <Navigate to={fallbackPath} replace />;
  //     }
  //   }
  if (!isLoggedIn) {
    return <Navigate to={fallbackPath} replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
