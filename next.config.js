/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  allowedDevOrigins: [
    'http://192.168.1.8:8000',
    'http://192.168.1.9:3000',
    'http://localhost:3000',
    'http://localhost:8000',
  ],  
  experimental: {
  },
};

export default nextConfig;
