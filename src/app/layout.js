import "./globals.css";

export const metadata = {
  title: "StudyMate AI — Study Planner & AI Tutor",
  description: "A complete study task planner with a built-in AI tutor to help you learn and understand topics faster.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
