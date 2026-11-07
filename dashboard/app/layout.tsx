import "./globals.css";

export const metadata = {
  title: "DR + Incident Command Dashboard",
  description: "Realtime dashboard for incident response, disaster recovery health, and alert-source monitoring",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
