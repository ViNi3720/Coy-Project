import "./globals.css";
import TabBar from "@/components/TabBar";

export const metadata = { title: "Coy", description: "Coy Discover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-gradient-to-br from-rose-100 via-orange-50 to-pink-200 text-neutral-900 lg:flex lg:items-center lg:justify-center lg:gap-20 lg:p-8">
          {/* Left info panel, sirf desktop pe dikhega */}
          <aside className="hidden max-w-xs lg:block">
            <h1 className="text-5xl font-extrabold text-rose-500">Coy</h1>
            <p className="mt-1 text-lg font-semibold text-neutral-700">
              Discover
            </p>
            <p className="mt-6 text-neutral-600">
              Swipe right to like, left to pass. A match happens only when both
              of you like each other.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-600">
              <li>👉 Drag the card or use the buttons</li>
              <li>⌨️ Arrow keys: ← pass, → like</li>
              <li>🔒 Nobody sees who liked them until it&apos;s mutual</li>
            </ul>
          </aside>

          {/* Phone frame */}
          <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white lg:mx-0 lg:h-[800px] lg:max-h-[92vh] lg:rounded-[2.5rem] lg:border-8 lg:border-neutral-900 lg:shadow-2xl">
            <main className="flex-1 overflow-y-auto">{children}</main>
            <TabBar />
          </div>
        </div>
      </body>
    </html>
  );
}
