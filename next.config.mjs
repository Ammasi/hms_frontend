/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // <-- move to top level
  allowedDevOrigins: [
    'http://192.168.1.14:8000',
    'http://192.168.1.7:3000',
    'http://localhost:3000',
    'http://localhost:8000',
  ], // <-- move to top level
  experimental: {
    // Only put valid experimental options here (if needed)
  },
};

export default nextConfig;
