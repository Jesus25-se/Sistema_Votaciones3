// components/layout/AdminSidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart, CloudUpload, Cpu, LogOut, Vote, Database } from "lucide-react";

// Definiendo estilos con React.CSSProperties para asegurar la compatibilidad de tipos
const sidebarStyle: React.CSSProperties = {
  width: "270px",
  position: "fixed",
  top: 0,
  left: 0,
  backgroundColor: "#1e2738",
  zIndex: 1000,
  overflowY: "auto", 
};

const separatorStyle: React.CSSProperties = {
  borderColor: "#2f3b52",
};

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Define la nueva ruta principal para resultados
  const RESULTADOS_ROUTE = "/admin/resultados";
  const DASHBOARD_ROUTE = "/admin/dashboard";

  // Usa startsWith para que las subrutas (ej: /admin/upload/csv) sigan mostrando el enlace activo
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleVotaciones = () => {
    // Si estamos en la ruta de Resultados, hacemos scroll.
    if (location.pathname.startsWith(RESULTADOS_ROUTE)) {
      document.getElementById("votaciones")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no, navegamos a la nueva ruta y pasamos el estado para hacer scroll.
      navigate(RESULTADOS_ROUTE, { state: { scrollTo: "votaciones" } });
    }
  };

  // 🛑 NUEVA FUNCIÓN: Maneja el cierre de sesión
  const handleLogout = () => {
    // 1. Elimina la clave de autenticación
    localStorage.removeItem("adminLogged"); 
    // 2. Navega al login
    navigate("/admin-login");
  };

  // useEffect para manejar el scroll después de la navegación a /admin/resultados
  React.useEffect(() => {
    if (location.pathname.startsWith(RESULTADOS_ROUTE) && location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      // Limpiamos el state para evitar scrolls repetidos
      navigate(RESULTADOS_ROUTE, { replace: true, state: {} });
    }
  }, [location, navigate, RESULTADOS_ROUTE]);

  // Función para obtener las clases dinámicas de los enlaces de navegación
  const getNavLinkClasses = (path: string, activeColor: string) => {
    const active = isActive(path);
    return `nav-link d-flex align-items-center fw-semibold px-3 py-2 rounded ${
      active ? `active-link active-link-${activeColor}` : "text-light opacity-75 default-link-hover"
    }`;
  };

  return (
    <aside
      className="d-flex flex-column justify-content-between vh-100 text-light shadow-lg"
      style={sidebarStyle}
    >
      {/* ---------- CONTENIDO SUPERIOR (Header y Votaciones) ---------- */}
      <div>
        {/* HEADER (Título del Sistema) */}
        <div
          className="text-center py-4 border-bottom border-secondary-subtle"
          style={separatorStyle}
        >
          <h4 className="fw-bold mb-1 text-white">
            Sistema Electoral
          </h4>
          <span className="badge text-bg-primary">
            Panel Administrativo
          </span>
        </div>

        {/* SECCIÓN DE RESULTADOS (Votaciones - Ahora en /admin/resultados) */}
        <div className="mt-4 px-3">
          <h6 className="text-center text-white fw-bold mb-3">
            Resultados
          </h6>
          <button
            onClick={handleVotaciones}
            // Marcamos Votaciones como activo si estamos en la ruta de Resultados
            className={`btn btn-sm w-100 d-flex align-items-center justify-content-start fw-semibold px-3 py-2 ${
              location.pathname.startsWith(RESULTADOS_ROUTE) 
              ? 'active-link active-link-primary' 
              : 'votaciones-btn'
            }`}
          >
            <Vote size={16} className="me-2" />
            Votaciones
          </button>
        </div>

        {/* ---------- MENÚ PRINCIPAL ---------- */}
        <ul className="nav flex-column px-3 mt-3 pt-3 border-top border-secondary-subtle" style={separatorStyle}>
          
          {/* Panel de Control (Admin Dashboard) */}
          <li className="nav-item mb-2">
            <Link
              to= "/admin/metrics"
              className={getNavLinkClasses("/admin/metrics", "secondary")} // Cambiado a secondary para distinguir de Resultados
            >
              <BarChart size={18} className="me-3" />
              Panel de Control
            </Link>
          </li>

          {/* Cargar Datos */}
          <li className="nav-item mb-2">
            <Link
              to="/admin/upload"
              className={getNavLinkClasses("/admin/upload", "success")}
            >
              <CloudUpload size={18} className="me-3" />
              Cargar Datos
            </Link>
          </li>

          {/* Limpieza de Datos */}
          <li className="nav-item mb-2">
            <Link
              to="/admin/cleaning"
              className={getNavLinkClasses("/admin/cleaning", "secondary")}
            >
              <Database size={18} className="me-3" />
              Limpieza de Datos
            </Link>
          </li>

          {/* Análisis Predictivo */}
          <li className="nav-item mb-2">
            <Link
              to="/admin/analytics"
              className={getNavLinkClasses("/admin/analytics", "warning")}
            >
              <Cpu size={18} className="me-3" />
              Análisis Predictivo
            </Link>
          </li>
        </ul>
      </div>

      {/* ---------- FOOTER (Cerrar Sesión) ---------- */}
      <div
        className="text-center border-top py-3 px-3"
        style={separatorStyle}
      >
        <div className="text-secondary small mb-2 fw-bold">
          <div>Sistema Seguro v2.1.0</div>
          <div>© 2024 Sistema Electoral</div>
        </div>
        {/* 🛑 CAMBIO: Usa un botón para ejecutar handleLogout y cerrar sesión */}
        <button
          onClick={handleLogout} // Llamada a la función de logout
          className="btn btn-outline-secondary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 log-out-btn"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}