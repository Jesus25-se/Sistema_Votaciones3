import { useState, useEffect, useMemo } from "react";
import { Database, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

// --- CONSTANTES DE LOCAL STORAGE ---
const PENDING_DATASETS_KEY = "pendingDatasets";
const CLEANED_VOTES_KEY = 'cleanedUploadedVotes'; 

// --- TIPOS DE DATOS COMPARTIDOS ---
type CategoriaVoto = 'presidencial' | 'congreso' | 'parlamento';
type DatasetType = "partidos" | "resultados"; 
// 💡 DatasetStatus: Mantenemos el tipo literal
type DatasetStatus = "pending" | "verified" | "error"; 

export interface VoteRecord {
    DNI: string;
    categoria: CategoriaVoto;
    partido: string;
    region: string;
    mesa: number;
    candidato: string;
}

interface DataIssue {
    id: string;
    type: string;
    description: string;
    level: "WARNING" | "ERROR";
}

export interface PendingDataset {
    id: string;
    name: string;
    type: DatasetType;
    records: number;
    uploadDate: string;
    status: DatasetStatus; // Usamos el tipo literal
    rawData: VoteRecord[];
    issues?: DataIssue[];
}


// 💡 UTILITIES para manejo de localStorage (Seguras)

// Función para obtener datasets pendientes de forma segura
const getPendingDatasets = (): PendingDataset[] => {
    const data = localStorage.getItem(PENDING_DATASETS_KEY);
    // Aseguramos que siempre devolvemos un array
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al parsear datasets pendientes:", e);
        return [];
    }
};

// Función para guardar datasets pendientes
const savePendingDatasets = (datasets: PendingDataset[]) => {
    localStorage.setItem(PENDING_DATASETS_KEY, JSON.stringify(datasets));
};

// Función para obtener los votos limpios existentes de forma segura
const getCleanedVotes = (): VoteRecord[] => {
    const data = localStorage.getItem(CLEANED_VOTES_KEY);
    // Aseguramos que el valor devuelto sea un array, NO null.
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al parsear votos limpios:", e);
        return [];
    }
};

