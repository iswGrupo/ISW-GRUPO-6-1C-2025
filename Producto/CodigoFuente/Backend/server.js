const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { enviarCorreoGmail } = require('./sendMails.js'); // Cambia a enviarCorreoGmail
const { MercadoPagoConfig, Preference } = require('mercadopago');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(bodyParser.json());
app.use(express.static('public'));

const diasAbiertos = [0, 1, 3, 5, 6]; 

let usuarioLogueado = { email: 'iswgrupo@gmail.com', nombre: 'Juan Pérez' };
const comprasTemporales = new Map();

const client = new MercadoPagoConfig({
  accessToken: 'TEST-320555961029794-041718-65b747ee2fd431edefa094b63df8fe7e-188122401',
});

app.post('/api/comprar', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { fecha, cantidad, edades, pases, formaPago } = req.body;

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

  const cantidadNumerica = parseInt(cantidad);
  if (isNaN(cantidadNumerica) || cantidadNumerica > 10 || cantidadNumerica < 1) {
    console.log('Error: Cantidad inválida');
    return res.status(400).json({ mensaje: 'Máximo 10 entradas.' });
  }

  if (!formaPago) {
    console.log('Error: Forma de pago no especificada');
    return res.status(400).json({ mensaje: 'Seleccione forma de pago.' });
  }

  const compraId = uuidv4(); // Generar compraId

  // Guardar la compra en la variable temporal
  comprasTemporales.set(compraId, {
    fecha: fechaVisita,
    cantidad: cantidadNumerica,
    pases,
    edades,
    email: usuarioLogueado.email,
    nombre: usuarioLogueado.nombre,
    compraId: compraId,
  });

  if (formaPago === 'tarjeta') {
    try {
      const preference = new Preference(client);
      const items = pases.map((pase) => ({
        title: `Entrada al parque (${pase.toUpperCase()})`,
        quantity: 1,
        unit_price: pase === 'vip' ? 1500 : 1000,
      }));

      const result = await preference.create({
        body: {
          items,
          back_urls: {
            success: `http://localhost:3000/success?compraId=${compraId}`,
            failure: 'http://localhost:3000/fallo',
            pending: 'http://localhost:3000/pendiente',
          },
          auto_return: 'approved',
          payer: { email: usuarioLogueado.email },
        },
      });

      // Después de crear la preferencia, devolver la URL para que el usuario pague
      return res.json({ redireccion: true, url: result.init_point });
    } catch (err) {
      console.error('Error creando preferencia:', err);
      return res.status(500).json({ mensaje: 'Error al crear la preferencia de pago.' });
    }
  }

  if (formaPago === 'efectivo') {
    try {
      // Si el pago es en efectivo, enviar el correo con el QR
      await enviarCorreoGmail(
        usuarioLogueado.email,
        '🎟️ ¡Gracias por tu compra!',
        {
          nombre: usuarioLogueado.nombre,
          fecha: fechaVisita,
          cantidad: cantidadNumerica,
          pases,
          compraId: compraId,
        },
        'efectivo'
      );
      res.json({ mensaje: `Compra realizada para el ${fecha} - ${cantidadNumerica} entradas.` });
    } catch (err) {
      console.error('Error enviando correo:', err);
      res.status(500).json({ mensaje: 'Compra realizada, pero hubo un error al enviar el correo.' });
    }
  }
});

app.get('/success', async (req, res) => {
  const { status, compraId } = req.query;

  if (status === 'approved') {
    try {
      const datosCompra = comprasTemporales.get(compraId);
      if (!datosCompra) {
        console.error('Compra no encontrada para compraId:', compraId);
        return res.send('<h1>⚠️ Compra no encontrada.</h1>');
      }

      // Enviar el correo solo si el pago fue aprobado
      await enviarCorreoGmail(
        datosCompra.email, // usuario1@gmail.com
        '🎟️ ¡Gracias por tu compra!',
        datosCompra,
        'tarjeta' // Aseguramos que el QR sea enviado en este caso
      );

      comprasTemporales.delete(compraId);
      res.redirect('http://localhost:5173/?confirmado=true');
    } catch (err) {
      console.error('Error al enviar el correo:', err);
      res.send('<h1>✅ Pago aprobado, pero hubo un problema al enviar el correo.</h1>');
    }
  } else {
    res.send('<h1>⚠️ No se pudo confirmar el estado del pago.</h1>');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
