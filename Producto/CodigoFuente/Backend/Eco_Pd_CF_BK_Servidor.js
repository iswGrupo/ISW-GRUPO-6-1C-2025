const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors({
  origin: 'http://localhost:5173', // O usa '*' para permitir todos los orígenes (no recomendado en producción)
}));


app.use(bodyParser.json());
app.use(express.static("public"));

const diasAbiertos = [1, 2, 3, 4, 5, 6]; // Lunes a sábado

let usuarioLogueado = { email: "visitante@ejemplo.com", nombre: "Juan Pérez" };

// Configurar Mercado Pago (nuevo SDK v2)
const client = new MercadoPagoConfig({
  accessToken: "TEST-1399705984482971-040823-b6f3e477a8943648cd30afcf80953188-154546270",
});

app.post('/api/comprar', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { fecha, cantidad, edades, pase, formaPago } = req.body;

  if (!usuarioLogueado) {
    console.log('Error: Usuario no autenticado');
    return res.status(403).json({ mensaje: 'Usuario no autenticado.' });
  }

  const fechaVisita = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fechaVisita < hoy) {
    console.log('Error: Fecha inválida');
    return res.status(400).json({ mensaje: 'La fecha debe ser hoy o futura.' });
  }

  if (!diasAbiertos.includes(fechaVisita.getDay())) {
    console.log('Error: Día cerrado');
    return res.status(400).json({ mensaje: 'El parque está cerrado ese día.' });
  }

  // Convertir cantidad a número entero
  const cantidadNumerica = parseInt(cantidad);
  if (isNaN(cantidadNumerica) || cantidadNumerica > 10 || cantidadNumerica < 1) {
    console.log('Error: Cantidad inválida');
    return res.status(400).json({ mensaje: 'Máximo 10 entradas.' });
  }

  if (!formaPago) {
    console.log('Error: Forma de pago no especificada');
    return res.status(400).json({ mensaje: 'Seleccione forma de pago.' });
  }

  // Simulación de envío de correo
  console.log(`[MAIL] Enviado a ${usuarioLogueado.email}: Compra confirmada para el ${fecha} - ${cantidadNumerica} entradas.`);

  if (formaPago === 'tarjeta') {
    try {
      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [
            {
              title: `Entrada al parque (${pase.toUpperCase()})`,
              quantity: cantidadNumerica, // Usar la versión numérica
              unit_price: 1000,
            },
          ],
          back_urls: {
            success: 'http://localhost:3000/confirmacion',
            failure: 'http://localhost:3000/fallo',
            pending: 'http://localhost:3000/pendiente',
          },
          auto_return: 'approved',
        },
      });
      return res.json({ redireccion: true, url: result.init_point });
    } catch (err) {
      console.error('Error creando preferencia:', err);
      return res.status(500).json({ mensaje: 'Error al crear la preferencia de pago.' });
    }
  }

  res.json({ mensaje: `Compra realizada para el ${fecha} - ${cantidadNumerica} entradas.` });
});

app.get("/confirmacion", (req, res) => {
  res.send("<h1>✅ ¡Pago aprobado! Gracias por tu compra.</h1>");
});

app.get("/fallo", (req, res) => {
  res.send("<h1>❌ Hubo un error con el pago.</h1>");
});

app.get("/pendiente", (req, res) => {
  res.send("<h1>⏳ Tu pago está pendiente de aprobación.</h1>");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});