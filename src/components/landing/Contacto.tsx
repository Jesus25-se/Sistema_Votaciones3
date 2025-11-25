import React, { useState } from 'react';
// Importamos los tipos necesarios para React y TypeScript
import { type FormEvent, type ChangeEvent } from 'react';

// --- Tipos de propiedades para el CustomToast ---
interface CustomToastProps {
  show: boolean;
  onClose: () => void;
}

// Componente Toast de Bootstrap (simulado con estilo fijo)
// Ahora recibe las props tipadas (CustomToastProps)
const CustomToast: React.FC<CustomToastProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className={`toast show align-items-center text-white bg-success border-0`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1050, 
      }}
    >
      <div className="d-flex">
        <div className="toast-body fw-semibold">
          ✅ ¡Mensaje enviado con éxito!
          <p className="mt-1 mb-0 fs-6 fw-normal">Pronto recibirás una respuesta a tu correo.</p>
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

// --- Tipo de datos para el estado del formulario ---
interface FormData {
    nombre: string;
    email: string;
    mensaje: string;
}

export default function Contacto() {
  const [formData, setFormData] = useState<FormData>({ // Especificamos el tipo para useState
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [showToast, setShowToast] = useState(false);

  // 2. Manejador de cambios en los inputs
  // El parámetro 'e' ahora tiene el tipo correcto: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 3. Manejador de envío simulado
  // El parámetro 'e' ahora tiene el tipo correcto: FormEvent
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Lógica de Simulación
    console.log('Datos enviados simulados:', formData);
    
    setShowToast(true);
    
    // Limpia el formulario
    setFormData({
      nombre: '',
      email: '',
      mensaje: '',
    });

    // Oculta el Toast después de 4 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 4000); 
  };

  return (
    <>
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4">Contáctanos</h2>
          <p className="text-secondary mb-4">
            Si tienes dudas sobre el proceso electoral o el sistema, no dudes en
            escribirnos.
          </p>

          <form
            className="mx-auto"
            style={{ maxWidth: '600px' }}
            onSubmit={handleSubmit} 
          >
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tu nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="form-control mb-3"
              placeholder="Tu mensaje"
              name="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary w-100 fw-semibold">
              📩 Enviar mensaje
            </button>
          </form>
        </div>
      </section>

      {/* El componente Toast se renderiza aquí */}
      <CustomToast show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}