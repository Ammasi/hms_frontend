/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 
  allowedDevOrigins: [
    'http://192.168.1.11:3000',  
    'http://localhost:3000',    
    'http://192.168.1.4:8000',  
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.4:8000/api/:path*',
      },
    ];
  },
  experimental: {},
};

export default nextConfig;
