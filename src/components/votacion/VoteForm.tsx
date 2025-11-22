import React, { useState, useMemo, useRef } from "react"; 
import { useNavigate } from "react-router-dom";
import type { Voto } from "../../types";
import type { CategoriaId } from "./VoteNavbar";

import VoteNavbar from "./VoteNavbar";
import VoteSection from "./VoteSection";

// 👇 IMPORTACIONES DE MODAL y TIPOS
import CandidatoModal from "./CandidatoModal.tsx"; 
import {
    getUsuarioPorDni,
    saveVoto,
    partidosSimulados,
    checkIfDniVotedAllCategories,
    type CandidatoInfo, // Tipo de datos de origen
} from "../../services/mockData";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🚀 FUNCIÓN AGREGADA: Componente de Ícono moderno
const Icon = ({ className, color }: { className: string, color: string }) => (
    // Se usa el icono de Bootstrap y se le da el color primario de la notificación
    <i className={`bi ${className} me-2`} style={{ fontSize: '1.25rem', color: color }}></i>
);

// Colores de borde para los íconos (deben coincidir con el CSS)
const ICON_COLORS = {
    success: '#6cbe6c',
    error: '#d9534f',
    info: '#5bc0de',
};


// Definición de tipo para los partidos en el estado
type PartidoConCandidatoLocal = {
    nombre: string;
    logo: string;
    candidato?: CandidatoInfo; // Propiedad opcional
};

// 🚨 NUEVO TIPO: Para manejar los pasos de la votación
type VotingStep = "DNI_CONFIRMATION" | "VOTING_SELECTION";

