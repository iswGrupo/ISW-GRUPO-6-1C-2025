import { useFormContext } from 'react-hook-form';

function InputEdades({ cantidad }) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <>
      {Array.from({ length: cantidad }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Edad */}
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

          {/* Pase */}
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
    </>
  );
}

export default InputEdades;
