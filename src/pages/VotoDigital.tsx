import  { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function VotoDigital() {
  // Contador hacia el 13 de diciembre 2025
  const targetDate = new Date("2025-12-13T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const months = Math.floor(totalDays / 30);
      const days = totalDays % 30;
      setTimeLeft({ months, days });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', Arial, sans-serif" }}>
      {/* Sección principal */}
      <section
        style={{
          backgroundColor: "#f6f9ff",
          padding: "80px 0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "40px",
            maxWidth: "1200px",
            width: "90%",
          }}
        >
          {/* Imagen del banner */}
          <motion.img
            src="https://votodigital.onpe.gob.pe/static/images/registro/banner-register.webp"
            alt="Banner Voto Digital"
            style={{
              width: "500px",
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Texto y contador */}
          <motion.div
            style={{ flex: 1, color: "#0b3b6f" }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: "36px", fontWeight: 800 }}>
              ¡Regístrate para participar en el Voto Digital!
            </h1>
            <p style={{ fontSize: "18px", marginTop: "10px" }}>
              Tienes plazo hasta el <b>13 de diciembre</b>.
            </p>

            {/* Contador */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  background: "#0b3b6f",
                  color: "white",
                  borderRadius: "10px",
                  padding: "18px 28px",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <h2 style={{ fontSize: "36px", margin: 0 }}>
                  {timeLeft.months.toString().padStart(2, "0")}
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>Mes(es)</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }}
                style={{
                  background: "#ffd500",
                  color: "#0b3b6f",
                  borderRadius: "10px",
                  padding: "18px 28px",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <h2 style={{ fontSize: "36px", margin: 0 }}>
                  {timeLeft.days.toString().padStart(2, "0")}
                </h2>
                <p style={{ margin: 0, fontSize: "14px" }}>Día(s)</p>
              </motion.div>
            </div>

            <p style={{ marginTop: "20px", fontSize: "17px" }}>
              Para registrarte en el Voto Digital
            </p>

            <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
              <a
                href="#"
                style={{
                  background: "#0b3b6f",
                  color: "white",
                  padding: "12px 30px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#ffd500";
                  e.currentTarget.style.color = "#0b3b6f";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#0b3b6f";
                  e.currentTarget.style.color = "white";
                }}
              >
                Regístrate aquí
              </a>

              <a
                href="#"
                style={{
                  background: "white",
                  border: "2px solid #0b3b6f",
                  color: "#0b3b6f",
                  padding: "12px 30px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#ffd500";
                  e.currentTarget.style.color = "#0b3b6f";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#0b3b6f";
                }}
              >
                ¿Eres parte de un grupo prioritario?
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN DE REQUISITOS ELIMINADA */}
    </div>
  );
}