// components/layout/AdminLayout.tsx
import { useEffect } from "react"; // 🛑 IMPORTAR useEffect
import { Outlet, useNavigate } from "react-router-dom"; // 🛑 IMPORTAR useNavigate
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  // 🛑 LÓGICA DE PROTECCIÓN DE RUTA
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLogged");
    
    // Si la clave de sesión NO existe o no es 'true', redirigir al login
    if (isLoggedIn !== "true") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // Si la sesión aún no se ha verificado (por ejemplo, si el localStorage es null/undefined)
  // o si no está logueado, podemos retornar null o un loader temporal
  if (localStorage.getItem("adminLogged") !== "true") {
    return null; // O un componente de carga (<p>Cargando...</p>)
  }

  // Si la verificación pasa, renderizar el layout
  return (
    <div className="d-flex">
      <AdminSidebar />
      
      {/* Contenido principal */}
      <main
        className="flex-grow-1"
        style={{
          marginLeft: "280px",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Outlet /> {/* Renderiza los componentes hijos */}
      </main>
    </div>
  );
}