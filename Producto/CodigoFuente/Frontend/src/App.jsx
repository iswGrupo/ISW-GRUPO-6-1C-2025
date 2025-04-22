import './App.css'
import FormCompra from './components/FormCompra';
import NavBar from './components/Navbar';
import { useEffect, useState } from 'react';

// Componente ConfirmacionCompra
function ConfirmacionCompra() {
  const [resultado, setResultado] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compraId = params.get('compraId');
    const confirmado = params.get('confirmado');
    
    if (compraId && confirmado === 'true') {
      // Fetch de la compra desde el backend
      fetch(`/api/compra/${compraId}`)
        .then(response => response.json())
        .then(data => {
          setResultado(`Compra realizada para el ${new Date(data.fecha).toLocaleDateString()} - ${data.cantidad} entradas.`);
        })
        .catch(error => {
          console.error('Error al obtener los datos de la compra:', error);
          setResultado('Hubo un problema al obtener los datos de la compra.');
        });
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {resultado ? (
        <p>{resultado}</p>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <FormCompra />
      </div>
      {/* Verificamos si estamos en la página de confirmación */}
      {window.location.pathname === '/success' && <ConfirmacionCompra />}
    </>
  );
}

export default App;
