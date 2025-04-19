function Resultado({ mensaje }) {
  return mensaje ? (
    <div className="mt-6 p-4 rounded bg-gray-100 text-center font-semibold text-lg">
      {mensaje}
    </div>
  ) : null;
}

export default Resultado;
