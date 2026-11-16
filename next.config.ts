import type { NextConfig } from "next";
import { devIndicatorServerState } from "next/dist/server/dev/dev-indicator-server-state";

const nextConfig = {


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      
    ],
    domains: ["avatars.googleusercontent.com", "lh3.googleusercontent.com"], // Add lh3.googleusercontent.com here

    
  },
};

module.exports = nextConfig;