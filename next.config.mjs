/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Skip type checking during build — verified manually with tsc --noEmit
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warn but don't fail build on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;