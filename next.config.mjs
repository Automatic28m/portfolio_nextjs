/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all images from Cloudinary
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', 
    },
  },
  middlewareClientMaxBodySize: '50mb',
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;