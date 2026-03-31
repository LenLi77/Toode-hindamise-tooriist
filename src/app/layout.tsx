import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ametikohtade hindamine | Job Evaluation Tool",
  description: "Töö hindamise tööriist palgaõigluse direktiivi jaoks",
  openGraph: {
    title: "Ametikohtade hindamine | Job Evaluation Tool",
    description: "Töö hindamise tööriist palgaõigluse direktiivi jaoks",
    images: ["/og-image.png"],
    url: "https://jobevaluation.hrpulse.ee",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  );
}
