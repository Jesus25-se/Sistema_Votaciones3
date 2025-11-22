import React from 'react';

export default function QueElegiremos() {
  const items = [
    {
      title: "Presidente",
      img: "https://eg2026.onpe.gob.pe/assets/img/Presidenta.png",
    },
    {
      title: "Vicepresidentes",
      img: "https://eg2026.onpe.gob.pe/assets/img/Vice-precidentes.png",
    },
    {
      title: "Congreso",
      img: "https://eg2026.onpe.gob.pe/assets/img/Senadores.png",
    },
    {
      title: "Parlamento Andino",
      img: "https://eg2026.onpe.gob.pe/assets/img/Parlamento-Andino.png",
    },
  ];

  return (
    // Reducimos el padding vertical de la sección
    <section className="py-4 bg-light"> 
      <div
        className="container text-center"
        style={{
          maxWidth: "1100px", // 🔹 Contenedor más estrecho
        }}
      >
        <h2
          style={{
            color: "#0b3b6f",
            fontSize: 30, // 🔹 Reducido de 36px a 30px
            fontWeight: 800,
          }}
        >
          ¿Qué elegiremos en estas Elecciones Generales 2026?
        </h2>

        <p
          style={{
            maxWidth: 800, // 🔹 Máximo ancho del párrafo reducido
            margin: "12px auto 30px", // 🔹 Espaciado reducido
            color: "#555",
            fontSize: 16, // 🔹 Reducido de 18px a 16px
          }}
        >
          Estas son las autoridades por las cuales votaremos en las próximas
          Elecciones Generales 2026.
        </p>

        {/* Contenedor de ítems */}
        <div
          className="d-flex justify-content-center align-items-start"
          style={{
            gap: 40, // 🔹 Separación entre ítems reducida de 70px a 40px
            marginTop: 35, // 🔹 Margen superior reducido
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingBottom: 10,
          }}
        >
          {items.map((it) => (
            <div 
              key={it.title} 
              style={{ 
                width: 180, // 🔹 Ancho del contenedor de ítem reducido de 230px a 180px
                textAlign: "center" 
              }}
            >
              <div
                style={{
                  width: 120, // 🔹 Tamaño del círculo reducido de 180px a 120px
                  height: 120, // 🔹 Tamaño del círculo reducido de 180px a 120px
                  margin: "0 auto 15px", // 🔹 Margen reducido
                  borderRadius: "50%",
                  background: "#fff",
                  border: "4px solid #0b83d6", // 🔹 Borde reducido de 6px a 4px
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // 🔹 Sombra más suave
                  transition: "transform 0.3s ease, border-color 0.3s ease",
                }}
              >
                <img
                  src={it.img}
                  alt={it.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.parentElement!.style.borderColor = "#0d9aff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.parentElement!.style.borderColor = "#0b83d6";
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 18, // 🔹 Tamaño del título de ítem reducido de 22px a 18px
                  color: "#0b3b6f",
                  fontWeight: 800,
                  marginTop: 4, // 🔹 Margen superior reducido
                }}
              >
                {it.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}