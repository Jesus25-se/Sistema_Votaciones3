import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verificar sesión al montar el componente
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLogged");
    if (isLoggedIn === "true") {
      navigate("/admin/resultados", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      setMensaje("⚠️ Por favor complete todos los campos");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (correo === "admin@votaciones.com" && password === "1234") {
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
      className="d-flex justify-content-center align-items-center min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #001f3f 0%, #004085 50%, #0066cc 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.03)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.02)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "20%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          zIndex: 0,
        }}
      />

      <div
        className="card position-relative"
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.6)
          `,
          border: "none",
          zIndex: 1,
          transform: "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          overflow: "hidden",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-8px)";
          event.currentTarget.style.boxShadow =
            "0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.4)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)";
        }}
      >
        {/* Header con gradiente */}
        <div
          style={{
            background: "linear-gradient(135deg, #003366 0%, #0056b3 100%)",
            padding: "2.5rem 2rem 1.5rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1rem",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 25px rgba(0, 86, 179, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ fontSize: "2rem", filter: "brightness(0) invert(1)" }}>🔐</span>
          </div>
          <h3
            className="fw-bold mb-2"
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              letterSpacing: "0.5px",
            }}
          >
            Panel Administrativo
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              margin: 0,
              fontWeight: "500",
            }}
          >
            Sistema de Gestión Electoral
          </p>
        </div>

        <div className="card-body p-4">
          <div className="mb-4">
            <label
              className="form-label fw-semibold mb-3 d-flex align-items-center"
              style={{ 
                color: "#003366",
                fontSize: "0.95rem",
              }}
            >
              <i className="bi bi-envelope-fill me-2" style={{ fontSize: "1.1rem" }}></i>
              Correo electrónico
            </label>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="admin@votaciones.com"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e9ecef",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                }}
                onFocus={(event) => {
                  event.target.style.borderColor = "#003366";
                  event.target.style.boxShadow = "0 0 0 3px rgba(0, 51, 102, 0.1)";
                  event.target.style.backgroundColor = "#fafbfc";
                }}
                onBlur={(event) => {
                  event.target.style.borderColor = "#e9ecef";
                  event.target.style.boxShadow = "none";
                  event.target.style.backgroundColor = "#fff";
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="form-label fw-semibold mb-3 d-flex align-items-center"
              style={{ 
                color: "#003366",
                fontSize: "0.95rem",
              }}
            >
              <i className="bi bi-shield-lock-fill me-2" style={{ fontSize: "1.1rem" }}></i>
              Contraseña
            </label>
            <div className="input-group">
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e9ecef",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fff",
                }}
                onFocus={(event) => {
                  event.target.style.borderColor = "#003366";
                  event.target.style.boxShadow = "0 0 0 3px rgba(0, 51, 102, 0.1)";
                  event.target.style.backgroundColor = "#fafbfc";
                }}
                onBlur={(event) => {
                  event.target.style.borderColor = "#e9ecef";
                  event.target.style.boxShadow = "none";
                  event.target.style.backgroundColor = "#fff";
                }}
              />
            </div>
          </div>

          <button
            className="btn w-100 fw-semibold mb-3 position-relative"
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              background: "linear-gradient(135deg, #003366 0%, #0056b3 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(0, 51, 102, 0.3)",
            }}
            onMouseOver={(event) => {
              if (!isLoading) {
                event.currentTarget.style.transform = "translateY(-2px)";
                event.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 51, 102, 0.4)";
              }
            }}
            onMouseOut={(event) => {
              if (!isLoading) {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 51, 102, 0.3)";
              }
            }}
          >
            {isLoading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <span className="visually-hidden">Cargando...</span>
                </div>
                Verificando credenciales...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ingresar al sistema
              </>
            )}
          </button>

          <button
            className="btn w-100 fw-semibold"
            onClick={handleRegresar}
            style={{
              borderRadius: "12px",
              padding: "12px",
              border: "2px solid #6c757d",
              color: "#6c757d",
              backgroundColor: "transparent",
              fontSize: "0.9rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(event) => {
              event.currentTarget.style.backgroundColor = "#6c757d";
              event.currentTarget.style.color = "#fff";
              event.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.backgroundColor = "transparent";
              event.currentTarget.style.color = "#6c757d";
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Regresar al inicio
          </button>

          {mensaje && (
            <div
              className="alert mt-4 text-center fw-semibold border-0"
              style={{
                borderRadius: "12px",
                background: mensaje.includes("incorrectas") 
                  ? "linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)"
                  : "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                color: mensaje.includes("incorrectas") ? "#d63031" : "#856404",
                fontSize: "0.9rem",
                padding: "12px",
                animation: "slideIn 0.4s ease-out",
                border: mensaje.includes("incorrectas") ? "1px solid #ffcccc" : "1px solid #ffeaa7",
              }}
            >
              <i className={`bi ${mensaje.includes("incorrectas") ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill"} me-2`}></i>
              {mensaje}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }

          .alert {
            animation: slideIn 0.4s ease-out;
          }

          .alert[style*="background: linear-gradient(135deg, #ffe6e6"] {
            animation: slideIn 0.4s ease-out, shake 0.5s ease-in-out;
          }

          .form-control:focus {
            border-color: #003366 !important;
            box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1) !important;
          }

          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
          }
        `}
      </style>
    </div>
  );
}