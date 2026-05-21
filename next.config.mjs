/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
                search: ''
            }
        ]
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: 'https://www.mytechsathi.com' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ]
    },
};
export default nextConfig;