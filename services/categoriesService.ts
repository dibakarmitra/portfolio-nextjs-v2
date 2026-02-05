import { db } from '@/config/database';
import { Category, DBCategory } from '@/types';
import { dbCategoryToCategory } from './notesService';

export async function getAllCategories(): Promise<Category[]> {
    const dbCategories = await db('categories').orderBy('sort_order', 'asc').orderBy('name', 'asc');

    return dbCategories.map(dbCategoryToCategory);
}

export async function getActiveCategories(): Promise<Category[]> {
    const dbCategories = await db('categories')
        .where('is_active', true)
        .orderBy('sort_order', 'asc')
        .orderBy('name', 'asc');

    return dbCategories.map(dbCategoryToCategory);
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const dbCategory = await db('categories').where('id', id).first();

    return dbCategory ? dbCategoryToCategory(dbCategory) : null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const dbCategory = await db('categories').where('slug', slug).first();

    return dbCategory ? dbCategoryToCategory(dbCategory) : null;
}

export async function createCategory(categoryData: Partial<Category>): Promise<Category> {
    const slug = categoryData.slug || generateSlug(categoryData.name!);

    let finalSlug = slug;
    let counter = 1;
    while (await db('categories').where('slug', finalSlug).first()) {
        finalSlug = `${slug}-${counter}`;
        counter++;
    }

    const dbCategoryData: Partial<DBCategory> = {
        name: categoryData.name,
        slug: finalSlug,
        description: categoryData.description || null,
        color: categoryData.color || null,
        icon: categoryData.icon || null,
        sort_order: categoryData.sortOrder || 0,
        is_active: categoryData.isActive !== undefined ? categoryData.isActive : true,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const [newId] = await db('categories').insert(dbCategoryData);
    const id = Number(newId);

    const createdCategory = await getCategoryById(id);
    if (!createdCategory) {
        throw new Error('Failed to create category');
    }

    return createdCategory;
}

export async function updateCategory(
    id: number,
    categoryData: Partial<Category>
): Promise<Category> {
    const rawUpdateData: Partial<DBCategory> = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || null,
        color: categoryData.color || null,
        icon: categoryData.icon || null,
        sort_order: categoryData.sortOrder,
        is_active: categoryData.isActive,
        updated_at: new Date(),
    };

    const updateData = Object.fromEntries(
        Object.entries(rawUpdateData).filter(([_, value]) => value !== undefined)
    );

    await db('categories').where('id', id).update(updateData);

    const updatedCategory = await getCategoryById(id);
    if (!updatedCategory) {
        throw new Error('Failed to update category');
    }

    return updatedCategory;
}

export async function deleteCategory(id: number): Promise<void> {
    await db('categories').where('id', id).del();
}

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
