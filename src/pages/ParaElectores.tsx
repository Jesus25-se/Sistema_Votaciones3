import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";

export default function ParaElectores() {
  return (
    <div
      style={{
        fontFamily: "'Poppins', Arial, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sección principal (fondo blanco) - Ocupa el espacio disponible */}
      <section
        style={{
          backgroundColor: "#ffffff",
          color: "#0b3b6f",
          // 💡 REDUCCIÓN CLAVE: De 80px a 50px de padding vertical
          padding: "50px 0", 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1, 
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // 💡 Reducción del gap entre columnas
            gap: "30px", 
            maxWidth: "1200px",
            width: "90%",
          }}
        >
          {/* Texto animado */}
          <motion.div
            style={{ flex: 1, minWidth: "320px" }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{
                // 💡 Reducción del tamaño del título
                fontSize: "32px", 
                fontWeight: "800",
                // 💡 Reducción del margen inferior
                marginBottom: "15px", 
                color: "#0b3b6f",
              }}
            >
              ETLV a nivel nacional
            </h1>
            <p
              style={{
                // 💡 Reducción del tamaño del párrafo
                fontSize: "16px", 
                lineHeight: 1.5, // Ligeramente más compacto
                marginBottom: "15px", // Reducción del margen
              }}
            >
              La ONPE pondrá a disposición de todos los peruanos residentes en
              territorio nacional el aplicativo "Elige tu local de votación".
            </p>
            <p
              style={{
                // 💡 Reducción del tamaño del párrafo
                fontSize: "16px", 
                lineHeight: 1.5, // Ligeramente más compacto
                marginBottom: "15px", // Reducción del margen
              }}
            >
              Así, se podrán seleccionar hasta 3 opciones de local de votación,
              que la ONPE tomará en consideración al momento de designar el local
              de votación de cada persona.
            </p>
            <motion.p
              style={{
                // 💡 Reducción del tamaño y margen superior
                fontSize: "16px", 
                fontWeight: "700",
                marginTop: "20px", 
                color: "#ffd500",
                fontFamily: "'Poppins', sans-serif",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Próximamente elige tu local de votación aquí
            </motion.p>
          </motion.div>

          {/* Imagen animada */}
          <motion.div
            style={{
              flex: 1,
              minWidth: "320px",
              display: "flex",
              justifyContent: "center",
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://eg2026.onpe.gob.pe/assets/img/Elige-local-16set.png"
              alt="Elige tu local de votación"
              style={{
                maxWidth: "90%",
                height: "auto",
                borderRadius: "14px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.15)", // Sombra ligeramente reducida
                transition: "transform 0.3s ease",
              }}
              whileHover={{ scale: 1.03 }}
            />
          </motion.div>
        </div>
      </section>

      {/* FOOTER - Siempre abajo */}
      <Footer />
    </div>
  );
}