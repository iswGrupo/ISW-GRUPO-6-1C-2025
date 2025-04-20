function Resultado({ mensaje }) {
    return (
      <p className={`mt-4 text-center text-sm ${mensaje.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
        {mensaje}
      </p>
    );
  }
  
  export default Resultado;