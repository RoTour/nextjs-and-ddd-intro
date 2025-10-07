import { WebSocketProvider } from "@/ui/context/WebSocketContext";
import "./globals.css";
import { RuntimeConfigProvider } from "@/ui/context/RuntimeConfigContext";
import Navbar from "@/ui/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websocketUrl = process.env.WEBSOCKET_URL;
  if (!websocketUrl) {
    throw new Error(
      "WEBSOCKET_URL is not defined in the environment variables.",
    );
  }

  return (
    // using suppressHydrationWarning for avoiding extensions like Grammarly to interfere with hydration
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <RuntimeConfigProvider
          value={{
            WEBSOCKET_URL: websocketUrl,
          }}
        >
          <WebSocketProvider>{children}</WebSocketProvider>
        </RuntimeConfigProvider>
      </body>
    </html>
  );
}
