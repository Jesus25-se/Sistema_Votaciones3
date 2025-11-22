import { useState, useEffect, useCallback } from "react";
import { getVotos } from "../../services/mockData"; 

// --- CONSTANTES DE LOCAL STORAGE Y EVENTO ---
const DATA_UPDATE_EVENT = 'electoralDataUpdated';
const LIVE_VOTES_KEY = 'liveElectoralResults'; 
const CLEANED_VOTES_KEY = 'cleanedUploadedVotes'; 

// --- TIPOS DE DATOS (Alineado con el error de tipado anterior) ---
interface VotoLocal {
  dni: string; 
  categoria: 'presidencial' | 'congreso' | 'parlamento';
  partido: string;
  region: string;
  mesa?: number; 
  candidato?: string; 
}

interface ElectionMetrics {
  totalVotes: number;
  participationRate: number;
  votesPerHour: number;
  leadingParty: string;
  votesByCategory: {
    presidencial: number;
    congreso: number;
    parlamento: number;
  };
  recentActivity: {
    time: string;
    votes: number;
  }[];
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<ElectionMetrics>({
    totalVotes: 0,
    participationRate: 0,
    votesPerHour: 0,
    leadingParty: "N/A",
    votesByCategory: {
      presidencial: 0,
      congreso: 0,
      parlamento: 0,
    },
    recentActivity: [],
  });

  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d">("24h");

