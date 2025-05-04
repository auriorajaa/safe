import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1", "flowing-sharp-martin.ngrok-free.app"],
  // experimental: {
  //   allowedDevOrigins: [
  //     "192.168.56.1",
  //     "flowing-sharp-martin.ngrok-free.app",
  //   ],
  // },
};

export default nextConfig;
