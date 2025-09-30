import { WebSocketProvider } from "@/ui/context/WebSocketContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // using suppressHydrationWarning for avoiding extensions like Grammarly to interfere with hydration
    <html lang="en" suppressHydrationWarning>
      <body>
        <WebSocketProvider>{children}</WebSocketProvider>
      </body>
    </html>
  );
}
