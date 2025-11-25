// components/admin/AdminDashboard.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ArcElement,
} from "chart.js";

// Registrar componentes de ChartJS (IMPORTANTE para que funcionen los gráficos)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

// 🚀 Importaciones de la data simulada (ASUMIMOS la existencia de este archivo)
// Esto simula la fuente de datos en vivo y la metadata.
import { partidosSimulados as rawPartidos, nombresSimulados, getVotos as fetchVotos } from "../../services/mockData";

// --- TIPOS DE DATOS COMPARTIDOS ---
type CategoriaVoto = 'presidencial' | 'congreso' | 'parlamento';
const categorias: CategoriaVoto[] = ['presidencial', 'congreso', 'parlamento'];

interface Voto {
  dni: string;
  categoria: CategoriaVoto;
  partido: string;
  region: string; 
}

interface Partido {
  nombre: string;
  logo: string;
  color: string;
}

interface CategoryResultData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string;
        borderWidth: number;
    }[];
}

interface GeneralResults {
    totalVotos: number;
    votosPorCategoria: Record<CategoriaVoto, number>;
    resultadosPorPartido: Record<CategoriaVoto, Record<string, number>>;
    resultadosPorRegion: Record<string, number>;
}

// --- CONSTANTES Y DATA DE SOPORTE ---
const LIVE_VOTES_KEY = 'liveElectoralResults'; 
const CLEANED_VOTES_KEY = 'cleanedUploadedVotes'; // Clave para la data limpia
const DEPARTAMENTOS = ["Lima", "Arequipa", "Cuzco", "Otros"]; 
const PARTIDO_COLORS: Record<string, string> = {
    "ALIANZA PARA EL PROGRESO": "#0d6efd", "PERÚ LIBRE": "#dc3545", "FREPAP": "#ffc107", 
    "FUERZA POPULAR": "#e30b1c", "APRA": "#e83e8c", "ACCIÓN POPULAR": "#20c997", 
    "SOMOS PERÚ": "#6f42c1", "RENOVACIÓN POPULAR": "#0dcaf0", "AVANZA PAÍS": "#198754", 
    "PERÚ POSIBLE": "#6610f2", "PARTIDO MORADO": "#800080", "JUNTOS PERÚ": "#fd7e14", 
    "SOLIDARIDAD NACIONAL": "#ffcd39", "PERUANOS POR EL KAMBIO": "#007bff", 
    "PERÚ PRIMERO": "#d63384", "VOTO EN BLANCO": "#adb5bd", "VOTO NULO": "#6c757d",
};

// Mapeo de partidos (función pura)
const partidosMapeados: Partido[] = (() => {
    const partyNames = rawPartidos.map(p => p.nombre);
    const allPartyNames = [...partyNames, "VOTO EN BLANCO", "VOTO NULO"];
    
    return allPartyNames.map(nombre => ({
        nombre,
        logo: rawPartidos.find(p => p.nombre === nombre)?.logo || "", 
        color: PARTIDO_COLORS[nombre] || "#000000", 
    }));
})();

// --- LÓGICA DE PROCESAMIENTO DE DATOS (FUNCIONES PURAS) ---

const getRegion = (dni: string) => {
    // ASUMIMOS que nombresSimulados es un objeto de tipo Record<string, { departamento: string }>
    const usuario = (nombresSimulados as any)[dni]; 
    return usuario?.departamento || "Otros"; 
};

/**
 * Función pura para cargar de forma segura los votos de una clave de localStorage.
 */
const loadVotesFromStorage = (key: string): Voto[] => {
    try {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error(`Error loading data from ${key}:`, e);
        return [];
    }
};


/**
 * Calcula todos los resultados clave a partir de la lista de votos. (Función pura)
 */
const calculateResults = (allVotos: Voto[]): GeneralResults => {
    const votosPorCategoria: Record<CategoriaVoto, number> = {
        presidencial: 0, congreso: 0, parlamento: 0,
    };
    const resultadosPorPartido: Record<CategoriaVoto, Record<string, number>> = {
        presidencial: {}, congreso: {}, parlamento: {},
    };
    const resultadosPorRegion: Record<string, number> = {};

    partidosMapeados.forEach(p => {
        categorias.forEach(cat => {
            resultadosPorPartido[cat][p.nombre] = 0;
        });
    });
    DEPARTAMENTOS.forEach(dep => {
        resultadosPorRegion[dep] = 0;
    });

    allVotos.forEach(voto => {
        votosPorCategoria[voto.categoria]++;
        
        const partido = voto.partido;
        // Aseguramos que el partido exista en el conteo, incluyendo 'VOTO EN BLANCO'/'VOTO NULO'
        if (resultadosPorPartido[voto.categoria][partido] === undefined) {
             resultadosPorPartido[voto.categoria][partido] = 0;
        }
        resultadosPorPartido[voto.categoria][partido]++;

        // Aseguramos que la región exista en el conteo
        const region = voto.region || 'Otros';
        resultadosPorRegion[region] = (resultadosPorRegion[region] || 0) + 1;
    });

    return {
        totalVotos: allVotos.length,
        votosPorCategoria,
        resultadosPorPartido,
        resultadosPorRegion,
    };
};

