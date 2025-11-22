export type Voto = {
  dni: string;
  nombres: string;
  apellidos: string;
  region: string;
  categoria: "presidencial" | "congreso" | "parlamento";
  partido: string;
  candidato: string; // ✅ añadido para registrar el nombre del candidato
};

// types.ts - Expandir con:
export type DatasetType = "votantes" | "partidos" | "resultados";

export type UploadedFile = {
  name: string;
  type: DatasetType;
  size: number;
  uploadDate: Date;
  records: number;
};

export type ElectionMetrics = {
  totalVotes: number;
  participationRate: number;
  votesPerHour: number;
  leadingParty: string;
};