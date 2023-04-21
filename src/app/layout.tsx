import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "HQV Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
