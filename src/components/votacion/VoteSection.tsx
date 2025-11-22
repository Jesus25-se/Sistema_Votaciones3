import React from "react";
import type { CategoriaId } from "./VoteNavbar";
import type { CandidatoInfo } from "../../services/mockData";

// La interfaz de Partido debe ser consistente con VoteForm.tsx
interface PartidoConCandidato {
    nombre: string;
    logo: string;
    candidato?: CandidatoInfo; // Propiedad opcional
}

interface VoteSectionProps {
    categoria: CategoriaId;
    partidos: PartidoConCandidato[]; 
    selected?: string | null;
    onSelect: (partido: string) => void;
    onVotar: () => void;
    submitting?: boolean;
    datosConfirmados: boolean; 
    onShowDetails: (
        candidato: CandidatoInfo, 
        logoUrl: string, 
        categoria: CategoriaId,
        nombrePartido: string
    ) => void; 
}

export default function VoteSection({
    categoria,
    partidos,
    selected,
    onSelect,
    onVotar,
    submitting = false,
    datosConfirmados,
    onShowDetails,
}: VoteSectionProps) {

    const handleClick = (p: PartidoConCandidato) => {
        if (!datosConfirmados) return; 
        onSelect(p.nombre);
    };
    
    const getSectionTitle = (cat: CategoriaId) => {
        switch (cat) {
            case "presidencial": return "PRESIDENCIAL";
            case "congreso": return "CONGRESO";
            case "parlamento": return "PARLAMENTO ANDINO";
            default: return "SELECCIÓN DE VOTO";
        }
    }

    const showCandidateDetails = categoria === "presidencial";

    // Mantenemos las alturas ajustadas para imágenes de 50px
    const minCardHeight = showCandidateDetails ? '160px' : '110px'; 

    return (
        <div className="container">
            <h3 className="text-center mb-4 fw-bold text-primary text-uppercase">
                {getSectionTitle(categoria)}
            </h3>

            <div className="row justify-content-center">
                {partidos.map((p, idx) => {
                    const isSelected = selected === p.nombre;
                    const candidatoExiste = !!p.candidato; 

                    return (
                        <div
                            // 🚀 CAMBIO CLAVE 1: Ajuste de columna a col-lg-4 para 3 tarjetas por fila (más ancho)
                            className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" 
                            key={p.nombre}
                            onClick={() => handleClick(p)}
                        >
                            <div
                                className={`card h-100 shadow-sm p-3 position-relative d-flex flex-row align-items-center ${ 
                                    isSelected
                                        ? "border-success border-4"
                                        : "border-2 border-light"
                                }`}
                                style={{ 
                                    cursor: datosConfirmados ? 'pointer' : 'default', 
                                    opacity: datosConfirmados ? 1 : 0.6,
                                    minHeight: minCardHeight,
                                }}
                            >
                                {/* Icono de Check */}
                                {isSelected && (
                                    <div 
                                        className="position-absolute top-0 end-0 p-2" 
                                        style={{ zIndex: 10 }}
                                    >
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.5rem' }}></i> 
                                    </div>
                                )}

                                {/* CONTENEDOR DE LOGO Y CANDIDATO (IZQUIERDA) */}
                                <div className="d-flex flex-column align-items-center me-3"> 
                                    <img
                                        src={p.logo}
                                        alt={`Logo de ${p.nombre}`}
                                        className="mb-1"
                                        style={{ 
                                            width: "50px", 
                                            height: "50px", 
                                            objectFit: "contain", 
                                            border: '1px solid #dee2e6' 
                                        }}
                                    />
                                    
                                    {/* Candidato: Solo en Presidencial */}
                                    {showCandidateDetails && p.candidato && (
                                        <img
                                            src={p.candidato.foto}
                                            alt={p.candidato.nombre}
                                            className="rounded-circle shadow-sm mt-1"
                                            style={{
                                                width: "50px", 
                                                height: "50px",
                                                objectFit: "cover",
                                                border: "2px solid #dee2e6",
                                            }}
                                        />
                                    )}
                                </div>

                                {/* CONTENIDO DE TEXTO (DERECHA) */}
                                <div className="d-flex flex-column flex-grow-1 h-100 justify-content-center"> 
                                    
                                    {/* Línea del Partido */}
                                    <div className="d-flex align-items-center mb-1" style={{ minHeight: '50px' }}> 
                                        <h6 className="text-uppercase mb-0 text-primary fw-bold" style={{ fontSize: '0.9rem' }}> 
                                            {p.nombre}
                                        </h6>
                                    </div>
                                    
                                    {/* Línea del Candidato (Solo en Presidencial) */}
                                    {showCandidateDetails && p.candidato && (
                                        <div className="d-flex align-items-center mb-1" style={{ minHeight: '50px' }}> 
                                            <p className="fw-semibold text-dark mb-0" style={{ fontSize: "0.8rem" }}> 
                                                {p.candidato.nombre}
                                            </p>
                                        </div>
                                    )}

                                    {/* Elementos de estado y detalles (Ver más) */}
                                    <div className="d-flex align-items-center justify-content-end mt-1">
                                        {isSelected && (
                                            <span className="badge bg-success fw-bold me-2" style={{ fontSize: '0.75rem' }}> 
                                                Seleccionado
                                            </span>
                                        )}
                                        
                                        {candidatoExiste && datosConfirmados && (
                                            <button 
                                                className="btn btn-sm p-0 fw-bold" // 🚀 CAMBIO CLAVE 2: Clase `text-warning` para un color más legible (ej: amarillo/naranja). Se añade `fw-semibold`.
                                                style={{ fontSize: '0.8rem', textDecoration: 'none', color: '#0090b4ff' }} // 🚀 Quitamos underline y lo ponemos más visible
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    onShowDetails(
                                                        p.candidato!, 
                                                        p.logo, 
                                                        categoria,
                                                        p.nombre 
                                                    );
                                                }}
                                            >
                                                {/* 🚀 CAMBIO CLAVE 3: Ícono de lupa o información */}
                                                <i className="bi bi-search me-1"></i> 
                                                Ver más
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Botón Votar */}
            <div className="text-center mt-3">
                <button
                    className="btn btn-primary px-5 fw-bold"
                    disabled={!selected || submitting || !datosConfirmados}
                    onClick={onVotar}
                >
                    {submitting ? "Registrando..." : "Confirmar Voto"}
                </button>
            </div>
        </div>
    );
}