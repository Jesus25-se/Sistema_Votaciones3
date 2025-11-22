import React, { useState } from 'react';
import type { CSSProperties } from 'react'; 
import type { CandidatoInfo } from '../../services/mockData';
import type { CategoriaId } from './VoteNavbar'; 

interface CandidatoModalProps {
    candidato: CandidatoInfo; 
    show: boolean;
    onClose: () => void;
    logoPartidoUrl: string;
    categoria: CategoriaId; 
    nombrePartido: string; 
}

// Estilos base para la imagen (se mantiene por si acaso)
const defaultImageStyle: CSSProperties = {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    margin: '0 auto',
};

// Color de éxito más oscuro para mejor contraste en íconos
const SUCCESS_COLOR = '#0f5132'; 

export default function CandidatoModal({ 
    candidato, 
    show, 
    onClose, 
    logoPartidoUrl, 
    categoria,
    nombrePartido 
}: CandidatoModalProps) {
    
    // 🚨 LÓGICA CLAVE: TRUE solo si es la categoría Presidencial
    const isPresidential = categoria === 'presidencial';

    // Lógica de Imagen (se usa el logo como fallback si no es presidencial o si falla la carga)
    // El 'candidato.foto' solo tiene sentido si isPresidential es true.
    const initialImageSource = candidato.foto; 
    const [imageSource, setImageSource] = useState(initialImageSource);
    const [imageError, setImageError] = useState(false);

    const handleError = () => {
        if (!imageError) {
            setImageSource(logoPartidoUrl);
            setImageError(true);
        }
    };

    const imageStyle: CSSProperties = {
        ...defaultImageStyle,
        borderRadius: isPresidential ? '50%' : '10px', 
        border: `4px solid var(--bs-primary, #0d6efd)`, 
        transition: 'all 0.3s',
    };

    const getTitle = () => {
        switch (categoria) {
            case "presidencial": return "DETALLES: CANDIDATO PRESIDENCIAL";
            case "congreso": return "DETALLES: PLANCHA CONGRESAL"; 
            case "parlamento": return "DETALLES: PARLAMENTO ANDINO"; 
            default: return "DETALLES DEL PARTIDO";
        }
    }
    
    // Función de ayuda para el título descriptivo
    const getInfoTitle = () => {
        // 🚨 CAMBIO DE CONTENIDO: El título se adapta
        return isPresidential 
            ? `SOBRE EL CANDIDATO ${candidato.nombre.split(' ')[0].toUpperCase()}:` 
            : `ENFOQUE Y PRINCIPIOS DEL PARTIDO ${nombrePartido.toUpperCase()}:`;
    }

    const modalStyle: CSSProperties = {
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    };

    if (!show) return null;

    // 🚨 CAMBIO DE TÍTULO: Mostrar el nombre del candidato solo en presidencial.
    const mainTitle = isPresidential ? candidato.nombre : `Plancha de ${nombrePartido}`; 
    // Usamos el nombre del partido como título principal para congreso/parlamento

    return (
        <div className="modal show fade" style={modalStyle} tabIndex={-1}>
            {/* Se mantiene modal-md y sin scroll para evitar el desbordamiento */}
            <div className="modal-dialog modal-md modal-dialog-centered"> 
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white p-3"> 
                        <h5 className="modal-title fw-bolder" style={{ fontSize: '1.25rem' }}>{getTitle()}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        
                        {/* 🚀 ANIMACIÓN 1: Logo y Nombre del Partido */}
                        <div className="d-flex align-items-center mb-3 pb-2 border-bottom animated-content animate__slide-left">
                            <img 
                                src={logoPartidoUrl} 
                                alt="Logo del Partido"
                                className="me-3"
                                style={{ width: "50px", height: "50px", objectFit: "contain", border: '1px solid #e9ecef' }}
                            />
                            {/* 🚨 CAMBIO DE CONTENIDO: Siempre muestra el nombre del Partido en este bloque */}
                            <h4 className="fw-bolder text-dark mb-0" style={{ fontSize: '1.35rem' }}>{nombrePartido}</h4> 
                        </div>
                        
                        {/* 🚀 ANIMACIÓN 2: Título principal (Candidato o Plancha) */}
                        <h3 className="text-center mb-3 fw-bold text-dark animated-content animate__slide-left" style={{ fontSize: '1.5rem' }}>{mainTitle}</h3>
                        
                        <div className="row">
                            
                            {/* 🚨 CAMBIO CLAVE 1: Columna de Imagen (SOLO se muestra si es Presidencial) */}
                            {isPresidential && (
                                <div className="col-4 text-center d-flex align-items-center justify-content-center animated-content animate__slide-left">
                                    <img
                                        src={imageSource}
                                        alt={candidato.nombre}
                                        className="img-fluid shadow-lg"
                                        style={imageStyle}
                                        onError={handleError}
                                    />
                                </div> 
                            )}
                            
                            {/* 🚨 CAMBIO CLAVE 2: Columna de Contenido 
                                Usa col-8 si hay foto (isPresidential) y col-12 si no hay foto */}
                            <div className={`animated-content animate__slide-right ${isPresidential ? 'col-8' : 'col-12'}`}>
                                
                                {/* DESCRIPCIÓN */}
                                <h6 className="fw-bold text-dark mt-1 mb-1">{getInfoTitle()}</h6>
                                <p className="text-dark" style={{ lineHeight: 1.4, fontSize: '0.9rem' }}>
                                    {/* Mostrar la descripción que aplica a la categoría */}
                                    {candidato.descripcion}
                                </p>

                                <hr className="my-2"/>

                                {/* Propuestas Clave */}
                                <h6 className="fw-bold text-dark mb-1">Puntos Clave:</h6>
                                <ul className="list-unstyled text-dark">
                                    {/* Usamos slice para evitar una lista excesivamente larga */}
                                    {candidato.propuestas.slice(0, 5).map((propuesta, index) => ( 
                                        <li key={index} className="mb-1 d-flex align-items-start">
                                            <i className="bi bi-check-circle-fill me-2" style={{ color: SUCCESS_COLOR, fontSize: '1rem', marginTop: '2px' }}></i> 
                                            <span className="fw-medium" style={{ fontSize: '0.85rem', lineHeight: 1.3 }}>{propuesta}</span>
                                        </li>
                                    ))}
                                    {candidato.propuestas.length > 5 && (
                                        <li className="mt-2" style={{ fontSize: '0.8rem' }}>...y más puntos de la plancha.</li>
                                    )}
                                </ul>
                            </div>
                        </div> 
                    </div>
                    
                    {/* 🚀 ANIMACIÓN 5: Footer */}
                    <div className="modal-footer d-flex justify-content-center animated-content animate__fade-in-footer">
                        <button type="button" className="btn btn-primary px-5 fw-bold" onClick={onClose}>Cerrar Detalle</button>
                    </div>
                </div>
            </div>
        </div>
    );
}