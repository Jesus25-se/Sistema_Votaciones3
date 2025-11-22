import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";
import type { CSSProperties } from 'react';

export default function Cronologia() {
  const eventos = [
    {
      titulo: "Convocatoria a Elecciones Generales 2026",
      fecha: "26 de marzo de 2025",
      descripcion:
        "Inicio oficial del proceso electoral. Desde este día se habilitan los plazos para inscripción de alianzas y partidos políticos.",
    },
    {
      titulo: "Inscripción de Alianzas Electorales",
      fecha: "Hasta el 12 de abril de 2025",
      descripcion:
        "Las organizaciones políticas registran sus alianzas ante el Jurado Nacional de Elecciones (JNE).",
    },
    {
      titulo: "Presentación de Listas de Candidatos",
      fecha: "Hasta el 12 de junio de 2025",
      descripcion:
        "Los partidos presentan sus listas para Presidente, Congreso y Parlamento Andino ante los jurados electorales especiales.",
    },
    {
      titulo: "Publicación de Listas Admitidas",
      fecha: "Agosto de 2025",
      descripcion:
        "El JNE publica las listas admitidas e inicia el periodo de tachas y exclusiones según la normativa vigente.",
    },
    {
      titulo: "Inicio de la Campaña Electoral",
      fecha: "Septiembre de 2025",
      descripcion:
        "Comienza oficialmente la difusión de propuestas y planes de gobierno por medios autorizados.",
    },
    {
      titulo: "Debates Presidenciales",
      fecha: "Octubre - Noviembre de 2025",
      descripcion:
        "El JNE organiza debates televisados para informar al electorado sobre los candidatos y sus propuestas.",
    },
    {
      titulo: "Elecciones Generales",
      fecha: "Abril de 2026",
      descripcion:
        "La ciudadanía acude a votar para elegir al Presidente, Vicepresidentes y Congresistas de la República.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Contenido principal */}
      <div className="container py-5" style={{ flex: 1 }}>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-5"
        >
          <h1 className="fw-bold text-primary mb-3">
            Acerca del Proceso Electoral 2026
          </h1>
          <div className="mx-auto bg-primary rounded-pill" style={{ width: "100px", height: "4px" }}></div>
          <p className="text-secondary mt-3 mx-auto" style={{ maxWidth: "600px" }}>
            Etapas principales del proceso electoral peruano para las Elecciones
            Generales 2026, garantizadas por la ONPE, el JNE y el RENIEC.
          </p>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        
        {/* LISTA DE EVENTOS: Estructura de Cronología (Timeline) */}
        <div 
          style={{ 
            position: 'relative', 
            maxWidth: '800px', 
            margin: '0 auto', 
            padding: '20px 0',
          }}
        >
          {/* Línea Central de la Cronología */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '4px',
              backgroundColor: '#0d6efd',
              transform: 'translateX(-50%)',
              zIndex: 0, // Fondo detrás de las tarjetas y puntos
            }}
          />

          {eventos.map((item, index) => {
            // Determina si el evento va a la izquierda (índice par) o a la derecha (índice impar)
            const isLeft = index % 2 === 0;
            
            const itemContainerStyle: CSSProperties = {
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                marginBottom: '40px',
                position: 'relative',
                width: '100%',
            };
            
            const cardWrapperStyle: CSSProperties = {
                width: '50%',
                // Añade padding en el lado opuesto a la línea central
                padding: isLeft ? '0 30px 0 0' : '0 0 0 30px',
                // !!! CORRECCIÓN: Quitamos el `textAlign` aquí para aplicarlo dentro de la tarjeta
                zIndex: 1,
            };

            const dotStyle: CSSProperties = {
                position: 'absolute',
                top: '50%', // Centrado verticalmente
                // Posiciona el punto exactamente sobre la línea central
                transform: `translateY(-50%) ${isLeft ? 'translateX(100%)' : 'translateX(-100%)'}`,
                [isLeft ? 'right' : 'left']: '50%', // Lo ancla a la mitad del contenedor (la posición de la línea)
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#0d6efd',
                border: '4px solid #fff', // Borde blanco para resaltar sobre la línea
                zIndex: 10,
            };

            return (
              <div key={index} style={itemContainerStyle}>
                
                {/* Punto Central de la Cronología */}
                <span style={dotStyle} />

                <motion.div
                  // Animación de entrada: la tarjeta "entra" desde su lado correspondiente
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }} 
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.05, // Animación al pasar el ratón
                    boxShadow: "0 6px 18px rgba(13, 110, 253, 0.3)",
                  }}
                  viewport={{ once: true }} // Solo anima al entrar por primera vez
                  style={cardWrapperStyle}
                >
                  <div 
                    className="card h-100 shadow-sm"
                    style={{
                      border: '1px solid #0d6efd',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div 
                      className="card-body p-3"
                      // !!! CORRECCIÓN: Aplicamos 'text-center' directamente al body de la tarjeta
                      style={{ textAlign: 'center' }} 
                    >
                      
                      {/* Fecha - Eliminamos las clases de alineación que interferían con el centrado del body */}
                      <p className={`text-muted small fw-bold mb-1`}>
                        <i className="bi bi-calendar-event me-2"></i> {item.fecha}
                      </p>
                      
                      {/* Título del Evento - Eliminamos las clases de alineación */}
                      <h5 className={`card-title fw-semibold text-primary mb-2`}>
                        {item.titulo}
                      </h5>
                      
                      {/* Descripción - Eliminamos las clases de alineación */}
                      <p className={`card-text text-secondary small mb-0`}>
                        {item.descripcion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
        
        {/* ------------------------------------------------------------- */}
      </div>

      {/* FOOTER COMPLETO */}
      <Footer />
    </div>
  );
}