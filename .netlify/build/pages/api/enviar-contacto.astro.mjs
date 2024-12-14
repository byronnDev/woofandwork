import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const env = {
  emailFrom: "onboarding@resend.dev",
  emailTo: "mikel.e.g.2004@gmail.com",
  apiKey: "re_eDPyxbxX_4F9tdCwbFVkEquWoYtu2SnwR"
};
const resend = new Resend(env.apiKey);
const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { nombre, email, empresa, telefono, tipo, mensaje } = data;
    await resend.emails.send({
      from: env.emailFrom || "onboarding@resend.dev",
      to: env.emailTo || "tu@email.com",
      subject: `Nuevo contacto de ${nombre}`,
      html: `
            <!DOCTYPE html>
            <html lang="es">
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">✨ Nuevo Mensaje de Contacto ✨</h1>
                <img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300" 
                     alt="Perrito feliz" 
                     style="border-radius: 10px; max-width: 300px; margin: 20px 0;">
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Nombre:</span> ${nombre}</p>
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Email:</span> ${email}</p>
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Empresa:</span> ${empresa}</p>
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Teléfono:</span> ${telefono}</p>
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Tipo:</span> ${tipo}</p>
                <p style="margin: 10px 0;"><span style="color: #2c3e50; font-weight: bold;">Mensaje:</span> ${mensaje}</p>
                </div>
            </body>
            </html>
            `
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto."
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al procesar la solicitud"
      }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
