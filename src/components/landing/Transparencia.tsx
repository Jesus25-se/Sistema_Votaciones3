export default function Transparencia() {
  return (
    <section className="py-4">
      <div className="container text-center">
        {/* Reducido el margen inferior de mb-4 a mb-3 */}
        <h2 className="fw-bold text-primary mb-3">Seguridad y Transparencia</h2>
        <p 
          // Removida la clase fs-5 y reducido el maxWidth para un texto más compacto
          className="text-dark mx-auto" 
          style={{ maxWidth: "650px" }}
        >
          Nuestro sistema implementa prácticas de seguridad digital que garantizan
          la autenticidad de cada voto. La información se almacena de forma
          anónima y encriptada, asegurando la confidencialidad y evitando la
          duplicación de votos.
        </p>

        <div className="row mt-4">
          {/* CARD 1: Encriptación avanzada */}
          {/* Reducido el margen inferior de mb-3 a mb-2 en las columnas */}
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {/* Reducido el margen inferior de mb-3 a mb-2 en el contenedor del ícono */}
                <div className="mb-2">
                  <i className="bi bi-shield-lock-fill" style={{ fontSize: "2.5rem", color: "#0d6efd" }}></i>
                </div>
                <h5 className="fw-bold text-dark">Encriptación avanzada</h5>
                <p className="text-muted">
                  Todos los datos se transmiten de forma cifrada mediante
                  protocolos seguros.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 2: Auditorías verificables */}
          {/* Reducido el margen inferior de mb-3 a mb-2 en las columnas */}
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {/* Reducido el margen inferior de mb-3 a mb-2 en el contenedor del ícono */}
                <div className="mb-2">
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: "2.5rem", color: "#198754" }}></i>
                </div>
                <h5 className="fw-bold text-dark">Auditorías verificables</h5>
                <p className="text-muted">
                  El sistema permite verificar los resultados en tiempo real sin
                  comprometer la privacidad.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: Registro inalterable */}
          {/* Reducido el margen inferior de mb-3 a mb-2 en las columnas */}
          <div className="col-md-4 mb-2">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {/* Reducido el margen inferior de mb-3 a mb-2 en el contenedor del ícono */}
                <div className="mb-2">
                  <i className="bi bi-file-lock-fill" style={{ fontSize: "2.5rem", color: "#dc3545" }}></i>
                </div>
                <h5 className="fw-bold text-dark">Registro inalterable</h5>
                <p className="text-muted">
                  Cada voto queda registrado en un historial que no puede ser
                  modificado ni eliminado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}