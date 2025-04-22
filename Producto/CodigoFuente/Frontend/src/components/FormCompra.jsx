import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ModalCompra from './ModalCompra';

function FormCompra() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [modalData, setModalData] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [alertaCantidad, setAlertaCantidad] = useState('');
  const [errorFecha, setErrorFecha] = useState('');

  const cantidad = parseInt(watch('cantidad')) || 0;
  const pases = Array.from({ length: cantidad }, (_, i) => watch(`pase-${i + 1}`) || 'regular');
  const montoTotal = pases.reduce((total, pase) => total + (pase === 'vip' ? 1500 : 1000), 0);

  const usuario = { nombre: 'Juan Pérez' };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const compraId = queryParams.get('compraId');

    if (compraId) {
      axios.get(`http://localhost:3000/api/compra/${compraId}`)
        .then((response) => {
          const datosCompra = response.data;
          const fechaFormateada = new Date(datosCompra.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          setModalData({
            tipo: 'tarjeta',
            detalles: {
              ...datosCompra,
              fecha: fechaFormateada,
            },
          });
        })
        .catch((error) => {
          console.error('Error al obtener la compra:', error);
          setModalData({
            tipo: 'error',
            detalles: { mensaje: 'Error al recuperar la compra.' },
          });
        });
    }
  }, []);

  const handleFechaChange = (date) => {
    if (date >= new Date()) {
      setFechaSeleccionada(date);
      const day = date.getDay();
      if (day === 2 || day === 4) {
        setErrorFecha('Seleccione una fecha válida. El parque está cerrado los martes y jueves.');
      } else {
        setErrorFecha('');
      }
    }
  };

  const onSubmit = async (data) => {
    const day = fechaSeleccionada.getDay();
    if (day === 2 || day === 4) {
      setErrorFecha('Seleccione una fecha válida. El parque está cerrado los martes y jueves.');
      return;
    }

    try {
      const edades = Array.from({ length: data.cantidad }, (_, i) => parseInt(data[`edad-${i + 1}`]));
      const pases = Array.from({ length: data.cantidad }, (_, i) => data[`pase-${i + 1}`]);

      const payload = {
        fecha: fechaSeleccionada,
        cantidad: data.cantidad,
        edades,
        pases,
        formaPago: data.formaPago,
      };

      const res = await axios.post('http://localhost:3000/api/comprar', payload);

      if (res.data.url) {
        localStorage.setItem('compraEnProceso', 'true');
        window.location.href = res.data.url;
      } else {
        // Usar res.data.fecha directamente ya que ya está formateada
        setModalData({
          tipo: 'efectivo',
          detalles: {
            nombre: usuario.nombre,
            fecha: res.data.fecha, // No intentar convertir a Date
            cantidad: res.data.cantidad,
            pases,
            compraId: res.data.compraId,
            montoTotal: res.data.montoTotal,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setModalData({
        tipo: 'error',
        detalles: { mensaje: 'Error en la compra.' },
      });
    }
  };

  return (
    <div className="compra w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Comprar Entradas</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2 text-black">Fecha de visita:</label>
          <Calendar
            onChange={handleFechaChange}
            value={fechaSeleccionada}
            className="rounded-lg shadow-sm w-full"
            minDate={new Date()}
            tileDisabled={({ date }) => {
              const day = date.getDay();
              return day === 2 || day === 4;
            }}
          />
          <p className="text-sm text-gray-600 mt-2">
            El parque está cerrado los días martes y jueves. No puedes comprar entradas para esos días.
          </p>
          {errorFecha && <p className="text-red-600 text-sm mt-2">{errorFecha}</p>}
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold block mb-1 text-black">Cantidad de entradas:</label>
            <input
              type="number"
              min="1"
              max="10"
              {...register('cantidad', {
                required: 'La cantidad es obligatoria',
                min: { value: 1, message: 'Mínimo 1 entrada' },
                max: { value: 10, message: 'Máximo 10 entradas' },
              })}
              onInput={(e) => {
                const value = parseInt(e.target.value);
                if (value > 10) {
                  e.target.value = 10;
                  setAlertaCantidad('Máximo permitido: 10 entradas');
                } else if (value < 1) {
                  e.target.value = 1;
                  setAlertaCantidad('Mínimo permitido: 1 entrada');
                } else {
                  setAlertaCantidad('');
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
            {alertaCantidad && <p className="text-yellow-600 text-sm">{alertaCantidad}</p>}
            {errors.cantidad && <p className="text-red-600 text-sm">{errors.cantidad.message}</p>}
          </div>

          {Array.from({ length: cantidad }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-black">Edad del visitante {i + 1}:</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  {...register(`edad-${i + 1}`, {
                    required: 'La edad es obligatoria',
                    min: { value: 0, message: 'Edad no válida' },
                    max: { value: 120, message: 'Edad no válida' },
                  })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors[`edad-${i + 1}`] && (
                  <p className="text-red-600 text-sm">{errors[`edad-${i + 1}`].message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-black">Tipo de pase:</label>
                <select
                  {...register(`pase-${i + 1}`, { required: 'El pase es obligatorio' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="regular">Regular ($1000)</option>
                  <option value="vip">VIP ($1500)</option>
                </select>
                {errors[`pase-${i + 1}`] && (
                  <p className="text-red-600 text-sm">{errors[`pase-${i + 1}`].message}</p>
                )}
              </div>
            </div>
          ))}

          {cantidad > 0 && (
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">
                Monto Total: ${montoTotal}
              </p>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1 text-black">Forma de pago:</label>
            <select
              {...register('formaPago', { required: 'Seleccione forma de pago' })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Seleccione</option>
              <option value="efectivo">Efectivo en boletería</option>
              <option value="tarjeta">Tarjeta (Mercado Pago)</option>
            </select>
            {errors.formaPago && <p className="text-red-600 text-sm">{errors.formaPago.message}</p>}
          </div>

          <button
            type="submit"
            disabled={errorFecha}
            className={`boton1 w-full text-white font-semibold py-2 rounded transition ${
              errorFecha ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Comprar
          </button>
        </div>
      </form>

      <ModalCompra modalData={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}

export default FormCompra;