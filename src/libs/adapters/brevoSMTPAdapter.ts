import { EmailAdapter, EmailData } from "./emailAdapter";
import nodemailer from 'nodemailer';

/**
 * Implementación del adaptador de email usando BREVO SMTP (fallback cuando la API no funciona)
 */
export class BrevoSMTPEmailAdapter implements EmailAdapter {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: '8e893a001@smtp-brevo.com',
        pass: 'fY1kOwL3B06cF4PK',
      },
    });
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Enviando email via SMTP con datos:', {
        to: emailData.to,
        subject: emailData.subject,
        from: '8e893a001@smtp-brevo.com'
      });

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Ecommerce'}" <8e893a001@smtp-brevo.com>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado exitosamente:', result.messageId);
      
      return { success: true };
    } catch (error) {
      console.error('Error enviando email via SMTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al enviar email',
      };
    }
  }

  async sendPasswordResetEmail(
    email: string, 
    resetLink: string, 
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    const htmlContent = this.generatePasswordResetHtml(resetLink, userName);
    const textContent = this.generatePasswordResetText(resetLink, userName);

    return this.sendEmail({
      to: email,
      subject: 'Recuperación de contraseña - Ecommerce',
      html: htmlContent,
      text: textContent,
    });
  }

  async sendOrderConfirmationEmail(
    email: string, 
    orderData: any
  ): Promise<{ success: boolean; error?: string }> {
    // Implementar cuando sea necesario
    return { success: true };
  }

  async sendWelcomeEmail(
    email: string, 
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    // Implementar cuando sea necesario
    return { success: true };
  }

  private generatePasswordResetHtml(resetLink: string, userName?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { 
                display: inline-block; 
                background: #1e3a8a; 
                color: white !important; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <h2>Hola${userName ? ` ${userName}` : ''},</h2>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Restablecer Contraseña</a>
                </div>
                <p><strong>Este enlace expirará en 1 hora por seguridad.</strong></p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                <p>Si tienes problemas con el botón, puedes copiar y pegar este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #1e3a8a;">${resetLink}</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                <p>© ${new Date().getFullYear()} Tu Ecommerce. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>`;
  }

  private generatePasswordResetText(resetLink: string, userName?: string): string {
    return `
Hola${userName ? ` ${userName}` : ''},

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Para crear una nueva contraseña, visita el siguiente enlace:
${resetLink}

Este enlace expirará en 1 hora por seguridad.

Si no solicitaste este cambio, puedes ignorar este correo de forma segura.

© ${new Date().getFullYear()} Tu Ecommerce. Todos los derechos reservados.
    `.trim();
  }
}

// Instancia por defecto del adaptador SMTP
export const brevoSMTPEmailAdapter = new BrevoSMTPEmailAdapter();
