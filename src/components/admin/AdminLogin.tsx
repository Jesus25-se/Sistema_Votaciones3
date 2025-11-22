import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🛑 CORRECCIÓN: Verificar sesión al montar el componente (Auto-redirección)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLogged");
    if (isLoggedIn === "true") {
      // Si ya está logueado, redirige al dashboard inmediatamente.
      navigate("/admin/resultados", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simula un delay de red

    if (correo === "admin@votaciones.com" && password === "1234") {
      // Login exitoso: GUARDA el estado de la sesión
      localStorage.setItem("adminLogged", "true"); 
      navigate("/admin/resultados");
    } else {
      setMensaje("❌ Credenciales incorrectas. Intente nuevamente.");
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleRegresar = () => {
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #001f3f 0%, #004085 50%, #0066cc 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          zIndex: 0,
        }}
      />

      <div
        className="card p-4 position-relative"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: `
            0 15px 30px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2)
          `,
          border: "none",
          zIndex: 1,
          transform: "translateY(0)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-3px)";
          event.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow =
            "0 15px 30px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div className="text-center mb-3">
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 15px",
              background: "linear-gradient(135deg, #003366 0%, #0056b3 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 15px rgba(0, 86, 179, 0.3)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🔐</span>
          </div>
        </div>

        <h3
          className="text-center fw-bold mb-3"
          style={{
            color: "#003366",
            letterSpacing: "0.3px",
            fontSize: "1.5rem",
          }}
        >
          Acceso Administrativo
        </h3>

        <p className="text-center text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          Ingrese sus credenciales para acceder al panel
        </p>

        <div className="mb-3">
          <label
            className="form-label fw-semibold text-secondary mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            📧 Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="admin@votaciones.com"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              borderRadius: "10px",
              border: "2px solid #e9ecef",
              padding: "10px 14px",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
            }}
            onFocus={(event) => {
              event.target.style.borderColor = "#003366";
              event.target.style.boxShadow =
                "0 0 0 2px rgba(0, 51, 102, 0.1)";
            }}
            onBlur={(event) => {
              event.target.style.borderColor = "#e9ecef";
              event.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold text-secondary mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            🔒 Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              borderRadius: "10px",
              border: "2px solid #e9ecef",
              padding: "10px 14px",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
            }}
            onFocus={(event) => {
              event.target.style.borderColor = "#003366";
              event.target.style.boxShadow =
                "0 0 0 2px rgba(0, 51, 102, 0.1)";
            }}
            onBlur={(event) => {
              event.target.style.borderColor = "#e9ecef";
              event.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          className="btn w-100 fw-semibold mb-3 position-relative"
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            backgroundColor: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            fontSize: "1rem",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(event) => {
            if (!isLoading) {
              event.currentTarget.style.backgroundColor = "#0056b3";
              event.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseOut={(event) => {
            if (!isLoading) {
              event.currentTarget.style.backgroundColor = "#003366";
              event.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {isLoading ? (
            <>
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
              Verificando...
            </>
          ) : (
            "🚀 Ingresar"
          )}
        </button>

        <button
          className="btn w-100 fw-semibold"
          onClick={handleRegresar}
          style={{
            borderRadius: "10px",
            padding: "10px",
            border: "2px solid #6c757d",
            color: "#6c757d",
            backgroundColor: "transparent",
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(event) => {
            event.currentTarget.style.backgroundColor = "#6c757d";
            event.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(event) => {
            event.currentTarget.style.backgroundColor = "transparent";
            event.currentTarget.style.color = "#6c757d";
          }}
        >
          ← Regresar al inicio
        </button>

        {mensaje && (
          <div
            className="alert alert-danger mt-3 text-center fw-semibold"
            style={{
              borderRadius: "10px",
              border: "none",
              background:
                "linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)",
              color: "#d63031",
              fontSize: "0.85rem",
              padding: "10px",
              animation: "shake 0.5s ease-in-out",
            }}
          >
            {mensaje}
          </div>
        )}

        {/*<div
          className="mt-3 p-2 text-center"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px dashed #dee2e6",
          }}
        >
          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
            <strong>Credenciales de prueba:</strong>
            <br /> 📧 admin@votaciones.com
            <br /> 🔒 1234
          </small>
        </div>*/}
      </div>

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .spinner-border {
            width: 0.9rem;
            height: 0.9rem;
          }
        `}
      </style>
    </div>
  );
}