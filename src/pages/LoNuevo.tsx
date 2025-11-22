import { useState } from "react";
import Footer from "../components/layout/Footer";

export default function LoNuevo() {
  const [section, setSection] = useState("cedula");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const preguntas = [
    {
      q: "¿Dónde puedo consultar mi local de votación?",
      a: "Puedes ingresar al portal oficial de la ONPE, en la sección “Para electores”. Ahí encontrarás el enlace “Elige tu local de votación”, donde podrás verificar tu local asignado de forma rápida y gratuita.",
    },
    {
      q: "¿Qué pasa si no voto en las elecciones generales?",
      a: "Si no acudes a votar, deberás pagar una multa económica cuyo monto depende de la clasificación socioeconómica de tu distrito. Esta sanción se registra en el sistema del RENIEC hasta que sea cancelada.",
    },
    {
      q: "¿Cómo puedo justificar mi inasistencia a votar?",
      a: "Si tu ausencia se debe a una causa justificada —como enfermedad, viaje al extranjero o fuerza mayor—, puedes presentar tu solicitud de dispensa o justificación a través del portal web de la ONPE.",
    },
    {
      q: "¿Qué documentos debo llevar para votar?",
      a: "Solo necesitas portar tu DNI azul o electrónico vigente. No es necesario presentar ningún otro documento adicional.",
    },
    {
      q: "¿Cómo puedo saber si soy miembro de mesa?",
      a: "La ONPE publica las listas de miembros de mesa semanas antes de las elecciones. Puedes verificarlo ingresando tu número de DNI en la plataforma oficial.",
    },
    {
      q: "¿Dónde puedo realizar reclamos sobre el padrón electoral?",
      a: "Los reclamos deben dirigirse al Jurado Nacional de Elecciones (JNE), aunque la ONPE también brinda orientación sobre los procedimientos disponibles.",
    },
    {
      q: "¿Qué debo hacer si pierdo mi DNI antes de las elecciones?",
      a: "Debes solicitar un duplicado ante el RENIEC lo antes posible. Si no lo recibes a tiempo, podrás votar presentando el comprobante de trámite.",
    },
    {
      q: "¿El voto es obligatorio para los peruanos en el extranjero?",
      a: "Sí, aunque la multa por omisión es simbólica. Los ciudadanos en el exterior votan en las embajadas o consulados designados por el Ministerio de Relaciones Exteriores.",
    },
    {
      q: "¿Cómo se garantiza la transparencia del proceso electoral?",
      a: "La ONPE cuenta con fiscalización permanente, observadores internacionales, sistemas de seguridad digital y presencia de personeros de los partidos políticos en cada mesa de votación.",
    },
    {
      q: "¿Qué es el voto electrónico y en qué distritos se aplica?",
      a: "Es una modalidad moderna, rápida y segura que permite emitir el voto de forma digital. Se aplica progresivamente en distintas regiones del país, garantizando la confidencialidad del sufragio y la eficiencia del conteo.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Contenido principal - Ocupa el espacio disponible */}
      <div 
        style={{ flex: 1, padding: "0 20px 40px 20px" }}
      >
        
        {/* Botones de navegación */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "40px",
            marginTop: "60px", 
          }}
        >
          {[
            { id: "cedula", label: "Cédula de sufragio" },
            { id: "preguntas", label: "Preguntas frecuentes" },
            { id: "conservacion", label: "Conservación de cédulas" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSection(btn.id)}
              style={{
                backgroundColor: section === btn.id ? "#0b3b6f" : "#fff",
                color: section === btn.id ? "#fff" : "#0b3b6f",
                border: "2px solid #0b3b6f",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transform: section === btn.id ? "scale(1.05)" : "scale(1)",
                transition: "all 0.25s ease-in-out",
                boxShadow:
                  section === btn.id
                    ? "0 4px 10px rgba(11,59,111,0.3)"
                    : "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Contenido dinámico */}
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {section === "cedula" && (
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  color: "#0b3b6f",
                  // 💡 Título más pequeño
                  fontSize: "24px", 
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                Cédula de sufragio
              </h2>
              <p 
                style={{ 
                  // 💡 Texto de cuerpo más pequeño
                  fontSize: "16px", 
                  color: "#333", 
                  marginBottom: "20px" 
                }}
              >
                En las Elecciones Generales 2026, contaremos con una cédula de
                sufragio con cinco columnas, cada una representa una elección
                distinta: fórmula presidencial, senadores a nivel nacional,
                senadores a nivel regional, diputados y representantes ante el
                Parlamento Andino.
                <br />
                <br />
                Mira el video que hemos preparado para ti sobre la cédula:
              </p>
              <iframe
                width="85%"
                // 💡 Altura del video reducida
                height="400" 
                src="https://www.youtube.com/embed/1l0783CZRWA"
                title="Cédula de sufragio ONPE"
                style={{ borderRadius: "10px", border: "none" }}
                allowFullScreen
              ></iframe>
            </div>
          )}

          {section === "preguntas" && (
            <div>
              <h2
                style={{
                  color: "#0b3b6f",
                  // 💡 Título más pequeño
                  fontSize: "24px", 
                  fontWeight: "bold",
                  marginBottom: "25px",
                  textAlign: "center",
                }}
              >
                Preguntas frecuentes
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {preguntas.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff",
                      border: "2px solid #0b3b6f",
                      borderRadius: "10px",
                      padding: "15px 20px",
                      transition: "all 0.3s ease",
                      boxShadow:
                        openIndex === index
                          ? "0 4px 12px rgba(11,59,111,0.2)"
                          : "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      onClick={() => toggleQuestion(index)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#0b3b6f",
                        fontWeight: "600",
                        fontSize: "18px",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {item.q}
                      <span
                        style={{
                          fontSize: "22px",
                          transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        +
                      </span>
                    </div>

                    <div
                      style={{
                        maxHeight: openIndex === index ? "300px" : "0px",
                        overflow: "hidden",
                        transition: "all 0.4s ease",
                        color: "#333",
                        // 💡 Texto de respuesta más pequeño
                        fontSize: "16px", 
                        marginTop: openIndex === index ? "10px" : "0px",
                        opacity: openIndex === index ? 1 : 0,
                        lineHeight: "1.8",
                      }}
                    >
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conservación de cédulas con texto más corto y a la izquierda */}
          {section === "conservacion" && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "40px",
                flexWrap: "nowrap",
              }}
            >
              <div style={{ flex: "1", textAlign: "justify", paddingLeft: "30px" }}>
                <h2
                  style={{
                    color: "#0b3b6f",
                    // 💡 Título más pequeño
                    fontSize: "24px", 
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  Conservación de Cédulas
                </h2>
                <p
                  style={{
                    // 💡 Texto de cuerpo más pequeño
                    fontSize: "16px", 
                    color: "#333",
                    lineHeight: "1.8", // Reducido el interlineado de 2 a 1.8 para compactar más
                    maxWidth: "95%",
                  }}
                >
                  Concluido el escrutinio, las cédulas de sufragio son lacradas y
                  remitidas a la ONPE para su custodia y conservación bajo estricta
                  responsabilidad institucional. Permanecen resguardadas hasta la
                  publicación oficial de los resultados del JNE.  
                  <br />
                  <br />
                  Posteriormente, la ONPE realiza un acto público para destruirlas
                  en presencia del Ministerio Público, el JNE y los personeros de
                  las organizaciones políticas, garantizando total transparencia y
                  legalidad del proceso electoral.
                </p>
              </div>

              <div style={{ flex: "1", textAlign: "right", paddingRight: "40px" }}>
                <img
                  src="https://eg2026.onpe.gob.pe/assets/img/cedulas.png"
                  alt="Conservación de cédulas"
                  style={{
                    // 💡 Imagen reducida para hacerla más pequeña
                    width: "85%", 
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}