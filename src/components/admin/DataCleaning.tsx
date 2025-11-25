import { useState, useEffect, useMemo } from "react";
import { Database, AlertTriangle, CheckCircle, XCircle, FileText, Calendar, BarChart3 } from "lucide-react";
import { toast } from "react-toastify";

// --- CONSTANTES DE LOCAL STORAGE ---
const PENDING_DATASETS_KEY = "pendingDatasets";
const CLEANED_VOTES_KEY = 'cleanedUploadedVotes'; 

// --- TIPOS DE DATOS COMPARTIDOS ---
type CategoriaVoto = 'presidencial' | 'congreso' | 'parlamento';
type DatasetType = "partidos" | "resultados"; 
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
    status: DatasetStatus;
    rawData: VoteRecord[];
    issues?: DataIssue[];
}

// 💡 UTILITIES para manejo de localStorage (Seguras)
const getPendingDatasets = (): PendingDataset[] => {
    const data = localStorage.getItem(PENDING_DATASETS_KEY);
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al parsear datasets pendientes:", e);
        return [];
    }
};

const savePendingDatasets = (datasets: PendingDataset[]) => {
    localStorage.setItem(PENDING_DATASETS_KEY, JSON.stringify(datasets));
};

const getCleanedVotes = (): VoteRecord[] => {
    const data = localStorage.getItem(CLEANED_VOTES_KEY);
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

    useEffect(() => {
        const loadDatasets = () => {
            setDatasets(getPendingDatasets());
        };

        window.addEventListener('datasetUploaded', loadDatasets);
        loadDatasets();

        return () => {
            window.removeEventListener('datasetUploaded', loadDatasets);
        };
    }, []);
    

    const handleVerifyDataset = (id: string, rawData: VoteRecord[]) => {
        if (isCleaning) return;
        setIsCleaning(true);
        toast.info("Iniciando proceso de verificación de datos...");

        setTimeout(() => {
            const issues: DataIssue[] = [];
            const invalidCategories = ["nulo", "error", "blanco"];
            
            rawData.forEach((record, index) => {
                if (!record.DNI || record.DNI.length !== 8) {
                    issues.push({
                        id: `issue-${id}-${index}-dni`,
                        type: "DNI Inválido",
                        description: `Registro #${index + 1}: El DNI '${record.DNI}' no tiene 8 dígitos.`,
                        level: "ERROR",
                    });
                }
                if (invalidCategories.includes(record.partido.toLowerCase())) {
                    issues.push({
                        id: `issue-${id}-${index}-invalid`,
                        type: "Voto No Válido",
                        description: `Registro #${index + 1}: Voto a ${record.partido} (Blanco/Nulo).`,
                        level: "WARNING",
                    });
                }
            });

            setDatasets(prevDatasets => {
                const updatedDatasets = prevDatasets.map(d => {
                    if (d.id === id) {
                        if (issues.some(i => i.level === "ERROR")) {
                            toast.error(`Verificación finalizada con ${issues.filter(i => i.level === "ERROR").length} ERRORES en el dataset: ${d.name}`);
                            return { ...d, status: "error", issues } as PendingDataset; 
                        }
                        
                        toast.success(`Verificación COMPLETA. Listo para aplicar. Dataset: ${d.name}`);
                        return { ...d, status: "verified", issues } as PendingDataset;
                    }
                    return d;
                });
                
                savePendingDatasets(updatedDatasets as PendingDataset[]); 
                return updatedDatasets as PendingDataset[];
            });
            
            setIsCleaning(false);
        }, 1500);
    };

    const handleApplyDataset = (datasetId: string, rawData: VoteRecord[]) => {
        if (isCleaning) return;
        setIsCleaning(true);
        toast.info("Aplicando dataset al sistema de resultados...");
        
        setTimeout(() => {
            const existingCleanedVotes = getCleanedVotes();
            const validDataToApply = rawData.filter(r => r.DNI && r.DNI.length === 8) as VoteRecord[];
            const mergedData = [...existingCleanedVotes, ...validDataToApply]; 

            localStorage.setItem(CLEANED_VOTES_KEY, JSON.stringify(mergedData));

            setDatasets(prevDatasets => {
                const updatedDatasets = prevDatasets.filter(d => d.id !== datasetId);
                savePendingDatasets(updatedDatasets);
                return updatedDatasets;
            });
            
            window.dispatchEvent(new Event('cleanedDataApplied'));
            toast.success("Dataset aplicado con éxito. Resultados actualizados.");
            setIsCleaning(false);

        }, 1000);
    };

    const activeDatasets = useMemo(() => 
        datasets.filter(d => d.status !== 'error')
    , [datasets]);

    const errorDatasets = useMemo(() => 
        datasets.filter(d => d.status === 'error')
    , [datasets]);

    
    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="container" style={{ maxWidth: 1200 }}>
                {/* Header */}
                <div className="row align-items-center mb-4">
                    <div className="col">
                        <h1 className="h2 fw-bold text-dark mb-2 d-flex align-items-center">
                            <Database className="me-3 text-primary" size={32} />
                            Procesamiento de Datos Electorales
                        </h1>
                        <p className="text-muted mb-0">
                            Verifique y aplique datasets de resultados al sistema electoral oficial
                        </p>
                    </div>
                    <div className="col-auto">
                        <div className="bg-primary bg-opacity-10 px-3 py-2 rounded-3">
                            <span className="text-primary fw-semibold">
                                <BarChart3 size={16} className="me-2" />
                                {datasets.length} datasets en cola
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                        <FileText size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-dark mb-0">{activeDatasets.length}</h3>
                                        <p className="text-muted mb-0 small">Pendientes de aplicar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 me-3">
                                        <AlertTriangle size={24} className="text-warning" />
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-dark mb-0">{errorDatasets.length}</h3>
                                        <p className="text-muted mb-0 small">Con errores críticos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                                        <CheckCircle size={24} className="text-success" />
                                    </div>
                                    <div>
                                        <h3 className="fw-bold text-dark mb-0">
                                            {activeDatasets.filter(d => d.status === 'verified').length}
                                        </h3>
                                        <p className="text-muted mb-0 small">Verificados y listos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Datasets Section */}
                {errorDatasets.length > 0 && (
                    <div className="card border-danger shadow-sm mb-4">
                        <div className="card-header bg-danger text-white py-3 d-flex align-items-center">
                            <XCircle size={20} className="me-2" />
                            <h5 className="fw-bold mb-0">Datasets con Errores Críticos</h5>
                            <span className="badge bg-light text-danger ms-2">{errorDatasets.length}</span>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">Dataset</th>
                                            <th>Registros</th>
                                            <th>Fecha</th>
                                            <th>Problemas</th>
                                            <th className="text-end pe-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {errorDatasets.map((dataset) => (
                                            <tr key={dataset.id} className="border-bottom">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <FileText size={16} className="text-danger me-2" />
                                                        <div>
                                                            <div className="fw-semibold text-dark">{dataset.name}</div>
                                                            <small className="text-muted">Tipo: {dataset.type}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-semibold">{dataset.records.toLocaleString()}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Calendar size={14} className="text-muted me-2" />
                                                        <small>{new Date(dataset.uploadDate).toLocaleDateString()}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-danger bg-opacity-10 text-danger">
                                                        {dataset.issues?.filter(i => i.level === 'ERROR').length || 0} errores
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => {
                                                                const errorList = dataset.issues?.filter(i => i.level === 'ERROR').map(i => `• ${i.description}`).join('\n') || 'No se encontraron detalles de error.';
                                                                alert(`Detalle de Errores en ${dataset.name}:\n\n${errorList}`);
                                                            }}
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => {
                                                                if (window.confirm(`¿Está seguro que desea eliminar el dataset "${dataset.name}"?`)) {
                                                                    setDatasets(prev => {
                                                                        const filtered = prev.filter(d => d.id !== dataset.id);
                                                                        savePendingDatasets(filtered);
                                                                        return filtered;
                                                                    });
                                                                    toast.warning(`Dataset '${dataset.name}' eliminado.`);
                                                                }
                                                            }}
                                                            disabled={isCleaning}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Active Datasets Section */}
                <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-0 py-4">
                        <h5 className="fw-bold mb-0 text-dark d-flex align-items-center">
                            <Database className="me-2 text-primary" size={20} />
                            Datasets Pendientes de Aplicación
                            <span className="badge bg-primary ms-2">{activeDatasets.length}</span>
                        </h5>
                    </div>
                    
                    {activeDatasets.length > 0 ? (
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">Dataset</th>
                                            <th>Registros</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th className="text-end pe-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeDatasets.map((dataset) => (
                                            <tr key={dataset.id} className="border-bottom">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <FileText size={16} className="text-primary me-2" />
                                                        <div>
                                                            <div className="fw-semibold text-dark">{dataset.name}</div>
                                                            <small className="text-muted">Tipo: {dataset.type}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-semibold text-dark">{dataset.records.toLocaleString()}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Calendar size={14} className="text-muted me-2" />
                                                        <small>{new Date(dataset.uploadDate).toLocaleDateString()}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className={`badge ${
                                                            dataset.status === 'pending' ? 'bg-warning text-dark' : 
                                                            'bg-success'
                                                        } mb-1`}>
                                                            {dataset.status === 'pending' ? 'Pendiente' : 'Verificado'}
                                                        </span>
                                                        {dataset.issues && dataset.issues.length > 0 && dataset.status === 'verified' && (
                                                            <small className="text-warning d-flex align-items-center">
                                                                <AlertTriangle size={12} className="me-1" />
                                                                {dataset.issues.filter(i => i.level === 'WARNING').length} advertencias
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        {dataset.status === 'pending' && (
                                                            <button
                                                                className="btn btn-sm btn-primary px-3"
                                                                onClick={() => handleVerifyDataset(dataset.id, dataset.rawData)}
                                                                disabled={isCleaning}
                                                            >
                                                                {isCleaning ? (
                                                                    <>
                                                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                                        Verificando...
                                                                    </>
                                                                ) : (
                                                                    'Verificar Data'
                                                                )}
                                                            </button>
                                                        )}
                                                        {dataset.status === 'verified' && (
                                                            <button
                                                                className="btn btn-sm btn-success px-3"
                                                                onClick={() => handleApplyDataset(dataset.id, dataset.rawData)}
                                                                disabled={isCleaning}
                                                            >
                                                                {isCleaning ? (
                                                                    <>
                                                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                                        Aplicando...
                                                                    </>
                                                                ) : (
                                                                    'Aplicar al Sistema'
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body text-center py-5">
                            <CheckCircle size={48} className="text-success mb-3" />
                            <h5 className="text-muted mb-2">No hay datasets pendientes</h5>
                            <p className="text-muted mb-0">Todos los datasets han sido procesados o aplicados al sistema.</p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="mt-4 p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center">
                        <AlertTriangle size={16} className="text-warning me-2" />
                        <small className="text-muted">
                            <strong>Nota:</strong> Los datasets con errores críticos deben ser corregidos antes de poder aplicarse al sistema.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}