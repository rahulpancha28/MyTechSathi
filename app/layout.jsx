import GlobalProvider from "@/components/Application/GlobalProvider";
import "./globals.css";
import { Assistant } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
const assistantFont = Assistant({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap'
})
export const metadata = {
  title: "myTechsathi - Best Tech Store",
  metadataBase: new URL('https://your-project-name.vercel.app'),
  description: "Buy laptops, gadgets, and accessories at the best price.",
  keywords: ["laptops", "gadgets", "tech store", "myTechsathi"],
  authors: [{ name: "myTechsathi" }],
  openGraph: {
    title: "myTechsathi",
    description: "Best tech products online",
    url: "https://mytechsathi.com",
    siteName: "myTechsathi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${assistantFont.className} antialiased`}
      >
        <GlobalProvider>
          <ToastContainer />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
