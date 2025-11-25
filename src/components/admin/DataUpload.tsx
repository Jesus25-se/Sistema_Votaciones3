import { useState, useRef, useEffect } from "react";
import { CloudUpload, XCircle, CheckCircle, Clock, FileText, Database, AlertCircle } from "lucide-react";
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
  return json ? JSON.parse(json).map((d: any) => ({
    ...d,
    uploadDate: new Date(d.uploadDate)
  })) : [];
};

const savePendingDatasets = (datasets: PendingDataset[]) => {
  localStorage.setItem(PENDING_DATASETS_KEY, JSON.stringify(datasets));
  window.dispatchEvent(new Event('datasetUploaded'));
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileReference[]>([]); 
  const [isUploading, setIsUploading] = useState(false); 
  const [uploadError, setUploadError] = useState<string | null>(null); 
  const [isDragging, setIsDragging] = useState(false);
  
  // Cargar la referencia de archivos pendientes al iniciar
  useEffect(() => {
    const pending = getPendingDatasets();
    const initialRefs: UploadedFileReference[] = pending.map(d => ({
      name: d.name,
      type: d.type,
      size: 0, 
      uploadDate: d.uploadDate,
      records: d.records,
      status: d.status === 'verified' ? 'success' : 'pending',
    }));
    setUploadedFiles(initialRefs);
  }, []);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/json') {
      handleFileSelection(files[0]);
    } else {
      setUploadError("Por favor, suelte solo archivos JSON");
    }
  };

  const handleFileSelection = (file: File) => {
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

        // Validación de estructura y tipos de categoría
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

        // Mapear a la estructura interna `VoteRecord` (Normalización)
        const processedData: VoteRecord[] = rawData.map(record => {
          const categoriaLower = record.categoria.toLowerCase() as CategoriaVoto;
          
          return {
            DNI: String(record.DNI).trim(), 
            categoria: categoriaLower,
            partido: record.partido.toUpperCase().trim(),
            region: record.region.trim(),
            mesa: record.mesa || 99999, 
            candidato: record.candidato || (categoriaLower === 'presidencial' ? 'N/A' : `Lista ${record.partido.toUpperCase().trim()}`),
          }
        });

        // Crear el nuevo dataset pendiente
        const newDataset: PendingDataset = {
          id: Date.now().toString(), 
          name: file.name,
          type: UPLOAD_TYPE_RESULTADOS as DatasetType,
          records: processedData.length,
          uploadDate: new Date(),
          status: "pending", 
          rawData: processedData, 
        };

        // Guardar en Local Storage (cola de limpieza)
        const existingDatasets = getPendingDatasets();
        savePendingDatasets([...existingDatasets, newDataset]);

        // Actualizar la UI
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            type: UPLOAD_TYPE_RESULTADOS as DatasetType,
            size: file.size,
            uploadDate: new Date(),
            records: processedData.length,
            status: "pending",
          },
        ]);
        if (onDataUploaded) onDataUploaded();
        
        toast.success(`Archivo ${file.name} escaneado y en la cola de limpieza.`, {
          icon: <CheckCircle size={24} />,
          style: { backgroundColor: '#d1e7dd', color: '#0f5132', borderLeft: '5px solid #0f5132' }
        });

      } catch (error) {
        console.error("Error procesando JSON:", error);
        setUploadError((error as Error).message || "Error al procesar el archivo JSON.");
        
        toast.error("Error al procesar el archivo", {
          icon: <XCircle size={24} />,
          style: { backgroundColor: '#f8d7da', color: '#842029', borderLeft: '5px solid #842029' }
        });
      } finally {
        setIsUploading(false);
        if(fileInputRef.current) fileInputRef.current.value = ''; 
      }
    };

    reader.readAsText(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h1 className="h2 fw-bold text-dark mb-2 d-flex align-items-center">
              <Database className="me-3 text-primary" size={32} />
              Carga de Resultados Electorales
            </h1>
            <p className="text-muted mb-0">
              Suba archivos JSON con datos de votación para procesamiento y verificación
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white border-0 py-4">
                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center">
                  <CloudUpload className="me-2 text-primary" size={24} />
                  Subir Nuevo Dataset
                </h5>
              </div>
              
              <div className="card-body p-4">
                {/* Zona de Drag & Drop */}
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
                  
                  <label
                    htmlFor="file-upload"
                    className={`d-flex flex-column align-items-center justify-content-center w-100 p-5 border-3 rounded-3 text-center ${
                      isUploading 
                        ? 'border-secondary bg-light' 
                        : isDragging
                        ? 'border-primary bg-primary bg-opacity-5'
                        : 'border-dashed border-primary bg-white hover-shadow'
                    }`}
                    style={{ 
                      cursor: isUploading ? 'not-allowed' : 'pointer', 
                      transition: 'all 0.3s ease',
                      minHeight: '200px'
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isUploading ? (
                      <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="fw-bold text-dark mb-1">Procesando archivo...</p>
                        <small className="text-muted">Escaneando registros de votación</small>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CloudUpload size={48} className="mb-3 text-primary" />
                        <p className="fw-bold text-dark mb-2">Haga clic para seleccionar o arrastre su archivo aquí</p>
                        <small className="text-muted d-block mb-2">
                          Formatos soportados: <strong>JSON</strong>
                        </small>
                        <small className="text-muted">
                          Tamaño máximo: <strong>10MB</strong>
                        </small>
                      </div>
                    )}
                  </label>
                  
                  {uploadError && (
                    <div className="alert alert-danger mt-3 w-100 d-flex align-items-center" role="alert">
                      <AlertCircle size={20} className="me-2" />
                      <div>
                        <strong>Error de carga:</strong> {uploadError}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información de ayuda */}
                <div className="bg-light rounded-3 p-3 mb-4">
                  <div className="d-flex align-items-start">
                    <AlertCircle size={18} className="text-warning mt-1 me-2" />
                    <div>
                      <small className="text-muted">
                        <strong>Requisitos del archivo:</strong> El archivo JSON debe contener un array de objetos con los campos: DNI, categoria, partido, region. Campos opcionales: mesa, candidato.
                      </small>
                    </div>
                  </div>
                </div>

                {/* Historial de Subidas */}
                <div className="border-top pt-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <FileText size={20} className="me-2 text-primary" />
                    Historial de Subidas Recientes
                    <span className="badge bg-primary ms-2">{uploadedFiles.length}</span>
                  </h6>
                  
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-4">
                      <FileText size={48} className="text-muted mb-3" />
                      <p className="text-muted mb-2">No hay archivos en el historial</p>
                      <small className="text-muted">Los archivos subidos aparecerán aquí</small>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-4">Archivo</th>
                            <th>Registros</th>
                            <th>Fecha</th>
                            <th className="text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedFiles.map((file, index) => (
                            <tr key={index} className="border-bottom">
                              <td className="ps-4">
                                <div className="d-flex align-items-center">
                                  <FileText size={16} className="text-primary me-2" />
                                  <div>
                                    <div className="fw-semibold text-dark">{file.name}</div>
                                    <small className="text-muted">{formatFileSize(file.size)}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold text-dark">{file.records.toLocaleString()}</span>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {file.uploadDate.toLocaleDateString()}
                                </small>
                              </td>
                              <td className="text-center">
                                <span className={`badge ${
                                  file.status === 'success' 
                                    ? 'bg-success' :
                                    file.status === 'pending' 
                                    ? 'bg-warning text-dark' : 
                                    'bg-danger'
                                } px-3 py-2`}>
                                  {file.status === 'success' ? 'Aplicado' :
                                   file.status === 'pending' ? 'Pendiente' : 'Error'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}