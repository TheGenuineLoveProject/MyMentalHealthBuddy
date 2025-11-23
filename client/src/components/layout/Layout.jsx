import { NavigationMenu } from "@/components/ui/navigation-menu";
import { ToastProvider } from "@/components/ui/sonner";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <NavigationMenu />
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        {children}
      </main>
      <ToastProvider />
    </div>
  );
}
