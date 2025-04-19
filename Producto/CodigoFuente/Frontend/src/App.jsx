
import './App.css'
import FormCompra from './components/FormCompra';
import NavBar from './components/Navbar';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// serviceWorkerRegistration.register();
function App() {
  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <FormCompra />
    </div>
    </>
  );
  
}

export default App;