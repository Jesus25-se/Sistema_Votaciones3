import type { Voto } from "../types";

// 🧩 Importar logos de partidos
import partidoA from "../assets/partidos/partidoA.png";
import partidoB from "../assets/partidos/partidoB.png";
import partidoC from "../assets/partidos/partidoC.png";
import partidoD from "../assets/partidos/partidoD.png";
import partidoE from "../assets/partidos/partidoE.png";
import partidoF from "../assets/partidos/partidoF.png";
import partidoG from "../assets/partidos/partidoG.png";
import partidoH from "../assets/partidos/partidoH.png";
import partidoI from "../assets/partidos/partidoI.png";
import partidoJ from "../assets/partidos/partidoJ.png";
import partidoK from "../assets/partidos/partidoK.png";
import partidoL from "../assets/partidos/partidoL.png";
import partidoM from "../assets/partidos/partidoM.png";
import partidoN from "../assets/partidos/partidoN.png";
import partidoO from "../assets/partidos/partidoO.png";

// 🧩 Importar fotos de candidatos (temporalmente genéricas)
import candidatoA from "../assets/candidatos/candidatoA.png";
import candidatoB from "../assets/candidatos/candidatoB.png";
import candidatoC from "../assets/candidatos/candidatoC.png";
import candidatoD from "../assets/candidatos/candidatoD.png";
import candidatoE from "../assets/candidatos/candidatoE.png";
import candidatoF from "../assets/candidatos/candidatoF.png";
import candidatoG from "../assets/candidatos/candidatoG.png";
import candidatoH from "../assets/candidatos/candidatoH.png";
import candidatoI from "../assets/candidatos/candidatoI.png";
import candidatoJ from "../assets/candidatos/candidatoJ.png";
import candidatoK from "../assets/candidatos/candidatoK.png";
import candidatoL from "../assets/candidatos/candidatoL.png";
import candidatoM from "../assets/candidatos/candidatoM.png";
import candidatoN from "../assets/candidatos/candidatoN.png";
import candidatoO from "../assets/candidatos/candidatoO.png";

// 💡 INTERFAZ: Define la estructura con la nueva información
export interface CandidatoInfo {
    nombre: string;
    foto: string;
    descripcion: string; // Campo para el modal
    propuestas: string[]; // Campo para el modal
}
// 👤 Tipado para usuarios (incluye el nuevo campo)
interface UsuarioSimulado {
    nombres: string; 
    apellidos: string; 
    departamento: string;
    fechaNacimiento: string; // 🚀 NUEVO CAMPO: Formato YYYY-MM-DD
}
// 👤 Usuarios simulados
export const nombresSimulados: Record<string, UsuarioSimulado> = {
  "12345678": { nombres: "Juan Carlos", apellidos: "Pérez Gómez", departamento: "Lima", fechaNacimiento: "1985-06-15" }, // 🚀 AÑADIDO
  "87654321": { nombres: "María Fernanda", apellidos: "López Díaz", departamento: "Arequipa", fechaNacimiento: "1992-11-20"}, // 🚀 AÑADIDO
  "11112222": { nombres: "Pedro José", apellidos: "Ramírez Torres", departamento: "Cuzco", fechaNacimiento: "2000-01-01" }, // 🚀 AÑADIDO
  "60921146": { nombres: "Jordy Joseph", apellidos: " Aguilar Melgar", departamento: "Lima", fechaNacimiento: "2007-01-07" }, // 🚀 AÑADIDO  
};

