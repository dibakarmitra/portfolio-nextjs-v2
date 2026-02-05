import { db } from '@/config/database';

export interface ContactMessage {
    id?: number;
    name: string;
    email: string;
    message: string;
    created_at?: Date;
    updated_at?: Date;
}

export async function createContactMessage(data: {
    name: string;
    email: string;
    message: string;
}): Promise<number> {
    const [id] = await db('contacts').insert({
        name: data.name,
        email: data.email,
        message: data.message,
    });
    return id;
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
    return db('contacts').select('*').orderBy('created_at', 'desc');
}

export async function deleteContactMessage(id: number): Promise<boolean> {
    const deleted = await db('contacts').where({ id }).delete();
    return deleted > 0;
}
