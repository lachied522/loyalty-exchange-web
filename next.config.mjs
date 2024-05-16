/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fxeakctvzbmidqxxpnfc.supabase.co',
            port: '',
            pathname: '/storage/**',
          },
        ],
      },
};

export default nextConfig;
