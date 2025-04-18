const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { enviarCorreoEthereal } = require('./sendMails');
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

let usuarioLogueado = { email: "Iswgrupo@gmail.com", nombre: "Juan Pérez" };


// Configurar Mercado Pago (nuevo SDK v2)
const client = new MercadoPagoConfig({
  accessToken: "TEST-320555961029794-041718-65b747ee2fd431edefa094b63df8fe7e-188122401",
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
            success: `http://localhost:3000/success?fecha=${fechaVisita}&cantidad=${cantidadNumerica}&pase=${pase.toUpperCase()}`,
            failure: 'http://localhost:3000/fallo',
            pending: 'http://localhost:3000/pendiente',
          },
          
          auto_return: 'approved',
          payer:{email: usuarioLogueado.email},
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

app.get("/success", async (req, res) => {
  const { status, payment_id, fecha, cantidad, pase } = req.query;

  if (status === "approved") {
    try {
      const datosCompra = {
        nombre: usuarioLogueado.nombre,
        email: usuarioLogueado.email,
        fecha: new Date(fecha),
        cantidad: parseInt(cantidad),
        pase: pase,
      };

      await enviarCorreoEthereal(
        datosCompra.email,
        '🎟️ ¡Gracias por tu compra!',
        datosCompra
      );
      res.redirect("http://localhost:5173/?confirmado=true");
    } catch (err) {
      console.error("Error al enviar el correo:", err);
      res.send("<h1>✅ Pago aprobado, pero hubo un problema al enviar el correo.</h1>");
    }
  } else {
    res.send("<h1>⚠️ No se pudo confirmar el estado del pago.</h1>");
  }
});


// ruta: POST /api/enviar-correo

app.post('/api/enviar-correo', async (req, res) => {
  const { email, paymentId } = req.body;

  try {
    // (opcional) podés usar paymentId para validar con MercadoPago
    await enviarCorreoEthereal(
      email,
      '🎟️ ¡Gracias por tu compra!',
      'Tu entrada fue procesada exitosamente. ¡Nos vemos en el parque!'
    );
    res.status(200).json({ mensaje: 'Correo enviado correctamente' });
  } catch (err) {
    console.error('Error enviando correo:', err);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});