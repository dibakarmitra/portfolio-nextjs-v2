import { ImageResponse } from 'next/og';
import { metaData } from '@/config/metadata';

export function GET(request: Request) {
    let url = new URL(request.url);
    let title = url.searchParams.get('title') || metaData.title;
    let description = url.searchParams.get('description') || metaData.description;

    return new ImageResponse(
        <div tw="flex w-full h-full bg-black relative">
            {/* Subtle grid pattern */}
            <div
                tw="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(64, 64, 64, 0.15) 1px, transparent 1px),
                                     linear-gradient(to bottom, rgba(64, 64, 64, 0.15) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px',
                }}
            />

            {/* Gradient accent */}
            <div
                tw="absolute"
                style={{
                    top: '-10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    background:
                        'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    borderRadius: '9999px',
                }}
            />

            <div tw="flex flex-col w-full h-full px-20 py-16 justify-between relative">
                {/* Header */}
                <div tw="flex items-center justify-between w-full">
                    <div tw="flex items-center text-gray-400 text-2xl font-semibold">
                        <span tw="text-white">Portfolio</span>
                    </div>
                    <div tw="flex items-center text-gray-500 text-base">
                        <span>{metaData.author}</span>
                    </div>
                </div>

                {/* Main content */}
                <div tw="flex flex-col" style={{ maxWidth: '900px' }}>
                    <h1
                        tw="text-7xl font-bold text-white leading-tight mb-6"
                        style={{
                            lineHeight: 1.1,
                        }}
                    >
                        {title}
                    </h1>
                    {description && (
                        <p tw="text-2xl text-gray-400 leading-relaxed" style={{ lineHeight: 1.5 }}>
                            {description}
                        </p>
                    )}
                </div>

                {/* Footer accent */}
                <div tw="flex items-center justify-between w-full">
                    <div tw="flex items-center text-gray-500 text-lg">
                        <div tw="w-2 h-2 bg-blue-500 mr-3" style={{ borderRadius: '9999px' }} />
                        <span>Read more</span>
                    </div>
                    <div tw="flex items-center" style={{ gap: '8px' }}>
                        <div tw="h-1 bg-blue-500" style={{ width: '48px', borderRadius: '4px' }} />
                        <div tw="h-1 bg-gray-700" style={{ width: '32px', borderRadius: '4px' }} />
                        <div tw="h-1 bg-gray-800" style={{ width: '16px', borderRadius: '4px' }} />
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        }
    );
}
