import { useEffect, useState } from "react";

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleInstall}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-orange-500/20 transition-all active:scale-95"
      >
        Install App 
      </button>
    </div>
  );
}