/**
 * Función pura para transformar los resultados del partido en el formato de datos de la gráfica de barras.
 */
const getBarChartData = (results: GeneralResults, activeCategory: CategoriaVoto): CategoryResultData => {
    const data = results.resultadosPorPartido[activeCategory];
    // 1. Convertir a array, excluyendo votos en blanco/nulo para el TOP 10 de partidos.
    const filteredParties = Object.entries(data).filter(([nombre]) => 
        nombre !== "VOTO EN BLANCO" && nombre !== "VOTO NULO"
    );
    // 2. Ordenar y tomar los 10 primeros
    const sortedParties = filteredParties
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10); 

    const labels = sortedParties.map(([nombre]) => nombre);
    const counts = sortedParties.map(([, count]) => count);
    const colors = labels.map(label => PARTIDO_COLORS[label] || "#343a40");

    return {
        labels,
        datasets: [
            { label: 'Votos', data: counts, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 1, },
        ],
    };
};

const getRegionalChartData = (results: GeneralResults): CategoryResultData => {
    const data = results.resultadosPorRegion; 
    const labels = Object.keys(data);
    const counts = Object.values(data);
    
    // Mapeo de colores predefinido
    const colors = labels.map((label, index) => PARTIDO_COLORS[label] || ["#007bff", "#dc3545", "#ffc107", "#6c757d", "#27dd30ff", "#e41bffff"][index % 6]);

    return {
        labels,
        datasets: [
            { label: 'Participación Regional', data: counts, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 1, },
        ],
    };
};

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<CategoriaVoto>("presidencial");
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toLocaleTimeString());
    // reloadKey es la clave que fuerza a useMemo/useEffect a re-ejecutarse
    const [reloadKey, setReloadKey] = useState(0); 

    // 🏆 Lógica de Datos: Combina Votos en Vivo y Votos Limpios
    const allVotos = useMemo(() => {
        // 1. Obtener votos en tiempo real (de la simulación)
        const liveVotos = fetchVotos() as Voto[]; // Usamos fetchVotos() que debe devolver los votos del mockData
        // 2. Obtener votos limpios (de archivos JSON aplicados)
        const cleanedVotos = loadVotesFromStorage(CLEANED_VOTES_KEY); 

        // 3. Combinar ambos sets de datos
        const allVotosRaw = [...liveVotos, ...cleanedVotos];

        // 4. Enriquecer con la región (si no la tiene, se asume del mock data)
        return allVotosRaw.map(voto => ({
            ...voto,
            region: voto.region || getRegion(voto.dni),
        }));
    }, [reloadKey]); // Se refresca cuando cambia reloadKey (por timer o evento)

    // 2. Calcular los resultados
    const results = useMemo(() => calculateResults(allVotos), [allVotos]);

    // 3. Preparar datos para el gráfico de barras por categoría
    const categoryChartData = useMemo(() => {
        return getBarChartData(results, activeCategory);
    }, [results, activeCategory]);

    // 4. Preparar datos para el gráfico de dona regional
    const regionalData = useMemo(() => {
        return getRegionalChartData(results);
    }, [results]);

    // Función utilitaria para el JSX (Usa useCallback para optimización)
    const getVotosPorCategoria = useCallback((categoria: CategoriaVoto): number => {
        return results.votosPorCategoria[categoria] || 0;
    }, [results.votosPorCategoria]);


    // ------------------------------------------------------------------
    // 🏆 LÓGICA DE SINCRONIZACIÓN
    // ------------------------------------------------------------------

    // 1. Escuchar el evento 'data-applied' de DataCleaning
    useEffect(() => {
        const handleDataApplied = () => {
            // Forzar la recarga de datos (lo que dispara nuevamente el useMemo de allVotos)
            setReloadKey(prev => prev + 1); 
            setLastUpdateTime(new Date().toLocaleTimeString());
        };

        // 💡 Listener para el evento que dispara DataCleaning.tsx
        window.addEventListener('data-applied', handleDataApplied);

        return () => {
            window.removeEventListener('data-applied', handleDataApplied);
        };
    }, []); 

    // 2. Refresco de datos por intervalo (simulación LIVE)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setReloadKey(prev => prev + 1); 
            setLastUpdateTime(new Date().toLocaleTimeString());
        }, 5000); 

        return () => clearInterval(intervalId);
    }, []); 
    
    // 3. Inicialización de datos (Asegura que haya data inicial)
    useEffect(() => {
        if (loadVotesFromStorage(LIVE_VOTES_KEY).length === 0) {
            // Simulación de inicialización de datos si no hay nada en LIVE_VOTES_KEY
            const initialVotos: Voto[] = [];
            const users = Object.keys(nombresSimulados).slice(0, 4); 
            const partyNames = rawPartidos.map(p => p.nombre);
            
            users.forEach((dni, index) => {
                categorias.forEach(categoria => {
                    const randomParty = partyNames[index % partyNames.length]; 
                    initialVotos.push({
                        dni,
                        categoria,
                        partido: randomParty,
                        region: getRegion(dni),
                    } as Voto);
                });
            });

            localStorage.setItem(LIVE_VOTES_KEY, JSON.stringify(initialVotos));
            setReloadKey(prev => prev + 1); // Forzar la carga de los votos iniciales
        }
    }, []); 

    // ------------------------------------------------------------------
    // RENDERIZADO (JSX)
    // ------------------------------------------------------------------
    return (
        <div className="container-fluid py-4">
            {/* TÍTULO Y ESTADO */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h1 className="h3 fw-bold text-dark mb-0">Dashboard de Resultados</h1>
                <div className="text-end">
                    <p className="text-muted mb-0 small">
                        Última Actualización: <strong className="text-dark">{lastUpdateTime}</strong>
                    </p>
                    <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                        <i className="bi bi-circle-fill small me-1"></i> EN VIVO
                    </span>
                </div>
            </div>

            {/* RESUMEN TOTAL DE VOTOS */}
            <div className="card border-0 shadow-lg rounded-3 mb-4 bg-primary text-white">
                <div className="card-body p-4">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            <i className="fas fa-vote-yea fa-3x"></i>
                        </div>
                        <div className="col">
                            <h2 className="card-title fw-light-bold mb-1">Total de Votos Registrados</h2>
                            <h1 className="display-4 fw-bold">{results.totalVotos.toLocaleString()}</h1>
                        </div>
                        <div className="col-md-5">
                            <p className="mb-0 small fw-semibold">Votos por Región:</p>
                            <div className="progress" style={{ height: "10px" }}>
                                {DEPARTAMENTOS.map((dep, index) => {
                                    const total = results.resultadosPorRegion[dep] || 0;
                                    const percentage = (total / results.totalVotos) * 100 || 0;
                                    const colorClass = ["bg-info", "bg-danger", "bg-warning", "bg-secondary"][index % 4];
                                    return (
                                        <div
                                            key={dep}
                                            className={`progress-bar ${colorClass}`}
                                            role="progressbar"
                                            style={{ width: `${percentage}%` }}
                                            aria-valuenow={percentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            title={`${dep}: ${total.toLocaleString()} (${percentage.toFixed(1)}%)`}
                                        ></div>
                                    );
                                })}
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                                {DEPARTAMENTOS.map((dep) => {
                                    const total = results.resultadosPorRegion[dep] || 0;
                                    return <span key={dep} className="text-white fw-light">{dep}: {total.toLocaleString()}</span>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAV BAR DE CATEGORÍAS - ESTILO MEJORADO */}
            <div className="card border-0 shadow-sm rounded-3 mb-4">
                <div className="card-header bg-white py-3 d-flex align-items-center">
                    <h5 className="fw-bold mb-0 text-dark me-4" style={{ fontSize: "1.05rem" }}>
                        Seleccionar Categoría:
                    </h5>
                    {/* Contenedor de Nav-Pills */}
                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                        {categorias.map((categoria) => (
                            <li className="nav-item me-2" role="presentation" key={categoria}>
                                <button
                                    className={`nav-link text-capitalize fw-semibold border ${
                                        activeCategory === categoria 
                                            ? 'active bg-success text-white border-primary' // Estilo activo (alto contraste)
                                            : 'text-dark bg-primary border-light' // Estilo inactivo (buen contraste)
                                    }`}
                                    onClick={() => setActiveCategory(categoria)}
                                    // Estilos adicionales para un hover más suave
                                    style={{ cursor: 'pointer', fontSize: '0.9rem', transition: 'background-color 0.2s, border-color 0.2s' }}
                                    onMouseEnter={(e) => {
                                        if (activeCategory !== categoria) {
                                            e.currentTarget.style.backgroundColor = '#e9ecef'; // Hover más claro
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeCategory !== categoria) {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa'; // Vuelve al bg-light
                                        }
                                    }}
                                >
                                    {categoria} ({getVotosPorCategoria(categoria).toLocaleString()})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* GRÁFICOS */}
            <div className="row g-4 mb-4">
                {/* GRÁFICO DE BARRAS POR PARTIDO */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
                        <h5 className="fw-bold mb-3 text-dark">Top 10 Partidos por Categoría</h5>
                        <div className="p-2" style={{ height: "400px" }}>
                            <Bar 
                                data={categoryChartData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false, 
                                    indexAxis: 'y' as const, 
                                    plugins: { 
                                        legend: { display: false }, 
                                        title: { display: true, text: `Resultados - ${activeCategory.toUpperCase()}` }, 
                                    }, 
                                    scales: { x: { beginAtZero: true }, }, 
                                }} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* GRÁFICO DE DONA REGIONAL */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
                        <h5 className="fw-bold mb-3 text-dark">Participación por Región</h5>
                        <div className="d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
                            <div style={{ width: "250px", height: "250px" }}>
                                <Doughnut 
                                    data={regionalData} 
                                    options={{ 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'bottom' },
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETALLE DE RESULTADOS (Tabla) */}
            <ResultsDetailTable 
                results={results} 
                activeCategory={activeCategory} 
                getVotosPorCategoria={getVotosPorCategoria} 
                partidosMapeados={partidosMapeados}
            />
            
            {/* Pie de página */}
            <footer className="text-center text-muted py-3 border-top mt-5">
                <small>&copy; 2023 Sistema Electoral Digital. Resultados en Tiempo Real.</small>
            </footer>
        </div>
    );
}

// ----------------------------------------------------------------------
// COMPONENTE AUXILIAR (ResultsDetailTable)
// ----------------------------------------------------------------------
interface ResultsDetailTableProps {
    results: GeneralResults;
    activeCategory: CategoriaVoto;
    getVotosPorCategoria: (categoria: CategoriaVoto) => number;
    partidosMapeados: Partido[];
}

function ResultsDetailTable({ results, activeCategory, getVotosPorCategoria, partidosMapeados }: ResultsDetailTableProps) {
    const totalVotes = results.totalVotos; 
    const totalCategoryVotes = getVotosPorCategoria(activeCategory); 
    
    const categoryResults = useMemo(() => {
        const data = results.resultadosPorPartido[activeCategory];
        
        return Object.entries(data).map(([nombre, votos]) => {
            const partidoInfo = partidosMapeados.find(p => p.nombre === nombre);
            return {
                nombre,
                votos,
                logo: partidoInfo?.logo || "",
                color: partidoInfo?.color || "#343a40",
            };
        });
    }, [results, activeCategory, partidosMapeados]);

    const sortedResults = categoryResults.sort((a, b) => b.votos - a.votos);

    // Calcular votos válidos (excluyendo Blanco y Nulo)
    const totalVotosValidos = sortedResults.reduce((sum, p) => {
        if (p.nombre !== "VOTO EN BLANCO" && p.nombre !== "VOTO NULO") {
            return sum + p.votos;
        }
        return sum;
    }, 0);

    return (
        <div className="card border-0 shadow-sm rounded-3 mt-4">
            <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.1rem" }}>Resultados Detallados: {activeCategory.toUpperCase()}</h5>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="text-center">#</th>
                                <th scope="col">Partido</th>
                                <th scope="col" className="text-end">Votos</th>
                                <th scope="col" className="text-end">% Total</th>
                                <th scope="col" className="text-end">% Válidos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedResults.map((p, index) => {
                                // Se usa totalVotes (total absoluto) para % Total
                                const percentageTotal = (p.votos / totalVotes) * 100 || 0; 
                                // Se usa totalVotosValidos (sin blanco/nulo) para % Válidos
                                const percentageValidos = (p.votos / totalVotosValidos) * 100 || 0;

                                return (
                                    <tr key={p.nombre}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {/* Indicador de Color del Partido */}
                                                <div 
                                                    style={{ 
                                                        width: '15px', 
                                                        height: '15px', 
                                                        backgroundColor: p.color, 
                                                        borderRadius: '3px', 
                                                        marginRight: '8px'
                                                    }}
                                                ></div>
                                                <strong className="text-dark">{p.nombre}</strong>
                                            </div>
                                        </td>
                                        <td className="text-end fw-semibold">{p.votos.toLocaleString()}</td>
                                        <td className="text-end text-muted">{percentageTotal.toFixed(2)}%</td>
                                        <td className="text-end text-primary fw-bold">
                                            {p.nombre === "VOTO EN BLANCO" || p.nombre === "VOTO NULO" 
                                                ? 'N/A' 
                                                : `${percentageValidos.toFixed(2)}%`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="table-light">
                            <tr>
                                <th colSpan={2}>TOTAL DE VOTOS EN CATEGORÍA ({activeCategory.toUpperCase()})</th>
                                <th className="text-end">{totalCategoryVotes.toLocaleString()}</th>
                                <th className="text-end">{(totalCategoryVotes / totalVotes * 100).toFixed(2)}%</th>
                                <th className="text-end">{totalVotosValidos.toLocaleString()} Válidos</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}