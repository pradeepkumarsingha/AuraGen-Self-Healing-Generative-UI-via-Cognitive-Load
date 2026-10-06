// frontend/src/app/layout.js
import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'AuraGen-AI — Self-Healing Generative UI',
  description: 'Real-time adaptive interfaces via cognitive load evaluation and LangChain generative UI synthesis',
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/icon.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen selection:bg-indigo-500/40 selection:text-white font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}