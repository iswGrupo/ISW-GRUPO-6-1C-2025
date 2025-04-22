import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfirmacionCompra = () => {
  // Estado para guardar el mensaje de confirmación
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    // Obtener el compraId desde los parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const compraId = queryParams.get('compraId');

    if (compraId) {
      // Hacer la solicitud al backend para obtener los detalles de la compra
      axios.get(`http://localhost:3000/api/compra/${compraId}`)
        .then((response) => {
          const datosCompra = response.data;

          // Formatear la fecha a un formato más legible
          const fechaFormateada = new Date(datosCompra.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Crear el mensaje de confirmación
          setResultado(`Compra realizada para el ${fechaFormateada} - ${datosCompra.cantidad} entradas. (Tus entradas han sido enviadas a tu direccion de mail!)`);
        })
        .catch((error) => {
          console.error('Error al obtener la compra:', error);
          setResultado('Error al recuperar la compra.');
        });
    }
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  return (
    <div>
      {/* Mostrar el mensaje de la compra si está disponible */}
      {resultado ? (
        <p>{resultado}</p>  // Si el resultado está disponible, se muestra aquí
      ) : (
        <p>Cargando...</p>  // Si aún no está disponible, se muestra el mensaje de "Cargando..."
      )}
    </div>
  );
};

export default ConfirmacionCompra;
