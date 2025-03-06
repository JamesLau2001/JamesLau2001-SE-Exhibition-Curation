/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["openaccess-cdn.clevelandart.org", "www.artic.edu","iiif.artic.edu"],
  },
};

export default nextConfig;
