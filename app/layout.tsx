import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "ธนาคารขยะเพื่อชุมชน",
  description: "ระบบจัดการธนาคารขยะและสะสมแต้มสำหรับชุมชน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.className} antialiased bg-slate-50`}>
        <UserProvider>
        <CartProvider>
        {children}
        </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}