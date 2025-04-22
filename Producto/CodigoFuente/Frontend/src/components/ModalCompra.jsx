import React from 'react';

function ModalCompra({ modalData, onClose }) {
  if (!modalData) return null;

  const { tipo, detalles } = modalData;
  const { nombre, fecha, cantidad, pases, compraId, montoTotal } = detalles;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="font-sans max-w-md w-full mx-4 bg-white border border-green-200 rounded-lg overflow-hidden">
        <div className="bg-green-100 p-5 text-center">
          <h1 className="text-green-600 text-2xl font-bold">EcoHarmonyPark</h1>
          <p className="text-black">
            {tipo === 'efectivo' ? 'Reserva pendiente de pago' : `¡Gracias por tu compra, ${nombre}!`}
          </p>
        </div>

        <div className="p-5 bg-white">
          <h2 className="text-green-600 text-xl font-bold mb-3">
            {tipo === 'efectivo' ? 'Tu reserva ha sido registrada' : 'Confirmación de Compra'}
          </h2>
          <p className="text-black mb-3">
            {tipo === 'efectivo'
              ? `Hola ${nombre}, hemos registrado tu reserva. Para confirmar tu compra, recordá realizar el pago en efectivo.`
              : 'Hemos registrado tu compra de entradas para EcoHarmonyPark. Aquí están los detalles:'}
          </p>
          <table className="w-full bg-gray-100 rounded-md text-sm">
            <tbody>
              <tr>
                <td className="p-2 font-bold text-black">Código de Reserva:</td>
                <td className="p-2 text-green-600">{compraId}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-black">Fecha de Visita:</td>
                <td className="p-2 text-black">{fecha}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-black">Cantidad de Entradas:</td>
                <td className="p-2 text-black">{cantidad}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-black">Tipo de Pases:</td>
                <td className="p-2 text-black">{pases.join(', ')}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-black">Monto Total:</td>
                <td className="p-2 text-black">${montoTotal}</td>
              </tr>
            </tbody>
          </table>
          {tipo === 'tarjeta' && (
            <p className="text-black mt-3">Las entradas han sido enviadas a tu correo electrónico.</p>
          )}
        </div>

        <div className="bg-green-100 p-4 text-center">
          <p className="text-black text-sm">
            {tipo === 'efectivo'
              ? '¡Esperamos poder verte pronto en EcoHarmonyPark! 🌿'
              : '¡Te esperamos en EcoHarmonyPark! 🌳'}
          </p>
          <p className="text-black text-xs">Consultas: iswgrupo@gmail.com</p>
        </div>

        <div className="p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCompra;