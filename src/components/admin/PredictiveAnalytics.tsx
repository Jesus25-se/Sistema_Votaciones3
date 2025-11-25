// components/admin/PredictiveAnalytics.tsx
import { useState, useEffect } from "react";
import { getVotos } from "../../services/mockData";

type PredictionType = "participation" | "winner" | "trends" | "regional";
type TimeFrame = "1h" | "6h" | "24h" | "election";

interface Prediction {
  type: PredictionType;
  confidence: number;
  prediction: string;
  factors: string[];
  timestamp: Date;
  trend?: "up" | "down" | "stable";
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  lastTraining: Date;
  status: "training" | "ready" | "updating";
  version: string;
}

interface PredictiveAnalyticsProps {
  lastTraining?: Date | null;
}

export default function PredictiveAnalytics({ lastTraining }: PredictiveAnalyticsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    accuracy: 87.5,
    precision: 91.2,
    recall: 85.8,
    lastTraining: lastTraining || new Date(),
    status: "ready",
    version: "v2.1.4"
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("24h");
  const [isTraining, setIsTraining] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Función para formatear números a 1 decimal
  const formatOneDecimal = (value: number): string => {
    return value.toFixed(1);
  };

  // Simular predicciones basadas en datos existentes
  useEffect(() => {
    const generatePredictions = () => {
      const votos = getVotos();
      const totalVotes = votos.length;
      
      const newPredictions: Prediction[] = [
        {
          type: "participation",
          confidence: 92.3,
          prediction: `Participación electoral estimada en ${Math.min(85, Math.floor((totalVotes / 5000) * 100))}%`,
          factors: ["Tasa actual de votación", "Patrones históricos", "Factores demográficos"],
          timestamp: new Date(),
          trend: "up"
        },
        {
          type: "winner",
          confidence: 78.5,
          prediction: "Alianza para el Progreso lidera con 34.2% de preferencia electoral",
          factors: ["Votos actuales", "Tendencias por región", "Encuestas previas"],
          timestamp: new Date(),
          trend: "stable"
        },
        {
          type: "trends",
          confidence: 85.1,
          prediction: "Incremento del 12% en participación juvenil en los últimos 60 minutos",
          factors: ["Grupo etario 18-25", "Redes sociales", "Zonas urbanas"],
          timestamp: new Date(),
          trend: "up"
        },
        {
          type: "regional",
          confidence: 81.7,
          prediction: "Lima Metropolitana muestra mayor participación con 45% del padrón",
          factors: ["Densidad poblacional", "Centros de votación", "Infraestructura"],
          timestamp: new Date(),
          trend: "up"
        },
      ];

      setPredictions(newPredictions);
      setLastUpdate(new Date());
    };

    generatePredictions();
    const interval = setInterval(generatePredictions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTrainModel = async () => {
    setIsTraining(true);
    setModelMetrics(prev => ({ ...prev, status: "training" }));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setModelMetrics({
      accuracy: Math.min(95, modelMetrics.accuracy + Math.random() * 5),
      precision: Math.min(95, modelMetrics.precision + Math.random() * 3),
      recall: Math.min(95, modelMetrics.recall + Math.random() * 4),
      lastTraining: new Date(),
      status: "ready",
      version: `v2.1.${Math.floor(Math.random() * 10)}`
    });
    setIsTraining(false);
  };

  const getPredictionIcon = (type: PredictionType) => {
    const icons = {
      participation: "👥",
      winner: "🏆",
      trends: "📈",
      regional: "🗺️",
    };
    return icons[type];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "success";
    if (confidence >= 80) return "info";
    if (confidence >= 70) return "warning";
    return "danger";
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <i className="bi bi-arrow-up-circle-fill text-success" />;
      case "down":
        return <i className="bi bi-arrow-down-circle-fill text-danger" />;
      default:
        return <i className="bi bi-dash-circle-fill text-warning" />;
    }
  };

  const MetricCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div className="card border-0 h-100">
      <div className="card-body text-center p-3">
        <div className={`bg-${color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2`} 
             style={{ width: '60px', height: '60px' }}>
          <h4 className={`fw-bold text-${color} mb-0`}>{formatOneDecimal(value)}%</h4>
        </div>
        <h6 className="fw-semibold text-dark mb-1">{label}</h6>
        <small className="text-muted">Modelo predictivo</small>
      </div>
    </div>
  );

  const PredictionCard = ({ prediction }: { prediction: Prediction }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <span className="fs-5">{getPredictionIcon(prediction.type)}</span>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0 text-capitalize">
                {prediction.type.replace('_', ' ')}
              </h6>
              <small className="text-muted">Predicción en tiempo real</small>
            </div>
          </div>
          <div className="text-end">
            <span className={`badge bg-${getConfidenceColor(prediction.confidence)} bg-opacity-10 text-${getConfidenceColor(prediction.confidence)} mb-1`}>
              {formatOneDecimal(prediction.confidence)}% confianza
            </span>
            <div className="small text-muted">
              {getTrendIcon(prediction.trend)}
            </div>
          </div>
        </div>
        
        <p className="fw-semibold text-dark flex-grow-1">{prediction.prediction}</p>
        
        <div className="mt-auto">
          <small className="text-muted d-block mb-2">Factores considerados:</small>
          <div className="d-flex flex-wrap gap-2">
            {prediction.factors.map((factor, idx) => (
              <span key={idx} className="badge bg-light text-dark border small">
                {factor}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-top">
          <small className="text-muted">
            <i className="bi bi-clock me-1" />
            Actualizado: {prediction.timestamp.toLocaleTimeString()}
          </small>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid" style={{ padding: "2rem 1.5rem", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="h2 fw-bold text-dark mb-2">Analítica Predictiva</h1>
              <p className="text-muted mb-0">
                Modelos de machine learning para proyecciones electorales en tiempo real
              </p>
            </div>
            <div className="text-end">
              <div className="d-flex flex-column align-items-end">
                <span className={`badge ${modelMetrics.status === "ready" ? "bg-success" : "bg-warning"} mb-2`}>
                  <i className={`bi ${modelMetrics.status === "ready" ? "bi-check-circle" : "bi-arrow-repeat"} me-1`} />
                  {modelMetrics.status === "ready" ? "Modelo Activo" : "Entrenando"}
                </span>
                <small className="text-muted">
                  v{modelMetrics.version} • {lastUpdate.toLocaleTimeString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas del Modelo */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <MetricCard value={modelMetrics.accuracy} label="Precisión" color="primary" />
        </div>
        <div className="col-md-3 mb-3">
          <MetricCard value={modelMetrics.precision} label="Exactitud" color="success" />
        </div>
        <div className="col-md-3 mb-3">
          <MetricCard value={modelMetrics.recall} label="Cobertura" color="warning" />
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 h-100">
            <div className="card-body text-center p-3 d-flex flex-column justify-content-between">
              <div>
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-cpu fs-4 text-dark"></i>
                </div>
                <h6 className="fw-semibold text-dark mb-1">Entrenar Modelo</h6>
              </div>
              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleTrainModel}
                disabled={isTraining}
              >
                {isTraining ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-repeat me-2" />
                    Reentrenar
                  </>
                )}
              </button>
              <small className="text-muted mt-2">
                Último: {modelMetrics.lastTraining.toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Tiempo */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Marco Temporal de Predicción</h6>
                  <small className="text-muted">Seleccione el horizonte temporal para las proyecciones</small>
                </div>
                <div className="btn-group">
                  {(["1h", "6h", "24h", "election"] as TimeFrame[]).map((timeframe) => (
                    <button
                      key={timeframe}
                      className={`btn btn-outline-secondary ${selectedTimeFrame === timeframe ? "active" : ""}`}
                      onClick={() => setSelectedTimeFrame(timeframe)}
                    >
                      {timeframe === "1h" && "1 Hora"}
                      {timeframe === "6h" && "6 Horas"}
                      {timeframe === "24h" && "24 Horas"}
                      {timeframe === "election" && "Elección"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Estadísticos Mejorados */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-semibold text-dark mb-0">
                <i className="bi bi-bar-chart text-primary me-2" />
                Gráficos Predictivos
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Gráfico 1: Línea - Tendencias de participación */}
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body d-flex flex-column">
                      <h6 className="fw-semibold">Tendencia de Participación</h6>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <div className="position-relative w-100" style={{height: "180px"}}>
                          <svg viewBox="0 0 350 160" className="w-100 h-100">
                            {/* Eje Y */}
                            <line x1="30" y1="10" x2="30" y2="140" stroke="#dee2e6" strokeWidth="1.5" />
                            
                            {/* Eje X */}
                            <line x1="30" y1="140" x2="330" y2="140" stroke="#dee2e6" strokeWidth="1.5" />
                            
                            {/* Líneas horizontales de guía */}
                            <line x1="30" y1="30" x2="330" y2="30" stroke="#e9ecef" strokeWidth="1" />
                            <line x1="30" y1="60" x2="330" y2="60" stroke="#e9ecef" strokeWidth="1" />
                            <line x1="30" y1="90" x2="330" y2="90" stroke="#e9ecef" strokeWidth="1" />
                            <line x1="30" y1="110" x2="330" y2="110" stroke="#e9ecef" strokeWidth="1" />
                            
                            {/* Línea de tendencia principal - más horizontal */}
                            <polyline 
                              points="50,130 90,120 130,100 170,80 210,70 250,60 290,50 320,40" 
                              fill="none" 
                              stroke="#0d6efd" 
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            
                            {/* Puntos de datos */}
                            <circle cx="50" cy="130" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="90" cy="120" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="130" cy="100" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="170" cy="80" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="210" cy="70" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="250" cy="60" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="290" cy="50" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            <circle cx="320" cy="40" r="3.5" fill="#0d6efd" stroke="#fff" strokeWidth="1" />
                            
                            {/* Etiquetas del eje X */}
                            <text x="50" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">08:00</text>
                            <text x="90" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">10:00</text>
                            <text x="130" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">12:00</text>
                            <text x="170" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">14:00</text>
                            <text x="210" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">16:00</text>
                            <text x="250" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">18:00</text>
                            <text x="290" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">20:00</text>
                            <text x="320" y="155" textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="500">22:00</text>
                            
                            {/* Etiquetas del eje Y */}
                            <text x="25" y="35" textAnchor="end" fontSize="9" fill="#6c757d" fontWeight="500">80%</text>
                            <text x="25" y="65" textAnchor="end" fontSize="9" fill="#6c757d" fontWeight="500">60%</text>
                            <text x="25" y="95" textAnchor="end" fontSize="9" fill="#6c757d" fontWeight="500">40%</text>
                            <text x="25" y="115" textAnchor="end" fontSize="9" fill="#6c757d" fontWeight="500">20%</text>
                            <text x="25" y="145" textAnchor="end" fontSize="9" fill="#6c757d" fontWeight="500">0%</text>
                          </svg>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <small className="text-muted">Horas del día</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico 2: Circular - Distribución de votos */}
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <h6 className="fw-semibold">Distribución de Votos</h6>
                      <div className="d-flex align-items-center justify-content-center mt-3">
                        <div className="position-relative me-4">
                          {/* Gráfico circular SVG */}
                          <svg width="120" height="120" viewBox="0 0 42 42">
                            {/* Alianza Progreso - 34% */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0d6efd" strokeWidth="3"
                                    strokeDasharray="34 66" strokeDashoffset="25" />
                            {/* Frente Democrático - 28% */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#198754" strokeWidth="3"
                                    strokeDasharray="28 72" strokeDashoffset="-34" />
                            {/* Unidad Nacional - 19% */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ffc107" strokeWidth="3"
                                    strokeDasharray="19 81" strokeDashoffset="-62" />
                            {/* Otros - 19% */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6c757d" strokeWidth="3"
                                    strokeDasharray="19 81" strokeDashoffset="-81" />
                            <text x="21" y="21" textAnchor="middle" dy="0.3em" fontSize="8" fontWeight="bold">
                              Total
                            </text>
                          </svg>
                        </div>
                        <div className="flex-fill">
                          {[
                            { party: "Alianza Progreso", percentage: 34, color: "#0d6efd" },
                            { party: "Frente Democrático", percentage: 28, color: "#198754" },
                            { party: "Unidad Nacional", percentage: 19, color: "#ffc107" },
                            { party: "Otros", percentage: 19, color: "#6c757d" }
                          ].map((item, i) => (
                            <div key={i} className="d-flex align-items-center mb-2">
                              <div 
                                className="rounded me-2"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  backgroundColor: item.color
                                }}
                              />
                              <small className="text-muted flex-fill">{item.party}</small>
                              <small className="fw-bold">{item.percentage}%</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predicciones */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="h5 fw-semibold text-dark mb-3">Predicciones en Tiempo Real</h3>
          <div className="row g-3">
            {predictions.map((prediction, index) => (
              <div key={index} className="col-xl-6">
                <PredictionCard prediction={prediction} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}