// 🗳️ Partidos simulados (con candidatos + fotos por categoría)
export const partidosSimulados: {
    nombre: string;
    logo: string;
    candidatos: Record<string, CandidatoInfo>; // Usa CandidatoInfo
}[] = [
  {
    nombre: "ALIANZA PARA EL PROGRESO",
    logo: partidoA, 
    candidatos: {
      presidencial: { 
            nombre: "César Acuña", 
            foto: candidatoA, 
            descripcion: "Empresario y político con experiencia en gestión pública. Fundador de la Universidad César Vallejo.",
            propuestas: [
                "Incremento del presupuesto para educación.",
                "Creación de 500 mil empleos en infraestructura.",
                "Bono universal para familias vulnerables."
            ]
        },
      congreso: { 
            nombre: "Lucía Ramos", 
            foto: candidatoA, 
            descripcion: "Candidata al Congreso. Enfocada en la reactivación económica y la seguridad ciudadana.",
            propuestas: ["Reformar el sistema de justicia.", "Promover la inversión descentralizada."]
        },
      parlamento: { 
            nombre: "Eduardo Chacón", 
            foto: candidatoA, 
            descripcion: "Candidato al Parlamento Andino. Busca fortalecer la integración regional y el comercio justo.",
            propuestas: ["Impulsar acuerdos comerciales andinos.", "Programas de intercambio cultural."]
        },
    },
  },
  {
    nombre: "PERÚ LIBRE",
    logo: partidoB, 
    candidatos: {
      presidencial: { 
            nombre: "Pedro Castillo", 
            foto: candidatoB, 
            descripcion: "Profesor y dirigente sindical. Propone un cambio radical en el modelo económico del país.",
            propuestas: [
                "Nueva Constitución a través de Asamblea Constituyente.",
                "Nacionalización de sectores estratégicos (minería, gas).",
                "Reforma agraria."
            ]
        },
      congreso: { 
            nombre: "María Gutiérrez", 
            foto: candidatoB, 
            descripcion: "Candidata al Congreso. Prioriza la salud y el acceso a servicios básicos en zonas rurales.",
            propuestas: ["Asegurar el acceso universal a medicinas.", "Mejorar la infraestructura sanitaria."]
        },
      parlamento: { 
            nombre: "Diego Vera", 
            foto: candidatoB, 
            descripcion: "Candidato al Parlamento Andino. Lucha por los derechos de los trabajadores migrantes en la región.",
            propuestas: ["Homologar títulos profesionales en la Comunidad Andina.", "Defender la libre circulación."]
        },
    },
  },
  {
    nombre: "FREPAP",
    logo: partidoC, 
    candidatos: {
      presidencial: { 
            nombre: "Ruth Luque", 
            foto: candidatoC, 
            descripcion: "Abogada y defensora de los derechos humanos. Centrada en la ética política y la lucha contra la corrupción.",
            propuestas: [
                "Transparencia total en el gasto público.",
                "Fortalecimiento de la Contraloría.",
                "Impulso a energías renovables."
            ]
        },
      congreso: { 
            nombre: "Juan Ríos", 
            foto: candidatoC, 
            descripcion: "Candidato al Congreso. Se enfoca en leyes para proteger el medio ambiente y los recursos naturales.",
            propuestas: ["Ley de protección de glaciares.", "Cierre de minería informal."]
        },
      parlamento: { 
            nombre: "Andrea León", 
            foto: candidatoC, 
            descripcion: "Candidata al Parlamento Andino. Promueve la cultura andina y la identidad regional en los currículos escolares.",
            propuestas: ["Fomento de turismo sostenible.", "Programas de becas andinas."]
        },
    },
  },
  {
    nombre: "FUERZA POPULAR",
    logo: partidoD, 
    candidatos: {
      presidencial: { 
            nombre: "Keiko Fujimori", 
            foto: candidatoD, 
            descripcion: "Líder histórica de Fuerza Popular. Su plataforma se centra en la seguridad y la inversión extranjera.",
            propuestas: [
                "Mano dura contra la delincuencia.",
                "Reducción de impuestos a la inversión privada.",
                "Modernización de puertos y aeropuertos."
            ]
        },
      congreso: { 
            nombre: "Oscar Martínez", 
            foto: candidatoD, 
            descripcion: "Candidato al Congreso. Propone simplificar los trámites burocráticos para las pequeñas empresas.",
            propuestas: ["Digitalización del Estado.", "Ley de protección al emprendedor."]
        },
      parlamento: { 
            nombre: "Rosa Villalobos", 
            foto: candidatoD, 
            descripcion: "Candidata al Parlamento Andino. Promueve la creación de un mercado andino común para productos agrícolas.",
            propuestas: ["Eliminar aranceles en la región andina.", "Certificación de origen para alimentos."]
        },
    },
  },
  {
    nombre: "APRA",
    logo: partidoE, 
    candidatos: {
      presidencial: { 
            nombre: "Alan García Jr.", 
            foto: candidatoE, 
            descripcion: "Político de trayectoria, defensor de las instituciones democráticas y el crecimiento con inclusión social.",
            propuestas: [
                "Reforma del sistema de pensiones.",
                "Impulso a programas sociales focalizados.",
                "Convenios internacionales de seguridad."
            ]
        },
      congreso: { 
            nombre: "Luis Vargas", 
            foto: candidatoE, 
            descripcion: "Candidato al Congreso. Enfoque en la descentralización fiscal y mayor autonomía regional.",
            propuestas: ["Ley de canon minero justo.", "Transferencia de competencias a gobiernos locales."]
        },
      parlamento: { 
            nombre: "Carmen Arévalo", 
            foto: candidatoE, 
            descripcion: "Candidata al Parlamento Andino. Busca la armonización de las leyes laborales en los países miembros.",
            propuestas: ["Creación de un observatorio laboral andino.", "Protección de derechos de frontera."]
        },
    },
  },
  {
    nombre: "ACCIÓN POPULAR",
    logo: partidoF, 
    candidatos: {
      presidencial: { 
            nombre: "Víctor Andrés García", 
            foto: candidatoF, 
            descripcion: "Representante de la tradición acciopopulista. Se centra en la obra pública y la infraestructura nacional.",
            propuestas: [
                "Retomar la construcción de la Carretera Marginal de la Selva.",
                "Inversión en agua y saneamiento rural.",
                "Apoyo al sector agropecuario."
            ]
        },
      congreso: { 
            nombre: "Fiorella Espinoza", 
            foto: candidatoF, 
            descripcion: "Candidata al Congreso. Impulsa iniciativas para la igualdad de género y el empoderamiento femenino.",
            propuestas: ["Cuotas de participación política para mujeres.", "Programas de microcrédito para mujeres emprendedoras."]
        },
      parlamento: { 
            nombre: "Bruno Castillo", 
            foto: candidatoF, 
            descripcion: "Candidato al Parlamento Andino. Defiende la soberanía alimentaria y el uso responsable de los recursos naturales.",
            propuestas: ["Estrategias conjuntas contra la minería ilegal.", "Acuerdos de protección ambiental binacionales."]
        },
    },
  },
  {
    nombre: "SOMOS PERÚ",
    logo: partidoG, 
    candidatos: {
      presidencial: { 
            nombre: "Patricia Pérez", 
            foto: candidatoG, 
            descripcion: "Profesional con experiencia en gestión municipal. Propone mejorar la calidad de vida en las ciudades.",
            propuestas: [
                "Mejora del transporte público.",
                "Incentivos para la vivienda social.",
                "Programas de reciclaje y medio ambiente urbano."
            ]
        },
      congreso: { 
            nombre: "Hugo Torres", 
            foto: candidatoG, 
            descripcion: "Candidato al Congreso. Enfocado en la reforma del sistema de salud para una mejor atención primaria.",
            propuestas: ["Más centros de salud comunales.", "Aumento de sueldos para personal médico."]
        },
      parlamento: { 
            nombre: "Norma Cárdenas", 
            foto: candidatoG, 
            descripcion: "Candidata al Parlamento Andino. Promueve la creación de una red de universidades andinas de investigación.",
            propuestas: ["Intercambio estudiantil.", "Proyectos de ciencia y tecnología regional."]
        },
    },
  },
  {
    nombre: "RENOVACIÓN POPULAR",
    logo: partidoH, 
    candidatos: {
      presidencial: { 
            nombre: "Rafael López Aliaga", 
            foto: candidatoH, 
            descripcion: "Empresario y filántropo. Su campaña se centra en valores conservadores y la estabilidad económica.",
            propuestas: [
                "Reactivación económica con énfasis en la pequeña empresa.",
                "Lucha frontal contra la ideología de género.",
                "Promoción de la inversión privada a gran escala."
            ]
        },
      congreso: { 
            nombre: "Martín Morales", 
            foto: candidatoH, 
            descripcion: "Candidato al Congreso. Propone una reducción significativa de la burocracia estatal.",
            propuestas: ["Ley de 'Cero Trámites Innecesarios'.", "Incentivos fiscales a la formalización."]
        },
      parlamento: { 
            nombre: "Gina Fernández", 
            foto: candidatoH, 
            descripcion: "Candidata al Parlamento Andino. Busca la protección de la familia y los valores tradicionales en la región.",
            propuestas: ["Foros de debate sobre políticas familiares.", "Acuerdos de cooperación educativa basada en valores."]
        },
    },
  },
  {
    nombre: "AVANZA PAÍS",
    logo: partidoI, 
    candidatos: {
      presidencial: { 
            nombre: "Hernando de Soto", 
            foto: candidatoI, 
            descripcion: "Economista reconocido internacionalmente. Su propuesta se enfoca en formalizar la economía y dar títulos de propiedad.",
            propuestas: [
                "Titulación masiva de predios en zonas urbanas y rurales.",
                "Acceso a capital para emprendedores informales.",
                "Lucha contra la informalidad laboral."
            ]
        },
      congreso: { 
            nombre: "Cristina Campos", 
            foto: candidatoI, 
            descripcion: "Candidata al Congreso. Promueve la educación financiera y el acceso al crédito para jóvenes.",
            propuestas: ["Cursos obligatorios de economía en colegios.", "Regulación de tasas de interés."]
        },
      parlamento: { 
            nombre: "Raúl Paredes", 
            foto: candidatoI, 
            descripcion: "Candidato al Parlamento Andino. Busca acuerdos para facilitar la inversión transfronteriza y la libre empresa.",
            propuestas: ["Armonización de leyes de inversión.", "Creación de zonas francas andinas."]
        },
    },
  },
  {
    nombre: "PERÚ POSIBLE",
    logo: partidoJ, 
    candidatos: {
      presidencial: { 
            nombre: "Alejandro Toledo Jr.", 
            foto: candidatoJ, 
            descripcion: "Heredero político que busca revivir la visión de su padre, enfocada en la inclusión andina y la globalización.",
            propuestas: [
                "Inversión en infraestructura vial andina.",
                "Programas de becas de alto rendimiento.",
                "Fomento del turismo cultural."
            ]
        },
      congreso: { 
            nombre: "Carla Ramos", 
            foto: candidatoJ, 
            descripcion: "Candidata al Congreso. Enfocada en la transparencia en la función pública y la participación ciudadana.",
            propuestas: ["Implementación de presupuesto participativo.", "Ley de protección de denunciantes de corrupción."]
        },
      parlamento: { 
            nombre: "Fernando León", 
            foto: candidatoJ, 
            descripcion: "Candidato al Parlamento Andino. Busca fortalecer el rol de los pueblos originarios en la toma de decisiones regionales.",
            propuestas: ["Reconocimiento de lenguas andinas.", "Creación de un fondo de desarrollo indígena."]
        },
    },
  },
  {
    nombre: "PARTIDO MORADO",
    logo: partidoK, 
    candidatos: {
      presidencial: { 
            nombre: "Julio Guzmán", 
            foto: candidatoK, 
            descripcion: "Ex funcionario público y líder del Partido Morado. Aboga por la meritocracia y un gobierno moderno.",
            propuestas: [
                "Reforma del servicio civil basada en el mérito.",
                "Impulso a la educación digital y tecnológica.",
                "Modernización de las fuerzas policiales."
            ]
        },
      congreso: { 
            nombre: "Sofía Medina", 
            foto: candidatoK, 
            descripcion: "Candidata al Congreso. Propone leyes para proteger los derechos digitales y la privacidad de los ciudadanos.",
            propuestas: ["Ley de Habeas Data.", "Fomento de la ciberseguridad."]
        },
      parlamento: { 
            nombre: "Jorge Valdez", 
            foto: candidatoK, 
            descripcion: "Candidato al Parlamento Andino. Busca la unificación de los sistemas de identificación y registro civil andinos.",
            propuestas: ["Documento de identidad andino.", "Acuerdos de cooperación judicial."]
        },
    },
  },
  {
    nombre: "JUNTOS PERÚ",
    logo: partidoL, 
    candidatos: {
      presidencial: { 
            nombre: "Raúl Huamán", 
            foto: candidatoL, 
            descripcion: "Líder social con enfoque en la justicia distributiva. Su plataforma promueve la igualdad y el bienestar social.",
            propuestas: [
                "Renta básica universal para los más pobres.",
                "Aumento del salario mínimo.",
                "Control de precios en alimentos básicos."
            ]
        },
      congreso: { 
            nombre: "Milagros Díaz", 
            foto: candidatoL, 
            descripcion: "Candidata al Congreso. Prioriza el acceso a la vivienda digna y la regulación del mercado inmobiliario.",
            propuestas: ["Creación de un banco de tierras públicas.", "Subsidios a la primera vivienda."]
        },
      parlamento: { 
            nombre: "Kevin Mendoza", 
            foto: candidatoL, 
            descripcion: "Candidato al Parlamento Andino. Promueve la creación de una moneda digital andina para facilitar el comercio.",
            propuestas: ["Incentivos para el comercio intrarregional.", "Armonización de políticas aduaneras."]
        },
    },
  },
  {
    nombre: "SOLIDARIDAD NACIONAL",
    logo: partidoM, 
    candidatos: {
      presidencial: { 
            nombre: "Luis Castañeda Jr.", 
            foto: candidatoM, 
            descripcion: "Político centrista. Se enfoca en la gestión de obras de infraestructura urbana y la lucha contra la informalidad.",
            propuestas: [
                "Mejoras en la red vial urbana.",
                "Programas de apoyo a comedores populares.",
                "Fomento de la micro y pequeña empresa."
            ]
        },
      congreso: { 
            nombre: "Verónica Núñez", 
            foto: candidatoM, 
            descripcion: "Candidata al Congreso. Propone leyes de protección al consumidor y control de calidad de servicios públicos.",
            propuestas: ["Ley de defensa del usuario de telecomunicaciones.", "Creación de un defensor del consumidor."]
        },
      parlamento: { 
            nombre: "Carlos Palacios", 
            foto: candidatoM, 
            descripcion: "Candidato al Parlamento Andino. Aboga por la creación de un fondo andino de prevención de desastres naturales.",
            propuestas: ["Cooperación regional en gestión de riesgos.", "Intercambio de tecnología en sismología."]
        },
    },
  },
  {
    nombre: "PERUANOS POR EL KAMBIO",
    logo: partidoN, 
    candidatos: {
      presidencial: { 
            nombre: "Pedro Pablo Kuczynski", 
            foto: candidatoN, 
            descripcion: "Economista y ex presidente. Su enfoque es liberal, promoviendo la inversión, el libre mercado y la modernización del Estado.",
            propuestas: [
                "Inversión extranjera en minería y energía.",
                "Reducción de impuestos y simplificación tributaria.",
                "Reforma de salud para fortalecer el sector privado."
            ]
        },
      congreso: { 
            nombre: "Daniela Flores", 
            foto: candidatoN, 
            descripcion: "Candidata al Congreso. Propone una reforma educativa enfocada en el bilingüismo y la formación técnica.",
            propuestas: ["Incremento de horas de inglés en colegios.", "Creación de institutos tecnológicos públicos."]
        },
      parlamento: { 
            nombre: "Ernesto Paredes", 
            foto: candidatoN, 
            descripcion: "Candidato al Parlamento Andino. Busca la promoción de las exportaciones no tradicionales en la región.",
            propuestas: ["Misiones comerciales conjuntas.", "Simplificación de procesos de exportación."]
        },
    },
  },
  {
    nombre: "PERÚ PRIMERO",
    logo: partidoO, 
    candidatos: {
      presidencial: { 
            nombre: "Martin Vizcarra", 
            foto: candidatoO, 
            descripcion: "Ex presidente. Su campaña se centra en la lucha contra la corrupción y la estabilidad democrática.",
            propuestas: [
                "Reforma política profunda.",
                "Impulso a la infraestructura descentralizada.",
                "Fortalecimiento de la educación universitaria pública."
            ]
        },
      congreso: { 
            nombre: "Jorge Meléndez", 
            foto: candidatoO, 
            descripcion: "Candidato al Congreso. Enfocado en la legislación ambiental y la protección de la Amazonía.",
            propuestas: ["Ley de protección de la biodiversidad.", "Control estricto de la deforestación."]
        },
      parlamento: { 
            nombre: "Carlos Illanes", 
            foto: candidatoO, 
            descripcion: "Candidato al Parlamento Andino. Aboga por la cooperación regional en materia de control de fronteras y narcotráfico.",
            propuestas: ["Creación de una base de datos regional de seguridad.", "Mecanismos de acción rápida contra el crimen organizado."]
        },
    },
  },
];

