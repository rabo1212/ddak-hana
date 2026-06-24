import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  webpack: (config) => {
    // ESM-only 패키지의 exports 필드 해결
    config.resolve.conditionNames = ["import", "module", "require", "default"];
    return config;
  },
};

export default withPWA(nextConfig);
