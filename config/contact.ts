import { env } from './env';

export const contactConfig = {
    email: {
        from: `${env.OWNER_NAME} <${env.OWNER_EMAIL}>`,
        to: [`${env.OWNER_NAME} <${env.OWNER_EMAIL}>`],
        subject: (name: string) => `New Contact from ${name}`,
        emailTemplate: {
            text: (data: { name: string; email: string; message: string }) => `
        Name: ${data.name}
        Email: ${data.email}
        Message: ${data.message}
          `,
            html: (data: { name: string; email: string; message: string }) => `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">New Contact Message</h2>
              
              <div style="margin-bottom: 15px;">
                <p style="margin: 0;"><strong>From:</strong> ${data.name} (${data.email})</p>
              </div>
              
              <div style="margin-top: 20px;">
                <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
              </div>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
              
              <div style="color: #666; font-size: 14px;">
                <p style="margin: 0;">Sent from your portfolio contact form</p>
              </div>
            </div>
          `,
        },
    },
};
