import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ametikohtade hindamine | Job Evaluation Tool",
  description: "Töö hindamise tööriist palgaõigluse direktiivi jaoks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body style={{ margin: 0, padding: 0, background: "#f5f0eb" }}>
        {children}
      </body>
    </html>
  );
}
