import React from 'react';
import type { CSSProperties } from 'react'; 

// 1. Definición de datos para los pasos
const steps = [
    {
        titulo: "Identificación del votante",
        descripcion: "El usuario se autentica con su número de DNI antes de emitir su voto.",
        imagen: 'https://previews.123rf.com/images/stalkerstudent/stalkerstudent1501/stalkerstudent150100215/35071643-identification-card-icon-flat-design-style-eps.jpg', 
    },
    {
        titulo: "Selección del candidato",
        descripcion: "El votante elige su preferencia entre las opciones disponibles en pantalla.",
        imagen: 'https://img.freepik.com/vector-premium/iconos-candidatos_1134231-4705.jpg', 
    },
    {
        titulo: "Confirmación del voto",
        descripcion: "Antes de registrar el voto, el sistema solicita la confirmación del usuario.",
        imagen: 'https://img.freepik.com/vector-premium/icono-linea-confirmacion-voto-marca-comprobacion-voto-aprobacion-verificacion-elecciones-confirmacion-participacion-encuestas-democracia-boleta-voto-votante-voto-seguro-proceso-votacion-dia-elecciones_727385-14430.jpg', 
    },
    {
        titulo: "Almacenamiento seguro",
        descripcion: "Cada voto se guarda de forma cifrada y auditada para asegurar la integridad del proceso.",
        imagen: 'https://previews.123rf.com/images/wad/wad1605/wad160500208/57387306-secure-file-storage-icon-flat-design-long-shadow.jpg', 
    },
];

const ComoFunciona: React.FC = () => {

    const backgroundStyle: CSSProperties = {
        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/4/4f/Oficina_Nacional_de_Procesos_Electorales.JPG')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    };

    // La opacidad de 0.3 es correcta para ver el fondo.
    const overlayStyle: CSSProperties = {
        backgroundColor: 'rgba(255, 255, 255, 0.55)', 
        padding: '5rem 0', 
    };
    
    // 🚨 Reducción del tamaño de la imagen de paso para hacer la tarjeta más compacta
    const cardImageStyle: CSSProperties = {
        maxWidth: '90px', // 🚨 Reducido de 120px a 90px
        height: 'auto',
        margin: '10px auto', 
    };


    return (
        <section 
            id="como-votar" 
            style={backgroundStyle} 
        >
            <div style={overlayStyle}> 
                <div className="container text-center">
                    
                    <h2 className="section-title text-center text-dark fw-bold mb-2">Proceso Detallado: ¿Cómo Votar Digitalmente?</h2>
                    <p className="fs-6 mb-5 text-dark fw-medium">Sigue los pasos para emitir tu voto electrónico de forma segura.</p> 
                    
                    <h2 className="section-title text-center mt-5 text-dark fw-bold">¿Cómo funciona el sistema?</h2> 
                    
                    <div className="row mt-5">
                        {steps.map((step, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-4">
                                {/* 💡 Se mantiene p-2 para reducir el padding */}
                                <div className="card h-100 text-center p-2 shadow-sm process-step-card"> 
                                    <div className="card-body">
                                        
                                        {/* 🚨 Cambiado text-primary a text-dark para mejor contraste */}
                                        <span className="step-number fw-bold fs-4 text-dark">{index + 1}.</span> 
                                        
                                        {/* 🚨 Cambiado el color del título a text-dark */}
                                        <h3 className="card-title fw-bold fs-6 mt-2 text-dark">{step.titulo}</h3> {/* fs-6: Título más pequeño */}
                                        
                                        <p className="card-text text-muted small">{step.descripcion}</p> {/* small: Descripción más pequeña */}
                                        
                                        <img 
                                            src={step.imagen} 
                                            alt={step.titulo} 
                                            className="img-fluid process-image" 
                                            style={cardImageStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ComoFunciona;