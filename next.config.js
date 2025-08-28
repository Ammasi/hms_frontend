/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  allowedDevOrigins: [
    'http://192.168.1.14:8000',
    'http://192.168.1.7:3000',
    'http://localhost:3000',
    'http://localhost:8000',
  ],  
  experimental: {
  },
};

export default nextConfig;
