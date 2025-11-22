// components/votacion/VoteNavbar.tsx
import React from "react";

export type CategoriaId = "presidencial" | "congreso" | "parlamento";

interface VoteNavbarProps {
  current: CategoriaId;
  onSelect: (c: CategoriaId) => void;
  disabled?: boolean;
  // 🚀 CAMBIO CLAVE 3: Nueva propiedad para el control de secciones
  categoriasVotadas: CategoriaId[]; 
}

export default function VoteNavbar({ 
    current, 
    onSelect, 
    disabled = false, 
    // 🚀 CAMBIO CLAVE 4: Recibir la nueva prop
    categoriasVotadas
}: VoteNavbarProps) {
  
  const categorias: { id: CategoriaId; label: string }[] = [
    { id: "presidencial", label: "Presidencial" },
    { id: "congreso", label: "Congreso" },
    { id: "parlamento", label: "Parlamento Andino" },
  ];

  return (
    <nav
      className="d-flex justify-content-center align-items-center py-3 mb-4 shadow-sm"
      style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e6eef5" }}
    >
      {categorias.map((cat) => {
        const active = cat.id === current;
        // 🚀 CAMBIO CLAVE 5: Lógica de bloqueo
        const isVoted = categoriasVotadas.includes(cat.id);
        const isDisabled = disabled || isVoted; // Bloqueado si está finalizado O ya votado

        let btnClass = active ? "btn-primary" : "btn-outline-primary";
        
        // Si ya votó, cambiamos el color y lo bloqueamos
        if (isVoted) {
            btnClass = active ? "btn-success" : "btn-outline-secondary"; 
        }

        return (
          <button
            key={cat.id}
            // 🚀 CAMBIO CLAVE 6: Usar isDisabled
            onClick={() => !isDisabled && onSelect(cat.id)} 
            className={`btn mx-2 px-4 fw-semibold ${btnClass}`}
            style={{ minWidth: 170 }}
            // 🚀 CAMBIO CLAVE 7: Deshabilitar el botón
            disabled={isDisabled} 
            type="button"
          >
            {cat.label}
            {/* 🚀 Indicador de voto completado */}
            {isVoted && <i className="bi bi-check-circle-fill ms-2"></i>} 
          </button>
        );
      })}
    </nav>
  );
}