export default function DataCleaning() {
    const [datasets, setDatasets] = useState<PendingDataset[]>(getPendingDatasets());
    const [isCleaning, setIsCleaning] = useState(false);

    // Cargar los datasets al montar y al recibir el evento 'datasetUploaded'
    useEffect(() => {
        const loadDatasets = () => {
            setDatasets(getPendingDatasets());
        };

        // Escucha el evento disparado desde DataUpload
        window.addEventListener('datasetUploaded', loadDatasets);
        
        // Carga inicial
        loadDatasets();

        return () => {
            window.removeEventListener('datasetUploaded', loadDatasets);
        };
    }, []);
    

    // 🚨 Función para simular la verificación de datos y detectar problemas
    const handleVerifyDataset = (id: string, rawData: VoteRecord[]) => {
        if (isCleaning) return;
        setIsCleaning(true);
        toast.info("Iniciando proceso de verificación de datos...");

        // Simulación: La verificación toma 1.5 segundos
        setTimeout(() => {
            // 1. Lógica de Simulación de Verificación:
            const issues: DataIssue[] = [];
            const invalidCategories = ["nulo", "error", "blanco"];
            
            rawData.forEach((record, index) => {
                // Simulación de ERROR: DNI no válido
                if (!record.DNI || record.DNI.length !== 8) {
                    issues.push({
                        id: `issue-${id}-${index}-dni`,
                        type: "DNI Inválido",
                        description: `Registro #${index + 1}: El DNI '${record.DNI}' no tiene 8 dígitos.`,
                        level: "ERROR",
                    });
                }
                // Simulación de WARNING: Votos no válidos (se mantienen pero se advierte)
                if (invalidCategories.includes(record.partido.toLowerCase())) {
                    issues.push({
                        id: `issue-${id}-${index}-invalid`,
                        type: "Voto No Válido",
                        description: `Registro #${index + 1}: Voto a ${record.partido} (Blanco/Nulo).`,
                        level: "WARNING",
                    });
                }
            });

            // 2. Actualizar el dataset en el estado y localStorage
            setDatasets(prevDatasets => {
                const updatedDatasets = prevDatasets.map(d => {
                    if (d.id === id) {
                        if (issues.some(i => i.level === "ERROR")) {
                            toast.error(`Verificación finalizada con ${issues.filter(i => i.level === "ERROR").length} ERRORES en el dataset: ${d.name}`);
                            // 🛑 CORRECCIÓN: Usamos 'as PendingDataset' para mantener el tipo literal 'DatasetStatus'
                            return { ...d, status: "error", issues } as PendingDataset; 
                        }
                        
                        // Si solo hay WARNINGS o es limpio
                        toast.success(`Verificación COMPLETA. Listo para aplicar. Dataset: ${d.name}`);
                        // 🛑 CORRECCIÓN: Usamos 'as PendingDataset' para mantener el tipo literal 'DatasetStatus'
                        return { ...d, status: "verified", issues } as PendingDataset;
                    }
                    return d;
                });
                
                // 🛑 CORRECCIÓN: Aunque el error se da en el map, aseguramos el tipo en la función de utilidad también.
                savePendingDatasets(updatedDatasets as PendingDataset[]); 
                return updatedDatasets as PendingDataset[];
            });
            
            setIsCleaning(false);
        }, 1500);
    };

    // 🚨 Función para aplicar el dataset limpio al sistema de votación (CLEANED_VOTES_KEY)
    const handleApplyDataset = (datasetId: string, rawData: VoteRecord[]) => {
        if (isCleaning) return;
        setIsCleaning(true);
        toast.info("Aplicando dataset al sistema de resultados...");
        
        // Simulación: La aplicación toma 1 segundo
        setTimeout(() => {
            // 1. Obtener los votos limpios existentes de forma segura
            const existingCleanedVotes = getCleanedVotes();
            
            // 2. Fusionar los nuevos datos 
            const validDataToApply = rawData.filter(r => r.DNI && r.DNI.length === 8) as VoteRecord[];
            
            const mergedData = [...existingCleanedVotes, ...validDataToApply]; 

            // 3. Guardar los datos fusionados
            localStorage.setItem(CLEANED_VOTES_KEY, JSON.stringify(mergedData));

            // 4. Eliminar el dataset de la lista de pendientes
            setDatasets(prevDatasets => {
                const updatedDatasets = prevDatasets.filter(d => d.id !== datasetId);
                savePendingDatasets(updatedDatasets);
                return updatedDatasets;
            });
            
            // 5. 🚀 DISPARAR EVENTO DE ACTUALIZACIÓN: Notifica al AdminDashboard
            window.dispatchEvent(new Event('cleanedDataApplied'));
            
            toast.success("Dataset aplicado con éxito. Resultados actualizados.");
            setIsCleaning(false);

        }, 1000);
    };


    // Filtramos los datasets que están pendientes de una acción (no los que ya fallaron)
    const activeDatasets = useMemo(() => 
        datasets.filter(d => d.status !== 'error')
    , [datasets]);

    const errorDatasets = useMemo(() => 
        datasets.filter(d => d.status === 'error')
    , [datasets]);

    
    return (
        <div className="container mt-5" style={{ maxWidth: 1000 }}>
            <h2 className="fw-bold mb-4 text-dark d-flex align-items-center">
                <Database className="me-3 text-primary" size={30} />
                Procesamiento y Limpieza de Datos
            </h2>
            <p className="text-muted mb-4">
                Gestione los datasets de resultados subidos. Verifique su integridad antes de aplicarlos a los resultados electorales oficiales.
            </p>
            
            {/* --- SECCIÓN DE DATASETS CON ERRORES --- */}
            {errorDatasets.length > 0 && (
                <div className="card border-danger shadow-sm mb-4">
                    <div className="card-header bg-danger text-white fw-bold">
                        <XCircle size={18} className="me-2" />
                        Datasets con Errores Críticos ({errorDatasets.length})
                    </div>
                    <ul className="list-group list-group-flush small">
                        {errorDatasets.map((dataset) => (
                            <li key={dataset.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-semibold">{dataset.name}</span>
                                    <p className="text-muted mb-0 small">
                                        <AlertTriangle size={14} className="text-danger me-1" />
                                        Errores detectados en la verificación. Registros: {dataset.records}
                                    </p>
                                </div>
                                <div className="text-end">
                                    <button 
                                        className="btn btn-sm btn-danger-subtle me-2"
                                        onClick={() => {
                                            const errorList = dataset.issues?.filter(i => i.level === 'ERROR').map(i => `- ${i.description}`).join('\n') || 'No se encontraron detalles de error.';
                                            alert(`Detalle de Errores Críticos en ${dataset.name}:\n\n${errorList}`);
                                        }}
                                    >
                                        Ver Errores
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                            // Lógica para remover el dataset (se debe implementar una función de utilidad)
                                            if (window.confirm(`¿Está seguro que desea eliminar el dataset con errores ${dataset.name}?`)) {
                                                setDatasets(prev => {
                                                    const filtered = prev.filter(d => d.id !== dataset.id);
                                                    savePendingDatasets(filtered);
                                                    return filtered;
                                                });
                                                toast.warning(`Dataset '${dataset.name}' eliminado de la lista.`);
                                            }
                                        }}
                                        disabled={isCleaning}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* --- SECCIÓN DE DATASETS ACTIVOS (PENDIENTES/VERIFICADOS) --- */}
            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-header bg-primary bg-opacity-10 py-3">
                    <h5 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.1rem' }}>
                        Datasets Pendientes de Aplicación ({activeDatasets.length})
                    </h5>
                </div>
                
                {activeDatasets.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr className="small text-muted text-uppercase">
                                    <th>Nombre del Archivo</th>
                                    <th>Registros</th>
                                    <th>Subida</th>
                                    <th>Estado</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeDatasets.map((dataset) => (
                                    <tr key={dataset.id}>
                                        <td className="fw-semibold" style={{ verticalAlign: 'middle' }}>{dataset.name}</td>
                                        <td style={{ verticalAlign: 'middle' }}>{dataset.records.toLocaleString()}</td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            {new Date(dataset.uploadDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <span className={`badge ${
                                                dataset.status === 'pending' ? 'bg-warning text-dark' : 
                                                dataset.status === 'verified' ? 'bg-success' : 'bg-danger'
                                            }`}>
                                                {dataset.status === 'pending' ? 'Pendiente' : 
                                                 dataset.status === 'verified' ? 'Verificado' : 'Error'}
                                            </span>
                                            {dataset.issues && dataset.issues.length > 0 && dataset.status === 'verified' && (
                                                <small className="d-block text-muted">
                                                    <AlertTriangle size={12} className="text-warning me-1" />
                                                    {dataset.issues.filter(i => i.level === 'WARNING').length} advertencias
                                                </small>
                                            )}
                                        </td>
                                        <td className="text-end" style={{ verticalAlign: 'middle' }}>
                                            {/* Botón de Verificar (Solo si está pendiente) */}
                                            {dataset.status === 'pending' && (
                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleVerifyDataset(dataset.id, dataset.rawData)}
                                                    disabled={isCleaning}
                                                >
                                                    {isCleaning ? 'Verificando...' : 'Verificar Data'}
                                                </button>
                                            )}
                                            {/* Botón de Aplicar (Solo si está verificado) */}
                                            {dataset.status === 'verified' && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleApplyDataset(dataset.id, dataset.rawData)}
                                                    disabled={isCleaning}
                                                >
                                                    {isCleaning ? 'Aplicando...' : 'Aplicar al Sistema'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted py-5 mb-0">
                        <CheckCircle size={30} className="me-2 text-success" />
                        No hay datasets pendientes de aplicar.
                    </p>
                )}
            </div>
            <p className="text-muted small mt-3">
                <AlertTriangle size={14} className="text-warning me-1" />
                Los datasets con errores se muestran en la parte superior y no pueden ser aplicados.
            </p>
        </div>
    );
}