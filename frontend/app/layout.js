import "./globals.css";

export const metadata = {
  title: "Gamified Learning App",
  description: "Learn with quizzes, duels, and gamification",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}