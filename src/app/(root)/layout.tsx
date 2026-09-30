import { defaultLocale } from "@/i18n";
import { buildRootMetadata } from "@/lib/metadata";
import { instrumentSans } from "../document";
import "../globals.css";

export const metadata = buildRootMetadata(defaultLocale);

export default function BareRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={instrumentSans.variable}>
      <body>{children}</body>
    </html>
  );
}
