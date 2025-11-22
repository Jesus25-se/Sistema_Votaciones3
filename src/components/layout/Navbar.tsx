import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import type { CSSProperties } from 'react';

// Estilos compartidos para los enlaces (Link)
const linkBaseStyle: CSSProperties = {
  fontSize: "15px", 
  position: "relative",
  textDecoration: "none",
  transition: "color 0.3s ease",
  whiteSpace: "nowrap",
};

// Estilos para la línea inferior animada
const lineBaseStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: -4,
  width: "100%",
  height: "2px",
  backgroundColor: "#ffd500",
  transformOrigin: "center",
  transition: "transform 0.3s ease",
};


export default function Navbar() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/admin",
    "/dashboard",
    "/admin/dashboard",
    "/admin/upload",
    "/admin/analytics",
    "/admin/cleaning"
  ];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const links = [
    { to: "/", text: "Inicio" },
    { to: "/para-electores", text: "Voto Presencial" },
    { to: "/cronologia", text: "Cronología" },
    { to: "/lo-nuevo", text: "Lo que debes saber" },
  ];

  return (
    <nav
      // 1. ELIMINAR ESPACIO SUPERIOR: Se eliminó 'mb-3' (margen inferior) que estaba creando un espacio innecesario
      //    y se cambió 'py-1' por 'pt-2' (padding top) y 'pb-1' (padding bottom) para control más fino.
      className="fixed-top pt-2 px-3" 
      style={{
        backgroundColor: "#0b3b6f",
        borderBottom: "3px solid #0d6efd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        zIndex: 1020,
      }}
    >
      <div className="container"> 
        
        {/* ------------------------------------------------------------------ */}
        {/* Logo y Título */}
        <div 
          // 2. AÑADIR ESPACIO INFERIOR: Se cambió 'mb-1' a 'mb-2' para separar el título de los enlaces.
          className="d-flex justify-content-center align-items-center mb-2"
        >
            
            {/* Logo ONPE */}
            <div className="me-2"> 
                <img
                    src="https://eg2026.onpe.gob.pe/assets/img/logo-onpe.svg"
                    alt="Logo ONPE"
                    style={{
                        height: "40px", 
                        width: "auto",
                        borderRadius: "6px",
                        padding: "3px",
                        backgroundColor: "#fff",
                        border: "2px solid #0d6efd",
                    }}
                />
            </div>

            {/* Título */}
            <h5 className="fw-bold text-white fs-5 mb-0"> 
                Sistema Nacional de Votaciones
            </h5>
        </div>
        {/* ------------------------------------------------------------------ */}

        {/* Links */}
        {/* Ajustado el padding a 'pb-2' para un espacio inferior del navbar más compacto */}
        <div className="d-flex justify-content-center flex-wrap gap-3 pb-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            
            // Estilos dinámicos para el Link
            const linkStyle: CSSProperties = {
                ...linkBaseStyle,
                color: isActive ? "#ffd500" : "#ffffff",
                padding: "2px 5px",
            };
            
            // Estilos dinámicos para la línea
            const lineStyle: CSSProperties = {
                ...lineBaseStyle,
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
            };

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`fw-semibold nav-link`}
                style={linkStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#ffd500";
                  if (!isActive) {
                    // Utiliza 'e.currentTarget.lastChild' para apuntar al span
                    const spanElement = e.currentTarget.lastChild as HTMLSpanElement;
                    spanElement.style.transform = "scaleX(0.5)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#ffffff";
                    // Utiliza 'e.currentTarget.lastChild' para apuntar al span
                    const spanElement = e.currentTarget.lastChild as HTMLSpanElement;
                    spanElement.style.transform = "scaleX(0)";
                  }
                }}
              >
                {link.text}
                {/* Línea inferior animada */}
                <span style={lineStyle}></span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}