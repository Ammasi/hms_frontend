/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
     reactStrictMode: true,
    allowedDevOrigins: ['http://192.168.1.14:8000', 'http://192.168.1.7:3000', 'http://localhost:3000','http://localhost:8000'],
  },
};

export default nextConfig;
