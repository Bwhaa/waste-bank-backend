import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // 👇 เพิ่มส่วนนี้เข้าไปครับ: สั่งให้ Next.js เป็นตัวกลางส่งต่อ API
  async rewrites() {
    return [
      {
        source: '/api/:path*', // ถ้าเจอลิงก์ขึ้นต้นด้วย /api
        destination: 'http://localhost:3000/api/:path*', // ให้ส่งต่อไปที่ Backend Port 3000
      },
    ];
  },
};

export default nextConfig;