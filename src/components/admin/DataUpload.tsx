import { useState, useRef, useEffect } from "react";
import { CloudUpload, XCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";

// --- CONSTANTES DE LOCAL STORAGE ---
const PENDING_DATASETS_KEY = "pendingDatasets";
const UPLOAD_TYPE_RESULTADOS = "resultados"; 

// --- TIPOS DE DATOS COMPARTIDOS ---
type DatasetType = "partidos" | "resultados" | "votantes";
type CategoriaVoto = 'presidencial' | 'congreso' | 'parlamento';

export interface VoteRecord {
  DNI: string;
  categoria: CategoriaVoto;
  partido: string;
  region: string;
  mesa: number; 
  candidato: string; 
}

export interface PendingDataset {
  id: string;
  name: string;
  type: DatasetType;
  records: number;
  uploadDate: Date;
  status: "pending" | "verified" | "error";
  rawData: VoteRecord[];
  issues?: any[];
}

// Interfaz para el JSON de entrada (con campos opcionales)
interface RawUploadRecord {
    DNI: string;
    categoria: string;
    partido: string;
    region: string;
    mesa?: number; 
    candidato?: string;
}

interface UploadedFileReference {
  name: string;
  type: DatasetType;
  size: number;
  uploadDate: Date;
  records: number;
  status: "success" | "error" | "processing" | "pending";
}

interface DataUploadProps {
  onDataUploaded?: () => void;
}

// --- UTILITIES ---

const getPendingDatasets = (): PendingDataset[] => {
    const json = localStorage.getItem(PENDING_DATASETS_KEY);
    // Convertir fechas que se guardaron como string
    return json ? JSON.parse(json).map((d: any) => ({
        ...d,
        uploadDate: new Date(d.uploadDate)
    })) : [];
};

const savePendingDatasets = (datasets: PendingDataset[]) => {
    localStorage.setItem(PENDING_DATASETS_KEY, JSON.stringify(datasets));
    // Notificar a DataCleaning para actualizar su lista
    window.dispatchEvent(new Event('storage')); 
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


export default function DataUpload({ onDataUploaded }: DataUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Usamos 'pending' para reflejar que están esperando en la cola de limpieza
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileReference[]>([]); 
    const [isUploading, setIsUploading] = useState(false); 
    const [uploadError, setUploadError] = useState<string | null>(null); 
    
    // Cargar la referencia de archivos pendientes al iniciar
    useEffect(() => {
        const pending = getPendingDatasets();
        const initialRefs: UploadedFileReference[] = pending.map(d => ({
            name: d.name,
            type: d.type,
            size: 0, 
            uploadDate: d.uploadDate,
            records: d.records,
            status: d.status === 'verified' ? 'success' : 'pending', // Mostrar éxito si ya está verificado
        }));
        setUploadedFiles(initialRefs);
    }, []);

    // 🚨 LÓGICA CLAVE: Manejar la selección y carga de archivos JSON
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        setIsUploading(true);
        
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonText = e.target?.result as string;
                const rawData: RawUploadRecord[] = JSON.parse(jsonText);

                if (!Array.isArray(rawData) || rawData.length === 0) {
                    throw new Error("El archivo JSON debe contener una lista de registros de voto.");
                }

                // 1. Validación de estructura y tipos de categoría
                const validCategories: CategoriaVoto[] = ['presidencial', 'congreso', 'parlamento'];
                const isValid = rawData.every(record => 
                    record.DNI && typeof record.DNI === 'string' &&
                    record.categoria && typeof record.categoria === 'string' && validCategories.includes(record.categoria.toLowerCase() as CategoriaVoto) &&
                    record.partido && typeof record.partido === 'string' &&
                    record.region && typeof record.region === 'string'
                );

                if (!isValid) {
                    throw new Error("El archivo contiene registros incompletos o con categorías inválidas.");
                }

                // 2. Mapear a la estructura interna `VoteRecord` (Normalización)
                const processedData: VoteRecord[] = rawData.map(record => {
                    const categoriaLower = record.categoria.toLowerCase() as CategoriaVoto;
                    
                    return {
                        DNI: String(record.DNI).trim(), 
                        categoria: categoriaLower,
                        partido: record.partido.toUpperCase().trim(),
                        region: record.region.trim(),
                        mesa: record.mesa || 99999, 
                        // Si no es presidencial, el candidato es la plancha (partido)
                        candidato: record.candidato || (categoriaLower === 'presidencial' ? 'N/A' : `Lista ${record.partido.toUpperCase().trim()}`),
                    }
                });


                // 3. Crear el nuevo dataset pendiente
                const newDataset: PendingDataset = {
                    id: Date.now().toString(), 
                    name: file.name,
                    type: UPLOAD_TYPE_RESULTADOS as DatasetType,
                    records: processedData.length,
                    uploadDate: new Date(),
                    status: "pending", 
                    rawData: processedData, 
                };

                // 4. Guardar en Local Storage (cola de limpieza)
                const existingDatasets = getPendingDatasets();
                savePendingDatasets([...existingDatasets, newDataset]);

                // 5. Actualizar la UI
                setUploadedFiles((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        type: UPLOAD_TYPE_RESULTADOS as DatasetType,
                        size: file.size,
                        uploadDate: new Date(),
                        records: processedData.length,
                        status: "pending", // Se marca como pendiente hasta que se limpie
                    },
                ]);
                if (onDataUploaded) onDataUploaded();
                
                // Toast mejorado
                toast.success(`Archivo ${file.name} escaneado y en la cola de limpieza.`, {
                    icon: <CheckCircle size={24} />,
                    // Mantener colores formales y de alto contraste
                    style: { backgroundColor: '#d1e7dd', color: '#0f5132', borderLeft: '5px solid #0f5132' }
                });

            } catch (error) {
                console.error("Error procesando JSON:", error);
                setUploadError((error as Error).message || "Error al procesar el archivo JSON.");
                
                // Toast de error mejorado
                toast.error("Error al procesar el archivo", {
                    icon: <XCircle size={24} />,
                    // Mantener colores formales y de alto contraste
                    style: { backgroundColor: '#f8d7da', color: '#842029', borderLeft: '5px solid #842029' }
                });
            } finally {
                setIsUploading(false);
                if(fileInputRef.current) fileInputRef.current.value = ''; 
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-semibold text-dark mb-4 border-bottom pb-2">
                <CloudUpload size={20} className="me-2 text-primary" /> Carga de Resultados Electorales
            </h5>
            
            {/* ZONA DE CARGA (Drag & Drop Look) */}
            <div className="d-flex flex-column align-items-center mb-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                    disabled={isUploading}
                />
                
                {/* 🎯 Diseño de la caja de subida */}
                <label
                    htmlFor="file-upload"
                    className={`d-flex flex-column align-items-center justify-content-center w-100 p-5 border border-2 rounded-3 text-center ${
                        isUploading 
                            ? 'border-secondary text-secondary bg-light' 
                            : 'border-primary text-primary hover-shadow'
                    }`}
                    style={{ 
                        cursor: isUploading ? 'not-allowed' : 'pointer', 
                        borderStyle: 'dashed', // Línea punteada
                        transition: '0.3s all' 
                    }}
                >
                    {isUploading ? (
                        <>
                            <Clock size={32} className="mb-2 spinner-border spinner-border-sm" /> 
                            <p className="fw-bold mb-0">Escaneando archivo...</p>
                            <small className="text-muted">Procesando registros de voto.</small>
                        </>
                    ) : (
                        <>
                            <CloudUpload size={48} className="mb-2" /> 
                            <p className="fw-bold mb-1">Click para subir o arrastra aquí</p>
                            <small className="text-muted">Archivos de Resultados en formato **.json**</small>
                        </>
                    )}
                </label>
                
                {uploadError && (
                    <div className="alert alert-danger mt-3 w-100 fw-semibold" role="alert">
                        {uploadError}
                    </div>
                )}
            </div>
            
            <hr className="my-2"/>
            <h6 className="fw-bold mb-3 d-flex align-items-center">
                Historial de Subidas 📄
            </h6>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {uploadedFiles.length === 0 ? (
                    <p className="text-muted small text-center py-3">No hay archivos en el historial.</p>
                ) : (
                    <table className="table table-sm table-borderless small mb-0">
                        <thead>
                            <tr className="text-muted border-bottom">
                                <th>Archivo</th>
                                <th className="text-end">Registros</th>
                                <th className="text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                        <i className="bi bi-file-earmark-code me-1 text-info"></i>
                                        {file.name}
                                    </td>
                                    <td className="text-end fw-semibold">{file.records.toLocaleString()}</td>
                                    <td className="text-center">
                                        {/* 🎯 Colores de Estado más formales */}
                                        <span className={`badge rounded-pill px-2 py-1 ${
                                            file.status === 'success' 
                                              ? 'bg-success bg-opacity-75' :
                                              file.status === 'pending' 
                                              ? 'bg-info text-white' : // Azul info para 'Pendiente de Limpieza'
                                              'bg-danger bg-opacity-75'
                                        }`}>
                                            {file.status === 'success' ? 'Aplicado' :
                                             file.status === 'pending' ? 'Pendiente' : 'Error'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}