import { getServerSettings } from '@/services/settingsService';
import AdminLayout from './layout';

interface PageWrapperProps {
    children: React.ReactNode;
}

export default async function PageWrapper({ children }: PageWrapperProps) {
    // Get server-side settings
    const serverSettings = await getServerSettings();

    return (
        <div data-settings={JSON.stringify(serverSettings.settings)}>
            <AdminLayout>{children}</AdminLayout>
        </div>
    );
}
