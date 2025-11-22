export default function Contacto() {
  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold text-primary mb-4">Contáctanos</h2>
        <p className="text-secondary mb-4">
          Si tienes dudas sobre el proceso electoral o el sistema, no dudes en
          escribirnos.
        </p>

        <form
          className="mx-auto"
          style={{ maxWidth: "600px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Tu nombre"
            required
          />
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo electrónico"
            required
          />
          <textarea
            className="form-control mb-3"
            placeholder="Tu mensaje"
            rows={4}
            required
          ></textarea>
          <button className="btn btn-primary w-100 fw-semibold">
            📩 Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
