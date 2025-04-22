const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { enviarCorreoGmail } = require('./sendMails.js');
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

  const compraId = uuidv4();

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
      const compraId = uuidv4();
      comprasTemporales.set(compraId, {
        fecha: fechaVisita,
        cantidad: cantidadNumerica,
        pases,
        edades,
        email: usuarioLogueado.email,
        nombre: usuarioLogueado.nombre,
        compraId: compraId,
      });
  
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
          default_payment_method_id: 'credit_card',
          payment_methods: {
            excluded_payment_types: [
              { id: 'debit_card' }, // Excluye tarjeta de débito
              // { id: 'account_money' }, // Excluye dinero en cuenta de Mercado Pago
              { id: 'ticket' }, // Excluye pagos en efectivo (ej. boleto, Rapipago)
              { id: 'bank_transfer' }, // Excluye transferencias bancarias
              { id: 'atm' }, // Excluye pagos en cajeros automáticos
              { id: 'prepaid_card' }, // Excluye tarjetas prepagas
            ],
            // Opcional: especificar que solo se acepten tarjetas de crédito
            
            // Opcional: limitar el número de cuotas (ejemplo: máximo 12 cuotas)
            installments: 12,
          },
        },
      });
  
      return res.json({ redireccion: true, url: result.init_point });
    } catch (err) {
      console.error('Error creando preferencia:', err);
      return res.status(500).json({ mensaje: 'Error al crear la preferencia de pago.' });
    }
  }

  if (formaPago === 'efectivo') {
    try {
      // Enviar el correo con los detalles de la compra
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

      // Formatear la fecha y respuesta
      const fechaFormateada = fechaVisita.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Responder con un objeto estructurado
      return res.json({
        mensaje: `Debes realizar el pago de la/s entrada/s en efectivo (revisa tu direccion de mail). Para el ${fechaFormateada} - ${cantidadNumerica} entradas.`,
        compraId: compraId,
        fecha: fechaFormateada,  // Devolvemos la fecha formateada
        cantidad: cantidadNumerica,  // Devolvemos la cantidad de entradas
      });
    } catch (err) {
      console.error('Error enviando correo:', err);
      return res.status(500).json({ mensaje: 'Compra realizada, pero hubo un error al enviar el correo.' });
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

      await enviarCorreoGmail(
        datosCompra.email,
        '🎟️ ¡Gracias por tu compra!',
        datosCompra,
        'tarjeta'
      );

      // Redirigir incluyendo el compraId para que el frontend lo use
      res.redirect(`http://localhost:5173/?confirmado=true&compraId=${compraId}`);
    } catch (err) {
      console.error('Error al enviar el correo:', err);
      res.send('<h1>✅ Pago aprobado, pero hubo un problema al enviar el correo.</h1>');
    }
  } else {
    res.send('<h1>⚠️ No se pudo confirmar el estado del pago.</h1>');
  }
});


// Nuevo endpoint para obtener los datos de la compra
app.get('/api/compra/:compraId', (req, res) => {
  const { compraId } = req.params;
  const datosCompra = comprasTemporales.get(compraId);

  if (!datosCompra) {
    return res.status(404).json({ mensaje: 'Compra no encontrada' });
  }

  res.json(datosCompra);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
