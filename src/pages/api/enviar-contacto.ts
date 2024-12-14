import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const env = {
    emailFrom: import.meta.env.RESEND_EMAIL_FROM,
    emailTo: import.meta.env.RESEND_EMAIL_TO,
    apiKey: import.meta.env.RESEND_API_KEY
}

if (!env.apiKey) {
  throw new Error('Missing RESEND_API_KEY');
}
const resend = new Resend(env.apiKey);

interface ContactFormData {
    nombre: string;
    email: string;
    empresa: string;
    telefono: string;
    tipo: string;
    mensaje: string;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json() as ContactFormData;
        const { nombre, email, empresa, telefono, tipo, mensaje } = data;

        // Enviar email usando Resend
        await resend.emails.send({
            from: env.emailFrom || 'onboarding@resend.dev',
            to: env.emailTo || 'tu@email.com',
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
                message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error al procesar la solicitud'
            }),
            { status: 500 }
        );
    }
};
