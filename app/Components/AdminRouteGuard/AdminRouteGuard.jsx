import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router";
import { loadLoggedInUser } from "../../Pages/Login/Login";

export default function AdminRouteGuard({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const checkUser = () => setUser(loadLoggedInUser());

    checkUser();
    window.addEventListener("storage", checkUser);
    window.addEventListener("userLoggedIn", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userLoggedIn", checkUser);
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 gap-3" role="status">
        <CircularProgress />
        <span>Verificando acesso...</span>
      </div>
    );
  }

  if (user?.type !== "admin") {
    return (
      <section className="container py-5 text-center" role="alert">
        <h1 className="h4 text-danger">Acesso restrito</h1>
        <p>Esta página é reservada apenas para administradores.</p>
        <Link to="/login">Entrar como administrador</Link>
      </section>
    );
  }

  return children;
}
