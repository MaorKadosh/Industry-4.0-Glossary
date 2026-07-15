"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, Share, ShieldCheck, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSamsungAndroid, setIsSamsungAndroid] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const samsungAndroid = /Android/i.test(navigator.userAgent) && /SamsungBrowser/i.test(navigator.userAgent);
    const timer = window.setTimeout(() => {
      setIsStandalone(standalone);
      setIsSamsungAndroid(samsungAndroid);
    }, 0);

    function capturePrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function markInstalled() {
      setIsStandalone(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  async function installApp() {
    if (isSamsungAndroid) {
      setShowInstructions(true);
      return;
    }

    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstallPrompt(null);
  }

  function openInChrome() {
    const fallbackUrl = encodeURIComponent(window.location.href);
    const target = `${window.location.host}${window.location.pathname}${window.location.search}`;
    window.location.href = `intent://${target}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallbackUrl};end`;
  }

  if (isStandalone) return null;

  return (
    <>
      <button onClick={installApp} className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-violet-600" aria-label="התקנת האפליקציה" title="התקנת האפליקציה">
        <Download size={19} />
      </button>
      {showInstructions && (
        <div className="modal-backdrop fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowInstructions(false); }}>
          <div className="modal-panel relative w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="install-title">
            <button onClick={() => setShowInstructions(false)} className="focus-ring absolute left-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="סגירת החלון"><X size={19} /></button>
            <span className="grid h-13 w-13 place-items-center rounded-2xl bg-violet-100 text-violet-600">{isSamsungAndroid ? <ShieldCheck size={25} /> : <Download size={24} />}</span>
            <h2 id="install-title" className="mt-5 text-2xl font-black">{isSamsungAndroid ? "התקנה בטוחה באנדרואיד" : "התקנת מילון 4.0"}</h2>
            {isSamsungAndroid ? (
              <>
                <p className="mt-3 leading-7 text-slate-600">דפדפן סמסונג עלול להציג התראת אבטחה שגויה בעת התקנת אפליקציות אינטרנט. מומלץ להשלים את ההתקנה דרך גוגל כרום.</p>
                <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">1</span><span>פתחו את האפליקציה בגוגל כרום.</span></li>
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">2</span><span>לחצו שוב על סמל ההתקנה או בחרו „התקנת אפליקציה” בתפריט הדפדפן.</span></li>
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">3</span><span>אשרו את ההוספה למסך הבית.</span></li>
                </ol>
                <button onClick={openInChrome} className="focus-ring mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-700"><ExternalLink size={18} /> פתיחה בגוגל כרום</button>
                <button onClick={() => setShowInstructions(false)} className="focus-ring mt-2 w-full rounded-2xl px-5 py-3 font-bold text-slate-500 transition hover:bg-slate-100">לא עכשיו</button>
              </>
            ) : (
              <>
                <p className="mt-3 leading-7 text-slate-600">אם חלון ההתקנה לא הופיע, אפשר להוסיף את האפליקציה ישירות מתפריט הדפדפן:</p>
                <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">1</span><span>פתחו את תפריט הדפדפן או את כפתור השיתוף <Share className="mx-1 inline" size={16} />.</span></li>
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">2</span><span>בחרו „התקנת אפליקציה” או „הוספה למסך הבית”.</span></li>
                  <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-700">3</span><span>אשרו כדי ליצור אייקון במסך הבית.</span></li>
                </ol>
                <button onClick={() => setShowInstructions(false)} className="focus-ring mt-7 w-full rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700">הבנתי</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
