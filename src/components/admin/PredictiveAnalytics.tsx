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

      {/* Gráficos Estadísticos Simples */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-semibold text-dark mb-0">
                <i className="bi bi-bar-chart text-primary me-2" />
                Gráficos Predictivo
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Gráfico 1: Barras - Participación por hora */}
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="fw-semibold">Participación por Hora</h6>
                      <div className="d-flex align-items-end gap-2 mt-3" style={{height: "120px"}}>
                        {[25, 45, 65, 80, 70, 60].map((value, i) => (
                          <div key={i} className="flex-fill d-flex flex-column align-items-center">
                            <div 
                              className="bg-primary rounded w-100"
                              style={{height: `${value}%`}}
                            />
                            <small className="text-muted mt-1">{["08", "10", "12", "14", "16", "18"][i]}:00</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico 2: Distribución de votos */}
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="fw-semibold">Distribución de Votos</h6>
                      <div className="d-flex align-items-center mt-3">
                        <div className="flex-fill">
                          {["Alianza Progreso", "Frente Democrático", "Unidad Nacional"].map((party, i) => (
                            <div key={i} className="d-flex align-items-center mb-2">
                              <div 
                                className="rounded me-2"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  backgroundColor: ["#0d6efd", "#198754", "#ffc107"][i]
                                }}
                              />
                              <small className="text-muted">{party}</small>
                              <small className="fw-bold ms-auto">{[34, 28, 19][i]}%</small>
                            </div>
                          ))}
                        </div>
                        <div className="ms-4">
                          <div 
                            className="rounded-circle border border-3 border-primary"
                            style={{width: "80px", height: "80px"}}
                          />
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

      {/* Análisis de Tendencia */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-semibold text-dark mb-0">
                <i className="bi bi-graph-up text-primary me-2" />
                Análisis Detallado de Tendencias
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold text-dark mb-0">Proyección de Participación</h6>
                    <span className="badge bg-success bg-opacity-10 text-success">65% Estimado</span>
                  </div>
                  <div className="progress mb-3" style={{ height: "12px" }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: "65%" }}
                    />
                  </div>
                  <small className="text-muted">
                    Basado en análisis de patrones históricos y tasa de participación actual
                  </small>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-semibold text-dark mb-0">Fiabilidad del Modelo</h6>
                    <span className="badge bg-primary bg-opacity-10 text-primary">78% Confianza</span>
                  </div>
                  <div className="progress mb-3" style={{ height: "12px" }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: "78%" }}
                    />
                  </div>
                  <small className="text-muted">
                    Modelo entrenado con 50,000+ registros históricos validados
                  </small>
                </div>
              </div>
              
              <div className="row">
                <div className="col-12">
                  <h6 className="fw-semibold text-dark mb-3">Insights del Sistema Predictivo</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2" />
                          <strong>Pico de participación</strong> proyectado entre 10:00 - 12:00 horas
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2" />
                          <strong>Áreas urbanas</strong> muestran 25% mayor participación
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="bi bi-exclamation-triangle-fill text-warning me-2" />
                          <strong>Grupo 18-25 años</strong> con participación 15% inferior al esperado
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-info-circle-fill text-info me-2" />
                          <strong>Margen de error</strong> del modelo: ±3.2%
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}