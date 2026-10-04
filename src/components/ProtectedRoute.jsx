import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("auth");

  let isAuthenticated = false;

  if (auth && auth !== "undefined" && auth !== "null") {
    try {
      const authData = JSON.parse(auth);

      // لازم يكون فيه اسم مستخدم حقيقي
      if (
        authData &&
        typeof authData.name === "string" &&
        authData.name.trim() !== ""
      ) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
