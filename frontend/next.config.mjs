/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/dagster/:path*',
                destination: 'http://127.0.0.1:3000/:path*',
            },
            {
                source: '/api/fastapi/:path*',
                destination: 'http://127.0.0.1:8000/api/:path*',
            },
        ];
    },
};

export default nextConfig;
