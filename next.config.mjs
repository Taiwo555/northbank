/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
