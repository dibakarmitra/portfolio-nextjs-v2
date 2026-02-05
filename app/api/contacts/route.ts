import { NextRequest } from 'next/server';
import { getAllContactMessages, deleteContactMessage } from '@/services/contactsService';
import { apiSuccess, apiError, apiNotFound } from '@/lib/apiResponse';

/**
 * Handle GET request to fetch all contact messages
 */
export async function GET() {
    try {
        const contacts = await getAllContactMessages();
        return apiSuccess(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return apiError('Failed to fetch contact messages', 500);
    }
}

/**
 * Handle DELETE request to remove a contact message
 */
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return apiError('Missing contact ID', 400);
        }

        const success = await deleteContactMessage(Number(id));

        if (!success) {
            return apiNotFound('Contact message');
        }

        return apiSuccess(null, 'Contact message deleted successfully');
    } catch (error) {
        console.error('Error deleting contact:', error);
        return apiError('Failed to delete contact message', 500);
    }
}
