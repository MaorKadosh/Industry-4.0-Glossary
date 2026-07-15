"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BookOpenText, Eye, EyeOff, LoaderCircle, LockKeyhole, Moon, Sun, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function LoginPanel() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const timer = window.setTimeout(() => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("glossary-theme", nextTheme);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage("");

    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { name } } });

    setLoading(false);
    if (result.error) {
      setMessage("לא הצלחנו להשלים את הפעולה. כדאי לבדוק את הפרטים ולנסות שוב.");
      return;
    }
    if (mode === "register") setMessage("ההרשמה הושלמה בהצלחה. אפשר להתחיל להשתמש במערכת.");
  }

  return (
    <main className="mesh relative flex min-h-screen items-center justify-center p-4 sm:p-8">
      <button onClick={toggleTheme} className="focus-ring absolute left-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-slate-600 shadow-lg backdrop-blur transition hover:text-violet-600 sm:left-8 sm:top-8" aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}>{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}</button>
      <section className="glass grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.04fr_.96fr]">
        <div className="glass-dark relative hidden min-h-[650px] overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-16 top-14 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-12 right-10 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="relative flex items-center gap-3 text-sm font-bold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><BookOpenText size={22} /></span>
            <span>מילון 4.0</span>
          </div>
          <div className="relative">
            <p className="mb-4 text-sm font-bold text-cyan-300">הידע שמניע את שרשרת האספקה</p>
            <h1 className="max-w-md text-5xl font-black leading-[1.12]">מדברים את השפה של התעשייה החכמה.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">מקום אחד למושגים, לתובנות וללמידה משותפת בקורס תעשייה 4.0 וניהול שרשרת האספקה.</p>
          </div>
          <p className="relative text-sm text-slate-400">קורס 55-724 · שנת הלימודים תשפ״ו</p>
        </div>

        <div className="p-6 sm:p-12 lg:p-14">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600"><BookOpenText size={22} /></span>
            <span className="font-black">מילון 4.0</span>
          </div>
          <p className="text-sm font-bold text-violet-600">{mode === "login" ? "טוב לראות אותך שוב" : "מצטרפים למרחב הלמידה"}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">{mode === "login" ? "כניסה לחשבון" : "יצירת חשבון"}</h2>
          <p className="mt-3 text-slate-500">{mode === "login" ? "הזינו את הפרטים כדי להמשיך למילון." : "לאחר ההרשמה מנהל המערכת יקבע את ההרשאה."}</p>

          <form className="mt-9 space-y-5" onSubmit={submit}>
            {mode === "register" && <Field icon={<UserRound size={19} />} label="שם מלא"><input required value={name} onChange={(event) => setName(event.target.value)} className="w-full bg-transparent outline-none" placeholder="השם שיוצג במערכת" /></Field>}
            <Field icon={<UserRound size={19} />} label="כתובת דואר אלקטרוני"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent outline-none" placeholder="name@example.com" dir="ltr" /></Field>
            <Field icon={<LockKeyhole size={19} />} label="סיסמה">
              <input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent outline-none" placeholder="לפחות שמונה תווים" />
              <button type="button" className="focus-ring rounded-lg p-1 text-slate-400" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "הסתרת הסיסמה" : "הצגת הסיסמה"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </Field>
            {message && <p className="rounded-xl bg-violet-50 p-3 text-sm font-semibold text-violet-700" role="status">{message}</p>}
            <button disabled={loading} className="focus-ring flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-bold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-violet-600 disabled:opacity-60">
              {loading ? <LoaderCircle className="animate-spin" size={20} /> : <><span>{mode === "login" ? "כניסה למילון" : "הרשמה"}</span><ArrowLeft size={19} /></>}
            </button>
          </form>
          <button className="focus-ring mt-7 w-full rounded-xl py-2 text-sm font-bold text-slate-500 hover:text-violet-600" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
            {mode === "login" ? "עדיין אין לך חשבון? להרשמה" : "כבר יש לך חשבון? לכניסה"}
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><span className="focus-within:ring-violet-500/20 flex h-13 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-violet-400 focus-within:ring-4">{icon}{children}</span></label>;
}
