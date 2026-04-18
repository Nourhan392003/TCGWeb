import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Note: output: 'export' is incompatible with next-intl middleware.
    // If you need static export, you must use the client-side approach or pre-generate paths.
    // For now, we assume a dynamic server environment as it's required for Clerk and dynamic routing.
    // output: 'export', 
    trailingSlash: true,
    images: { unoptimized: true }
}

export default withNextIntl(nextConfig);