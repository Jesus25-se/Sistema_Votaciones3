import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      style={{
        backgroundColor: "#0b3b6f",
        color: "white",
        textAlign: "center",
        padding: "50px 20px",
        borderTop: "6px solid #ffd500",
        marginTop: "60px",
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "flex-start",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
          gap: "40px",
        }}
      >
        {/* Columna 1: Oficina Central */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3
            style={{
              color: "#ffd500",
              marginBottom: "10px",
              fontSize: "17px",
              fontWeight: "600",
            }}
          >
            Oficina central
          </h3>
          <p style={{ margin: "6px 0", fontSize: "15px" }}>
            Jr. Washington 1894, Cercado de Lima
          </p>
          <p style={{ margin: "6px 0", fontSize: "15px" }}>
            Lunes a viernes de 8:30 a. m. a 5:00 p. m.
          </p>
        </div>

        {/* Columna 2: Derechos reservados y redes sociales (CENTRO) */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <p style={{ margin: "6px 0", fontSize: "15px", fontWeight: "600" }}>
            © 2025 Sistema Nacional de Votaciones
          </p>
          <p style={{ margin: "6px 0", fontSize: "14px" }}>
            Desarrollado con fines educativos — Todos los derechos reservados.
          </p>
          <p style={{ margin: "15px 0 10px 0", fontSize: "15px", fontWeight: "600" }}>
            SÍGUENOS EN NUESTRAS REDES SOCIALES:
          </p>
          {/* Redes sociales */}
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
            <a href="https://www.facebook.com/ONPEoficial?locale=es_LA" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff" }}>
              <Facebook size={20} />
            </a>
            <a href="https://x.com/ONPE_oficial" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff" }}>
              <Twitter size={20} />
            </a>
            <a href="https://www.instagram.com/onpe_oficial/" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff" }}>
              <Instagram size={20} />
            </a>
            <a href="https://www.linkedin.com/company/onpeoficial/?originalSubdomain=pe" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff" }}>
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Columna 3: Contáctanos */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3
            style={{
              color: "#ffd500",
              marginBottom: "10px",
              fontSize: "17px",
              fontWeight: "600",
            }}
          >
            Contáctanos
          </h3>
          <p style={{ margin: "6px 0", fontSize: "15px" }}>
            informes@onpe.gob.pe
          </p>
          <p style={{ margin: "6px 0", fontSize: "15px" }}>(01) 4170630</p>
          <p style={{ margin: "6px 0", fontSize: "15px" }}>
            Whatsapp: 995 404 991
          </p>
        </div>
      </div>
    </motion.footer>
  );
}