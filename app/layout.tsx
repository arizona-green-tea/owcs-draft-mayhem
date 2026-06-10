import "./globals.css";

export const metadata = {
  title: "OW Draft Mayhem",
  description: "Overwatch draft simulator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}