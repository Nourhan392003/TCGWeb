const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: { unoptimized: true }
}

module.exports = withNextIntl(nextConfig)