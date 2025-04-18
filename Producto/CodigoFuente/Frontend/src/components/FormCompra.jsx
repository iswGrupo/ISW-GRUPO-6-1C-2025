import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import InputEdades from './InputEdades';
import Resultado from './Resultado';





function FormCompra() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [resultado, setResultado] = useState('');
  const cantidad = watch('cantidad', 1);


  const onSubmit = async (data) => {
    try {
      const edades = Array.from({ length: data.cantidad }, (_, i) => parseInt(data[`edad-${i + 1}`]));
      const payload = { ...data, edades };
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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Comprar Entradas</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Fecha de visita:</label>
          <input
            type="date"
            {...register('fecha', { required: 'La fecha es obligatoria' })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.fecha && <p className="text-red-600 text-sm">{errors.fecha.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Cantidad de entradas:</label>
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
        <InputEdades cantidad={cantidad} register={register} errors={errors} />
        <div>
          <label className="block font-semibold mb-1">Tipo de pase:</label>
          <select
            {...register('pase', { required: 'El pase es obligatorio' })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
          </select>
          {errors.pase && <p className="text-red-600 text-sm">{errors.pase.message}</p>}
        </div>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Comprar
        </button>
      </form>
      <Resultado mensaje={resultado} />
    </div>
  );
}

export default FormCompra;