import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Resultado from './Resultado';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function FormCompra() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [resultado, setResultado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [alertaCantidad, setAlertaCantidad] = useState('');

  const cantidad = parseInt(watch('cantidad')) || 0;

  // ✅ Efecto para detectar redirección desde Mercado Pago
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
          
          setResultado(`Compra realizada para el ${fechaFormateada} - ${datosCompra.cantidad} entradas. (Tus entradas han sido enviadas a tu direccion de mail)`);
        })
        .catch((error) => {
          console.error('Error al obtener la compra:', error);
          setResultado('Error al recuperar la compra.');
        });
    }
  }, []);

  const handleFechaChange = (date) => {
    if (date >= new Date()) {
      setFechaSeleccionada(date);
    }
  };

  const onSubmit = async (data) => {
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
        setResultado(res.data.mensaje);
      }
    } catch (err) {
      console.error(err);
      setResultado('Error en la compra.');
    }
  };

  return (
    <div className="compra w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Comprar Entradas</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Columna 1: Fecha y Calendario */}
        <div>
          <label className="block font-semibold mb-2">Fecha de visita:</label>
          <Calendar
            onChange={handleFechaChange}
            value={fechaSeleccionada}
            className="rounded-lg shadow-sm w-full"
            minDate={new Date()}
            tileDisabled={({ date }) => {
              const day = date.getDay();
              return day === 2 || day === 4; // Deshabilitar martes y jueves
            }}
          />
          {/* Mensaje fijo debajo del calendario */}
          <p className="text-sm text-gray-600 mt-2">
            El parque está cerrado los días martes y jueves. No puedes comprar entradas para esos días.
          </p>
        </div>

        {/* Columna 2: Formulario */}
        <div className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Cantidad de entradas:</label>
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
                <label className="block font-semibold mb-1">Edad del visitante {i + 1}:</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  {...register(`edad-${i + 1}`, {
                    required: 'La edad es obligatoria',
                    min: { value: 0, message: 'Edad no válida' },
                    max: { value: 120, message: 'Edad no válida' }
                  })}
                  className="w-full border rounded px-3 py-2"
                />
                {errors[`edad-${i + 1}`] && (
                  <p className="text-red-600 text-sm">{errors[`edad-${i + 1}`].message}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Tipo de pase:</label>
                <select
                  {...register(`pase-${i + 1}`, { required: 'El pase es obligatorio' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
                {errors[`pase-${i + 1}`] && (
                  <p className="text-red-600 text-sm">{errors[`pase-${i + 1}`].message}</p>
                )}
              </div>
            </div>
          ))}

          <div>
            <label className="block font-semibold mb-1">Forma de pago:</label>
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
            className="boton1 w-full bg-blue-600 text-white font-semibold py-2 rounded"
          >
            Comprar
          </button>
        </div>
      </form>

      <Resultado mensaje={resultado} />
    </div>
  );
}

export default FormCompra;
