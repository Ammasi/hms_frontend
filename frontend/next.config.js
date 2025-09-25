/** @type {import('next').NextConfig} */

const  BACKEND = process.env.NEXT_PUBLIC_API_BACKEND;  

// console.log("process.env.API_BACKEND",process.env.NEXT_PUBLIC_API_BACKEND);

// console.log("BACKEND", BACKEND);

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        
        destination: `${BACKEND}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