  // 🚀 FUNCIÓN DE CÁLCULO: Implementa la lógica de prioridad de datos.
  const calculateMetrics = useCallback(() => {
    
    let votos: VotoLocal[] = [];

    // 1. 🥇 PRIORIDAD: Intentar obtener datos limpios (Data Cleaning)
    const cleanedJson = localStorage.getItem(CLEANED_VOTES_KEY);

    if (cleanedJson) {
        try {
            const cleanedData = JSON.parse(cleanedJson);
            if (Array.isArray(cleanedData) && cleanedData.length > 0) {
                votos = cleanedData as VotoLocal[];
            }
        } catch (e) {
            console.error("Error al parsear datos limpios:", e);
        }
    }

    // 2. 🥈 FALLBACK: Si no hay datos limpios, usar los datos en vivo (Vote Form)
    if (votos.length === 0) {
        // getVotos() lee los datos en vivo que guarda el VoteForm (LIVE_VOTES_KEY)
        votos = getVotos() as VotoLocal[]; 
    }


    // --- LÓGICA DE CÁLCULO DE MÉTRICAS ---
    const byCategory = {
      presidencial: votos.filter((v) => v.categoria === "presidencial").length,
      congreso: votos.filter((v) => v.categoria === "congreso").length,
      parlamento: votos.filter((v) => v.categoria === "parlamento").length,
    };

    const partyCounts: Record<string, number> = {};
    votos.forEach((v) => {
      partyCounts[v.partido] = (partyCounts[v.partido] || 0) + 1;
    });

    const leadingParty =
      Object.entries(partyCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    const now = new Date();
    const recentActivity = Array.from({ length: 6 }, (_, i) => {
      const time = new Date(now.getTime() - i * 10 * 60 * 1000); 
      return {
        time: time.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        votes: Math.floor(Math.random() * 20) + 5, 
      };
    }).reverse();

    setMetrics({
      totalVotes: votos.length,
      participationRate: Math.min((votos.length / 5000) * 100, 100), 
      votesPerHour: 150 + Math.floor(Math.random() * 50),
      leadingParty: leadingParty,
      votesByCategory: byCategory,
      recentActivity: recentActivity,
    });
  }, []);

  // 🚀 LÓGICA DE SINCRONIZACIÓN (Polling + Event Listener)
  useEffect(() => {
    // 1. Carga inicial
    calculateMetrics();

    // 2. Polling: Actualización periódica (simula el flujo en vivo)
    const intervalId = setInterval(calculateMetrics, 5000); 

    // 3. Event Listener: Actualización inmediata al dispararse el evento
    window.addEventListener(DATA_UPDATE_EVENT, calculateMetrics);

    // 4. Limpieza
    return () => {
      clearInterval(intervalId);
      window.removeEventListener(DATA_UPDATE_EVENT, calculateMetrics);
    };
  }, [calculateMetrics]); 

  // Renderizado del componente (sin cambios)
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold text-dark mb-0">
          Resultados y Métricas Clave
        </h1>
        <div className="btn-group" role="group">
          {["1h", "24h", "7d"].map((range) => (
            <button
              key={range}
              type="button"
              className={`btn btn-sm ${
                timeRange === range
                  ? "btn-primary"
                  : "btn-outline-secondary border-0"
              }`}
              onClick={() => setTimeRange(range as "1h" | "24h" | "7d")}
            >
              Últimos {range}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS DE RESUMEN PRINCIPALES */}
      <div className="row g-4 mb-4">
        {/* Votos Totales */}
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <p className="text-muted small mb-1">Votos Totales</p>
            <h2 className="fw-bold text-primary">
              {metrics.totalVotes.toLocaleString()}
            </h2>
            <small className="text-success fw-semibold">
              +1.2% vs. periodo anterior
            </small>
          </div>
        </div>

        {/* Participación */}
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <p className="text-muted small mb-1">Tasa de Participación</p>
            <h2 className="fw-bold text-success">
              {metrics.participationRate.toFixed(2)}%
            </h2>
            <small className="text-muted">
              Censo objetivo: 5,000 votantes
            </small>
          </div>
        </div>

        {/* Votos por Hora */}
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <p className="text-muted small mb-1">Votos / Hora (Promedio)</p>
            <h2 className="fw-bold text-info">
              {metrics.votesPerHour.toLocaleString()}
            </h2>
            <small className="text-danger fw-semibold">
              -0.5% vs. promedio esperado
            </small>
          </div>
        </div>

        {/* Partido Líder */}
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <p className="text-muted small mb-1">Partido Líder</p>
            <h2 className="fw-bold text-warning">
              {metrics.leadingParty}
            </h2>
            <small className="text-muted">
              {metrics.votesByCategory.presidencial > 0 ? (
                `(${metrics.votesByCategory.presidencial.toLocaleString()} votos)`
              ) : (
                "Calculando..."
              )}
            </small>
          </div>
        </div>
      </div>

      {/* DETALLE DE CATEGORÍAS Y ACTIVIDAD RECIENTE */}
      <div className="row g-4">
        {/* Votos por Categoría */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3 text-dark" style={{ fontSize: "1.1rem" }}>
              Votos por Categoría
            </h5>
            <ul className="list-group list-group-flush">
              {Object.entries(metrics.votesByCategory).map(([cat, votes]) => (
                <li
                  key={cat}
                  className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                >
                  <span className="text-capitalize">{cat}:</span>
                  <span className="fw-semibold text-dark">
                    {votes.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3 text-dark" style={{ fontSize: "1.1rem" }}>
              Actividad Reciente
            </h5>
            <div className="list-group list-group-flush">
              {metrics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center py-2"
                >
                  <div>
                    <span className="fw-semibold d-block">
                      {activity.time}
                    </span>
                    <small className="text-muted d-block" style={{ fontSize: "0.8rem" }}>
                      Nuevos votos registrados
                    </small>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: "0.8rem" }}>
                    +{activity.votes} votos
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALERTAS */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.1rem" }}>⚠️ Alertas del Sistema</h5>
            </div>
            <div className="card-body py-3">
              <div className="alert alert-warning d-flex align-items-center shadow-sm rounded-2 mb-0" style={{ fontSize: "0.9rem" }}>
                <span className="me-2 fs-5">🔔</span>
                <div>
                  <strong>Alerta de Participación</strong>
                  <p className="mb-0 text-secondary" style={{ fontSize: "0.85rem" }}>
                    La participación en zonas rurales está por debajo del 40%.
                    Considerar medidas de promoción.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}