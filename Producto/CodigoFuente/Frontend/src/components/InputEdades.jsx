function InputEdades({ cantidad, register, errors }) {
    return (
      <div className="space-y-2">
        {Array.from({ length: cantidad || 0 }).map((_, i) => (
          <div key={i}>
            <label className="block font-semibold">Edad del visitante {i + 1}:</label>
            <input
              type="number"
              min="0"
              {...register(`edad-${i + 1}`, {
                required: 'La edad es obligatoria',
                min: { value: 0, message: 'La edad no puede ser negativa' },
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors[`edad-${i + 1}`] && (
              <p className="text-red-600 text-sm">{errors[`edad-${i + 1}`].message}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  export default InputEdades;