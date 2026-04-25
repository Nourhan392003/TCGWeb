const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: { unoptimized: true },
    async redirects() {
        return [
            {
                source: '/en/games',
                destination: '/en/tcg/',
                permanent: true,
            },
            {
                source: '/en/games/',
                destination: '/en/tcg/',
                permanent: true,
            },
            {
                source: '/ar/games',
                destination: '/ar/tcg/',
                permanent: true,
            },
            {
                source: '/ar/games/',
                destination: '/ar/tcg/',
                permanent: true,
            }
        ]
    }
}

module.exports = withNextIntl(nextConfig)