export default function VoteForm() {
    const navigate = useNavigate();
    const [dni, setDni] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [departamento, setDepartamento] = useState("");
    
    // 🚀 ESTADO AGREGADO: Almacena la fecha de nacimiento CORRECTA del usuario (obtenida de mockData)
    const [correctFechaNacimiento, setCorrectFechaNacimiento] = useState<string | null>(null); 
    // 🚀 ESTADO AGREGADO: Almacena la fecha de nacimiento INGRESADA por el usuario
    const [userFechaNacimiento, setUserFechaNacimiento] = useState(""); 
    
    const [categoriaActual, setCategoriaActual] =
        useState<CategoriaId>("presidencial");
    const [votoFinalizado, setVotoFinalizado] = useState(false);
    
    // 🚨 ESTADO: Controla la vista actual
    const [currentStep, setCurrentStep] = useState<VotingStep>("DNI_CONFIRMATION");

    // 🚀 ESTADO AGREGADO: Rastrea qué categorías ya votó este DNI.
    const [categoriasVotadas, setCategoriasVotadas] = useState<CategoriaId[]>([]); 

    const [selecciones, setSelecciones] = useState<Record<CategoriaId, string | null>>({
        presidencial: null,
        congreso: null,
        parlamento: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [datosConfirmados, setDatosConfirmados] = useState(false);
    
    // 🚀 REFERENCIA AGREGADA: Para hacer scroll al navbar
    const navbarRef = useRef<HTMLDivElement>(null); 

    // 👇 ESTADOS DEL MODAL
    const [showModal, setShowModal] = useState(false);
    const [candidatoModal, setCandidatoModal] = useState<CandidatoInfo | null>(null);
    const [nombrePartidoModal, setNombrePartidoModal] = useState(""); 


    // 👇 FUNCIONES DEL MODAL
    const handleShowDetails = (
        candidato: CandidatoInfo, 
        logoUrl: string, 
        categoria: CategoriaId,
        nombrePartido: string
    ) => {
        setCandidatoModal(candidato);
        setNombrePartidoModal(nombrePartido);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCandidatoModal(null);
        setNombrePartidoModal("");
    };

    const partidosPorCategoria = useMemo(() => {
        const categorias: CategoriaId[] = ["presidencial", "congreso", "parlamento"];
        
        const obj = {} as Record<CategoriaId, PartidoConCandidatoLocal[]>;
        categorias.forEach((cat) => {
            obj[cat] = partidosSimulados.map((p) => ({
                nombre: p.nombre,
                logo: p.logo,
                // Esto asigna CandidatoInfo (o undefined)
                candidato: p.candidatos[cat], 
            }));
        });
        return obj;
    }, []);

    const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, ''); 
        const finalValue = numericValue.slice(0, 8); 
        setDni(finalValue);
        // 🚨 Reseteamos la etapa y confirmación al cambiar el DNI
        setVotoFinalizado(false); 
        setDatosConfirmados(false);
        setCurrentStep("DNI_CONFIRMATION"); 
        setNombres(""); setApellidos(""); setDepartamento("");
        setCategoriasVotadas([]); // Reseteamos las categorías votadas al cambiar DNI
        setCorrectFechaNacimiento(null); // 🚀 Reseteamos la fecha correcta
        setUserFechaNacimiento(""); // 🚀 Reseteamos la fecha ingresada
    };

    const handleBuscar = () => {
        setDatosConfirmados(false);
        setVotoFinalizado(false);
        setCurrentStep("DNI_CONFIRMATION"); // Asegura que siempre estemos en la primera vista
        setCategoriasVotadas([]); // Reseteamos las categorías votadas al buscar
        setCorrectFechaNacimiento(null); // 🚀 Reseteamos la fecha correcta
        setUserFechaNacimiento(""); // 🚀 Reseteamos la fecha ingresada

        if (dni.length !== 8) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("El DNI debe tener exactamente 8 dígitos.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            return;
        }
        
        const yaVoto = checkIfDniVotedAllCategories(dni.trim());

        if (yaVoto) {
            const usuario = getUsuarioPorDni(dni.trim());
            setNombres(usuario ? usuario.nombres : "Usuario"); 
            setApellidos(usuario ? usuario.apellidos : "Registrado"); 
            setDepartamento(usuario ? usuario.departamento : "N/A");
            setVotoFinalizado(true); 
            // 🚀 TOAST ACTUALIZADO
            toast.error("Este DNI ya ha completado todo el proceso de votación.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            return;
        }

        const usuario = getUsuarioPorDni(dni.trim());
        if (usuario) {
            setNombres(usuario.nombres);
            setApellidos(usuario.apellidos);
            setDepartamento(usuario.departamento);
            // 🚀 ALMACENAR LA FECHA CORRECTA
            setCorrectFechaNacimiento(usuario.fechaNacimiento);
            // 🚀 TOAST ACTUALIZADO
            toast.info("Datos cargados. Ingrese su Fecha de Nacimiento para confirmar.", { 
                icon: <Icon className="bi-info-circle-fill" color={ICON_COLORS.info} /> 
            });
        } else {
            setNombres(""); setApellidos(""); setDepartamento("");
            // 🚀 TOAST ACTUALIZADO
            toast.error("DNI no encontrado en el registro", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
        }
    };

    const handleConfirmarDatos = () => {
        if (votoFinalizado) return; 

        // 🚀 NUEVA LÓGICA DE VERIFICACIÓN:
        if (!nombres || !apellidos || !correctFechaNacimiento) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("Busque su DNI primero y cargue sus datos.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            return;
        }

        // Compara la fecha ingresada (userFechaNacimiento) con la fecha correcta (correctFechaNacimiento)
        if (userFechaNacimiento.trim() !== correctFechaNacimiento) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("Fecha de Nacimiento incorrecta. Verifique sus datos.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            return;
        }

        // Si la verificación es exitosa:
        setDatosConfirmados(true);
        setCurrentStep("VOTING_SELECTION");
        
        // 🚀 TOAST ACTUALIZADO
        toast.success(`Bienvenido, ${nombres}. Inicie su votación.`, { 
            icon: <Icon className="bi-check-circle-fill" color={ICON_COLORS.success} /> 
        });

        // 🚀 SCROLL al navbar de votación para guiar al usuario
        if (navbarRef.current) {
            navbarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    const handleSelectPartido = (nombre: string) => {
        if (votoFinalizado || !datosConfirmados) return; 

        setSelecciones((s) => ({ ...s, [categoriaActual]: nombre }));
    };

    // 🚨 FUNCIÓN MODIFICADA: Se mantiene la lógica de avance y el dispatch del evento.
    const handleConfirmVoto = async () => {
        
        console.log("1. INICIO DE CONFIRMACIÓN: Se hizo click en Confirmar Voto.");

        if (votoFinalizado) return; 

        if (!dni || dni.length !== 8) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("Busque y confirme su DNI de 8 dígitos antes de emitir un voto.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            setCurrentStep("DNI_CONFIRMATION"); 
            return;
        }
        if (!datosConfirmados) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("Confirme sus datos primero.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            setCurrentStep("DNI_CONFIRMATION");
            return;
        }

        const partidoSeleccionado = selecciones[categoriaActual];
        if (!partidoSeleccionado) {
            // 🚀 TOAST ACTUALIZADO
            toast.error("Seleccione un partido antes de votar.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
            return;
        }

        setSubmitting(true);
        
        const partidoInfo = partidosPorCategoria[categoriaActual].find(
            (p) => p.nombre === partidoSeleccionado
        );

        // Se aseguran los campos 'nombres' y 'apellidos' para coincidir con el tipo Voto
        const voto: Voto = {
            dni: dni.trim(),
            nombres: nombres, 
            apellidos: apellidos, 
            categoria: categoriaActual,
            partido: partidoSeleccionado,
            candidato: partidoInfo?.candidato?.nombre || "Sin candidato", 
            region: departamento, 
        };

        const exito = saveVoto(voto);
        setSubmitting(false);

        if (exito) {
            
            console.log("2. VOTO REGISTRADO CON ÉXITO: Se llamó a saveVoto y retornó 'true'.");
            
            // 💡 ESTO SE MANTIENE: Notifica a AdminDashboard Y MetricsDashboard
            window.dispatchEvent(new Event('votoRegistrado')); 

            // Actualizar categorías votadas y limpiar selección
            setCategoriasVotadas((prev) => [...prev, categoriaActual]);
            setSelecciones((prev) => ({ ...prev, [categoriaActual]: null })); 
            
            const orden: CategoriaId[] = ["presidencial", "congreso", "parlamento"];
            
            // Lógica para encontrar la siguiente categoría no votada
            const categoriasRestantes = orden.filter(
                (cat) => !categoriasVotadas.includes(cat) && cat !== categoriaActual
            ) as CategoriaId[];

            if (categoriasRestantes.length > 0) {
                // Avanzar a la siguiente categoría pendiente
                const nextCategoria = categoriasRestantes[0];
                setCategoriaActual(nextCategoria);
                
                // 🚀 TOAST ACTUALIZADO
                toast.success(`Voto en ${categoriaActual.toUpperCase()} registrado. Continuando con ${nextCategoria.toUpperCase()}.`, { 
                    icon: <Icon className="bi-check-circle-fill" color={ICON_COLORS.success} /> 
                });
                
                // 🚀 SCROLL de vuelta al navbar
                if (navbarRef.current) {
                    navbarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            } else {
                // Finalizar votación
                // 🚀 TOAST ACTUALIZADO
                toast.success("Has completado las 3 votaciones. ¡Gracias por participar!", { 
                    icon: <Icon className="bi-check-circle-fill" color={ICON_COLORS.success} /> 
                });
                setVotoFinalizado(true); 
                // Redirigir al usuario
                setTimeout(() => navigate("/"), 1800); 
            }
        } else {
            console.error("2. FALLO AL REGISTRAR: saveVoto retornó 'false'. Este DNI ya votó esta categoría.");
            // 🚀 TOAST ACTUALIZADO
            toast.error("Ya ha emitido su voto en esta categoría o hubo un error.", { 
                icon: <Icon className="bi-exclamation-octagon-fill" color={ICON_COLORS.error} /> 
            });
        }
    };


    // 🚨 Nueva función para renderizar la sección de Confirmación de DNI
    const renderDniConfirmationSection = () => (
        <div className="card p-4 border-0 shadow-sm mb-4">
            <div className="row mb-3">
                <div className="col-md-8">
                    <label className="form-label fw-semibold">DNI (8 dígitos)</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese su DNI (ej. 12345678)"
                        value={dni}
                        onChange={handleDniChange} 
                        inputMode="numeric"
                        pattern="\d{8}"
                        maxLength={8}
                        disabled={votoFinalizado}
                    />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button 
                        className="btn btn-primary w-100 fw-semibold" 
                        onClick={handleBuscar}
                        disabled={votoFinalizado || dni.length !== 8} 
                    >
                        {votoFinalizado ? "Voto Registrado" : "Buscar"}
                    </button>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombres</label>
                    <input className="form-control" value={nombres} readOnly />
                    <label className="form-label fw-semibold mt-3">Departamento</label>
                    <input className="form-control" value={departamento} readOnly />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Apellidos</label>
                    <input className="form-control" value={apellidos} readOnly />
                    
                    {/* 🚀 NUEVO CAMPO DE FECHA DE NACIMIENTO */}
                    <label className="form-label fw-semibold mt-3">Fecha de Nacimiento (Verificación)</label>
                    <input 
                        type="date"
                        className="form-control"
                        value={userFechaNacimiento}
                        onChange={(e) => setUserFechaNacimiento(e.target.value)}
                        // Solo es editable si los datos se cargaron y aún no se han confirmado
                        disabled={!nombres || datosConfirmados || votoFinalizado} 
                    />
                </div>
            </div>

            {nombres && apellidos && !datosConfirmados && !votoFinalizado && (
                <div className="text-center mb-3 mt-4 border-top pt-3">
                    <button 
                        className="btn btn-success px-4 fw-semibold" 
                        onClick={handleConfirmarDatos}
                        // 🚀 Desactivar si la fecha de nacimiento aún no se ha ingresado
                        disabled={!userFechaNacimiento}
                    >
                        Confirmar y Verificar Datos
                    </button>
                </div>
            )}
            
            {votoFinalizado && (
                <div className="alert alert-danger text-center fw-bold mt-4" role="alert">
                    ¡Este DNI ya ha completado su votación y el proceso está finalizado!
                </div>
            )}

            <p className="text-muted small mb-0 mt-3">
                Siga el proceso: ingrese su DNI, busque sus datos y <span className="fw-bold text-dark">confirme ingresando su fecha de nacimiento</span> para pasar a la votación.
            </p>
        </div>
    );


    // 🚨 Función para renderizar la sección de Votación por Categoría
    const renderVotingSection = () => (
        <>
            {/* 🚀 Asignar la referencia al div que contiene el Navbar */}
            <div ref={navbarRef}> 
                {/* 🛑 PROPS REVERTIDOS A LOS ORIGINALES PARA EVITAR ERRORES */}
                <VoteNavbar 
                    current={categoriaActual} // Prop original
                    onSelect={setCategoriaActual} // Prop original
                    disabled={votoFinalizado} // Prop original
                    categoriasVotadas={categoriasVotadas} 
                />
            </div>
            <div className="card p-3 border-0 shadow-sm mb-4">
                {/* 🛑 PROPS REVERTIDOS A LOS ORIGINALES PARA EVITAR ERRORES */}
                <VoteSection
                    categoria={categoriaActual}
                    partidos={partidosPorCategoria[categoriaActual]}
                    selected={selecciones[categoriaActual] ?? null} // Prop original 'selected'
                    onSelect={handleSelectPartido}
                    onVotar={handleConfirmVoto} // Prop original 'onVotar'
                    submitting={submitting}
                    datosConfirmados={datosConfirmados && !votoFinalizado} 
                    onShowDetails={handleShowDetails} 
                />
            </div>
        </>
    );

    return (
        <div className="container mt-5" style={{ maxWidth: 980 }}>
            <h2 className="text-center fw-bold mb-4 text-primary">
                Boleta de Votación Electrónica
            </h2>

            {/* 🚨 RENDERIZADO CONDICIONAL BASADO EN currentStep */}
            {currentStep === "DNI_CONFIRMATION" && renderDniConfirmationSection()}
            {currentStep === "VOTING_SELECTION" && renderVotingSection()}

            {/* 👇 MODAL DE CANDIDATO */}
            {showModal && candidatoModal && (() => {
                const logoUrl = partidosPorCategoria[categoriaActual].find(
                    (p) => p.candidato?.nombre === candidatoModal.nombre 
                )?.logo || ""; 

                return (
                    <CandidatoModal
                        candidato={candidatoModal} 
                        show={showModal}
                        onClose={handleCloseModal}
                        logoPartidoUrl={logoUrl} 
                        categoria={categoriaActual}
                        nombrePartido={nombrePartidoModal}
                    />
                );
            })()}

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true} 
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="light" 
            />
        </div>
    );
}