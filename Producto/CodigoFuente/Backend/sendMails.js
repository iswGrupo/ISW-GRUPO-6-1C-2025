const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');

async function enviarCorreoGmail(destinatario, asunto, datosCompra) {
  const { nombre, fecha, cantidad, pases, compraId } = datosCompra;




  
  // Configura el transporter con Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'iswgrupo@gmail.com', // Reemplaza con tu cuenta de Gmail de prueba
      pass: 'ryyr rvdl fivv dgbl', // Reemplaza con la contraseña hardcodeada
    },
    tls: {
      rejectUnauthorized: false, // Ignora errores de certificado (solo para pruebas)
    },
  });

// Formatear la fecha como YYYY-MM-DD
const fechaFormateada = new Date(fecha).toISOString().split('T')[0];

// Generar el código QR con un texto más simple
const textoQR = `Entrada Parque - Nombre: ${nombre} | Fecha: ${fechaFormateada} | Entradas: ${cantidad} | Pases: ${pases.join(', ')} | Código de Reserva: ${compraId}`;
let qrBase64;
try {
  qrBase64 = await QRCode.toDataURL(textoQR, { width: 200 });
  console.log('QR Base64 generado:', qrBase64.substring(0, 50) + '...');
} catch (err) {
  console.error('Error generando el QR:', err);
  qrBase64 = '';
}
  // Generar el QR como archivo
  const qrFilePath = `qr-${compraId}.png`;
  await QRCode.toFile(qrFilePath, textoQR, { width: 200 });
  
  // Diseño del correo
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E6F0E6; border-radius: 10px; overflow: hidden;">
      <!-- Encabezado -->
      <div style="background-color: #E6F0E6; padding: 20px; text-align: center;">
        <h1 style="color: #4CAF50; margin: 0; font-size: 24px;">EcoHarmonyPark</h1>
        <p style="color: #000000; margin: 5px 0 0;">¡Gracias por tu compra, ${nombre}!</p>
      </div>

      <!-- Cuerpo -->
      <div style="padding: 20px; background-color: #FFFFFF;">
        <h2 style="color: #4CAF50; font-size: 20px; margin-bottom: 15px;">Confirmación de Compra</h2>
        <p style="color: #000000; margin-bottom: 10px;">Hemos registrado tu compra de entradas para EcoHarmonyPark. Aquí están los detalles:</p>

        <!-- Detalles de la compra -->
        <table style="width: 100%; border-collapse: collapse; background-color: #F5F5F5; border-radius: 5px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #000000;">Código de Reserva:</td>
            <td style="padding: 10px; color: #4CAF50;">${compraId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #000000;">Fecha de Visita:</td>
            <td style="padding: 10px; color: #000000;">${fechaFormateada}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #000000;">Cantidad de Entradas:</td>
            <td style="padding: 10px; color: #000000;">${cantidad}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #000000;">Tipo de Pases:</td>
            <td style="padding: 10px; color: #000000;">${pases.join(', ')}</td>
          </tr>
        </table>

    <div style="text-align: center; margin-bottom: 20px;">
        <p style="color: #000000; margin-bottom: 10px;">Muestra este código QR al ingresar al parque (adjunto como archivo):</p>
    </div>
      </div>

      <!-- Pie de página -->
      <div style="background-color: #E6F0E6; padding: 15px; text-align: center;">
        <p style="color: #000000; margin: 0; font-size: 14px;">¡Te esperamos en EcoHarmonyPark! 🌳</p>
        <p style="color: #000000; margin: 5px 0 0; font-size: 12px;">Si tienes alguna pregunta, contáctanos en iswgrupo@gmail.com</p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: '"EcoHarmonyPark 🌳" <iswgrupo@gmail.com>',
    to: destinatario,
    subject: asunto,
    html: html,
    attachments: [
        {
          filename: 'codigo-qr.png',
          path: qrFilePath,
        },
      ],
  });
  fs.unlinkSync(qrFilePath);
  console.log('Correo enviado con éxito. ID del mensaje:', info.messageId);
}

module.exports = { enviarCorreoGmail };