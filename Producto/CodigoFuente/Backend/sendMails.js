const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

async function enviarCorreoEthereal(destinatario, asunto, datosCompra) 
{
    const { nombre, fecha, cantidad, pase } = datosCompra;
    let testAccount = await nodemailer.createTestAccount();

    // Configura el transporter con las credenciales de prueba
    let transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
        user: testAccount.user,
        pass: testAccount.pass
        }
    })

    const textoQR = `Entrada Parque - Nombre: ${nombre} | Fecha: ${fecha} | Entradas: ${cantidad} | Pase: ${pase}`;
    const qrBase64 = await QRCode.toDataURL(textoQR);

    const html = `
        <div style="font-family: sans-serif;">
        <h2>🎉 ¡Gracias por tu compra, ${nombre}!</h2>
        <p>Detalles de tu entrada:</p>
        <ul>
            <li><strong>Fecha:</strong> ${fecha}</li>
            <li><strong>Cantidad:</strong> ${cantidad}</li>
            <li><strong>Pase:</strong> ${pase}</li>
        </ul>
        <p>Mostrá este código QR al ingresar al parque:</p>
        <img src="${qrBase64}" alt="Código QR" />
        <p>¡Te esperamos! 🌳</p>
        </div>
    `;

    const info = await transporter.sendMail({
        from: '"Parque ISW 👋" <parque@isw.com>',
        to: destinatario,
        subject: asunto,
        html: html,
    });

    console.log("Correo enviado:", nodemailer.getTestMessageUrl(info));
    console.log('Ver en:', nodemailer.getTestMessageUrl(info));
}

module.exports = { enviarCorreoEthereal };