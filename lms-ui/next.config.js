/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    //domains:["newprofilepic2.photo-cdn.net"]
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'newprofilepic2.photo-cdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dribbble.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig
