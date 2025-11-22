import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Obtenemos el objeto de la ubicación actual, que contiene la ruta.
  const location = useLocation();

  useEffect(() => {
    // Cuando 'location' (es decir, la ruta) cambia, esta función se ejecuta.
    // Llama a la función del navegador para desplazar la ventana a la parte superior.
    // scrollTo(0, 0) significa: (eje X = 0, eje Y = 0).
    window.scrollTo(0, 0);

    // [location.pathname] es la dependencia del hook. 
    // Asegura que el efecto se ejecute SOLAMENTE cuando la ruta cambie.
  }, [location.pathname]); 

  // Este componente no renderiza nada en la interfaz; solo maneja efectos secundarios.
  return null;
}