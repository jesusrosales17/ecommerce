import * as brevo from '@getbrevo/brevo';

// Instancia del cliente de emails transaccionales de Brevo
const apiInstance = new brevo.TransactionalEmailsApi();

// API Key desde el archivo .env
const apiKey = process.env.BREVO_API_KEY || '';

// Configurar ambas claves de autenticación (Brevo a veces necesita ambas)
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.partnerKey, apiKey);

// Función para enviar email de prueba
export async function sendTestEmail() {
    console.log(apiKey)

  const smtpEmail = new brevo.SendSmtpEmail();

  smtpEmail.subject = 'Hello, world!';
  smtpEmail.to = [
    {
      email: 'jesus.rc.dev@gmail.com',
      name: 'Jesús Rosales',
    },
  ];
  smtpEmail.htmlContent = '<html><body><h1>Hello, world!</h1></body></html>';
  smtpEmail.sender = {
    name: 'Jesús Rosales Castillo',
    email: 'jesusrosales07537@gmail.com', // Este debe estar verificado en Brevo
  };

  try {
    const result = await apiInstance.sendTransacEmail(smtpEmail);
    console.log('Correo enviado exitosamente:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error enviando email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al enviar email',
    };
  }
}

// Función para enviar email de recuperación de contraseña
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  userName?: string
) {
  console.log('Enviando email de recuperación a:', email);

  const smtpEmail = new brevo.SendSmtpEmail();

  smtpEmail.subject = 'Recuperación de contraseña - Ecommerce';
  smtpEmail.to = [
    {
      email: email,
      name: userName || 'Usuario',
    },
  ];

  // HTML del email
  const htmlContent = `
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
                <p>© ${new Date().getFullYear()} Ecommerce. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>`;

  smtpEmail.htmlContent = htmlContent;
  smtpEmail.sender = {
    name: 'Ecommerce',
    email: 'jesusrosales07537@gmail.com', // Email verificado en Brevo
  };

  try {
    const result = await apiInstance.sendTransacEmail(smtpEmail);
    console.log('Email de recuperación enviado exitosamente:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al enviar email',
    };
  }
}
