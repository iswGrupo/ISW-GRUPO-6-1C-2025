import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import Resultado from './Resultado';
import InputEdades from './InputEdades';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function FormCompra() {
  const methods = useForm();
  const { register, handleSubmit, watch, formState: { errors } } = methods;
  const [resultado, setResultado] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const cantidad = parseInt(watch('cantidad')) || 0;

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
        ...data,
        fecha: fechaSeleccionada,
        edades,
        pases,
      };

      const res = await axios.post('http://localhost:3000/api/comprar', payload);
      if (res.data.redireccion) {
        window.location.href = res.data.url;
      } else {
        setResultado(res.data.mensaje);
      }
    } catch (err) {
      setResultado('Error en la compra.');
    }
  };

  return (
    <div className="compra w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Comprar Entradas</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Fecha y Calendario */}
          <div>
            <label className="block font-semibold mb-2">Fecha de visita:</label>
            <Calendar
              onChange={handleFechaChange}
              value={fechaSeleccionada}
              className="rounded-lg shadow-sm w-full"
              minDate={new Date()}
            />
            {errors.fecha && <p className="text-red-600 text-sm">{errors.fecha.message}</p>}
          </div>

          {/* Columna 2: Resto del formulario */}
          <div className="space-y-4">
            {/* Cantidad */}
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
                className="w-full border rounded px-3 py-2"
              />
              {errors.cantidad && <p className="text-red-600 text-sm">{errors.cantidad.message}</p>}
            </div>

            {/* Edades y Pases separados en componente */}
            <InputEdades cantidad={cantidad} />

            {/* Forma de pago */}
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

            {/* Botón */}
            <button
              type="submit"
              className="boton1 w-full bg-blue-600 text-white font-semibold py-2 rounded"
            >
              Comprar
            </button>
          </div>
        </form>
      </FormProvider>
      <Resultado mensaje={resultado} />
    </div>
  );
}

export default FormCompra;
