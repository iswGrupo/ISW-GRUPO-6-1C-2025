const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');

async function enviarCorreoGmail(destinatario, asunto, datosCompra, formaPago) {
  const { nombre, fecha, cantidad, pases, compraId, montoTotal } = datosCompra;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iswgrupo@gmail.com',
      pass: 'ryyr rvdl fivv dgbl',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const fechaFormateada = new Date(fecha).toISOString().split('T')[0];

  let qrFilePath = '';
  let html = '';

  if (formaPago === 'tarjeta') {
    const textoQR = `Entrada Parque - Nombre: ${nombre} | Fecha: ${fechaFormateada} | Entradas: ${cantidad} | Pases: ${pases.join(', ')} | Código de Reserva: ${compraId}`;
    try {
      await QRCode.toFile(`qr-${compraId}.png`, textoQR, { width: 200 });
      qrFilePath = `qr-${compraId}.png`;
    } catch (err) {
      console.error('Error generando el QR:', err);
    }

    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E6F0E6; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #E6F0E6; padding: 20px; text-align: center;">
          <h1 style="color: #4CAF50; margin: 0; font-size: 24px;">EcoHarmonyPark</h1>
          <p style="color: #000000; margin: 5px 0 0;">¡Gracias por tu compra, ${nombre}!</p>
        </div>
        <div style="padding: 20px; background-color: #FFFFFF;">
          <h2 style="color: #4CAF50; font-size: 20px; margin-bottom: 15px;">Confirmación de Compra</h2>
          <p style="color: #000000; margin-bottom: 10px;">Hemos registrado tu compra de entradas para EcoHarmonyPark. Aquí están los detalles:</p>
          <table style="width: 100%; border-collapse: collapse; background-color: #F5F5F5; border-radius: 5px; margin-bottom: 20px;">
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Código de Reserva:</td><td style="padding: 10px; color: #4CAF50;">${compraId}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Fecha de Visita:</td><td style="padding: 10px; color: #000000;">${fechaFormateada}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Cantidad de Entradas:</td><td style="padding: 10px; color: #000000;">${cantidad}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Tipo de Pases:</td><td style="padding: 10px; color: #000000;">${pases.join(', ')}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Monto Total:</td><td style="padding: 10px; color: #000000;">$${montoTotal}</td></tr>
          </table>
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #000000; margin-bottom: 10px;">Muestra este código QR al ingresar al parque (adjunto como archivo):</p>
          </div>
        </div>
        <div style="background-color: #E6F0E6; padding: 15px; text-align: center;">
          <p style="color: #000000; margin: 0; font-size: 14px;">¡Te esperamos en EcoHarmonyPark! 🌳</p>
          <p style="color: #000000; margin: 5px 0 0; font-size: 12px;">Si tienes alguna pregunta, contáctanos en iswgrupo@gmail.com</p>
        </div>
      </div>
    `;
  } else {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E6F0E6; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #E6F0E6; padding: 20px; text-align: center;">
          <h1 style="color: #4CAF50; margin: 0; font-size: 24px;">EcoHarmonyPark</h1>
          <p style="color: #000000; margin: 5px 0 0;">Reserva pendiente de pago</p>
        </div>
        <div style="padding: 20px; background-color: #FFFFFF;">
          <h2 style="color: #4CAF50; font-size: 20px; margin-bottom: 15px;">Tu reserva ha sido registrada</h2>
          <p style="color: #000000; margin-bottom: 10px;">Hola ${nombre}, hemos registrado tu reserva para EcoHarmonyPark. Para confirmar tu compra, recordá realizar el pago en efectivo.</p>
          <table style="width: 100%; border-collapse: collapse; background-color: #F5F5F5; border-radius: 5px; margin: 20px 0;">
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Código de Reserva:</td><td style="padding: 10px; color: #4CAF50;">${compraId}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Fecha de Visita:</td><td style="padding: 10px; color: #000000;">${fechaFormateada}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Cantidad de Entradas:</td><td style="padding: 10px; color: #000000;">${cantidad}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Tipo de Pases:</td><td style="padding: 10px; color: #000000;">${pases.join(', ')}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #000000;">Monto Total:</td><td style="padding: 10px; color: #000000;">$${montoTotal}</td></tr>
          </table>
        </div>
        <div style="background-color: #E6F0E6; padding: 15px; text-align: center;">
          <p style="color: #000000; margin: 0; font-size: 14px;">¡Esperamos poder verte pronto en EcoHarmonyPark! 🌿</p>
          <p style="color: #000000; margin: 5px 0 0; font-size: 12px;">Consultas: iswgrupo@gmail.com</p>
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: '"EcoHarmonyPark 🌳" <iswgrupo@gmail.com>',
    to: destinatario,
    subject: asunto,
    html: html,
  };

  if (qrFilePath) {
    mailOptions.attachments = [
      {
        filename: 'codigo-qr.png',
        path: qrFilePath,
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito. ID del mensaje:', info.messageId);

    if (qrFilePath) {
      fs.unlinkSync(qrFilePath);
    }
  } catch (error) {
    console.error('Error enviando el correo:', error);
  }
}

module.exports = { enviarCorreoGmail };