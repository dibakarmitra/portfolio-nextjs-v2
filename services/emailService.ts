import { Resend } from 'resend';
import { env } from '@/config/env';
import { contactConfig } from '@/config/contact';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendContactNotification(data: {
    name: string;
    email: string;
    message: string;
}) {
    const { from, to, subject, emailTemplate } = contactConfig.email;

    try {
        const { data: resendData, error } = await resend.emails.send({
            from: from,
            to: to,
            subject: subject(data.name),
            text: emailTemplate.text(data),
            html: emailTemplate.html(data),
            replyTo: data.email,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }

        return resendData;
    } catch (error) {
        console.error('Email Service Error:', error);
        throw error;
    }
}