// 🧠 Registro de votos temporal (INICIALMENTE VACÍO)
let votos: Voto[] = [];

// --- FUNCIONES EXPORTADAS ---
const LIVE_VOTES_KEY = 'liveElectoralResults';

export function getUsuarioPorDni(dni: string) {
  return nombresSimulados[dni] || null;
}
/**
 * Obtiene todos los votos del localStorage.
 * @returns {Voto[]} Un array de votos.
 */
export function saveVoto(voto: Voto): boolean {
    // 1. OBTENER los votos actuales de localStorage
    const votosActuales = getVotos();

    // 2. Verifica si ya existe un voto para este DNI en esta CATEGORÍA
    const yaVoto = votosActuales.some((v) => v.dni === voto.dni && v.categoria === voto.categoria);
    if (yaVoto) return false;

    // 3. AÑADIR el nuevo voto
    votosActuales.push(voto);

    // 4. ESCRIBIR la lista COMPLETA y actualizada en localStorage
    localStorage.setItem(LIVE_VOTES_KEY, JSON.stringify(votosActuales));
    
    // 5. Opcional, pero recomendado: Dispara el evento 'storage' para el AdminDashboard
    window.dispatchEvent(new Event('storage'));

    return true;
}

/**
 * Función para verificar si un DNI ya ha emitido voto en las 3 categorías.
 */
export function checkIfDniVotedAllCategories(dni: string): boolean {
    // Lee directamente de localStorage
    const votosDeDni = getVotos().filter((v) => v.dni === dni.trim()); 
    const categoriasVotadas = new Set(votosDeDni.map(v => v.categoria));
    
    return categoriasVotadas.size === 3;
}

export function getVotos(): Voto[] {
    const storedVotes = localStorage.getItem(LIVE_VOTES_KEY);
    try {
        return storedVotes ? JSON.parse(storedVotes) : [];
    } catch (error) {
        console.error("Error al parsear votos de localStorage:", error);
        return [];
    }
}