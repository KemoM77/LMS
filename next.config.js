/** @type {import('next').NextConfig} */
const nextConfig = {
  //output:"export",
  experimental: {
    appDir: true,
    //serverActions:true,
  },
  images: {
    domains:["*.*"]
  },
};

module.exports = nextConfig
