import { NextRequest } from 'next/server';
import { createContactMessage } from '@/services/contactsService';
import { sendContactNotification } from '@/services/emailService';
import { env } from '@/config/env';
import { apiCreated, apiError, apiSuccess } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return apiError('Missing required fields', 400);
        }

        // 1. Save to database
        const contactId = await createContactMessage({ name, email, message });

        // 2. Send email notification (asyncly, don't block response if possible)
        try {
            if (env.RESEND_API_KEY) {
                await sendContactNotification({ name, email, message });
            } else {
                console.warn('RESEND_API_KEY not set, skipping email.');
            }
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
        }

        return apiCreated({ id: contactId }, 'Message sent successfully');
    } catch (error) {
        console.error('Contact API Error:', error);
        return apiError('Internal Server Error', 500);
    }
}
