// /** @type {import('next').NextConfig} */

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
}

module.exports = nextConfig