"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDownAZ, BookOpenText, BookPlus, ChevronLeft, Clock3, LogOut, Menu, Moon, Pencil, Search, Sparkles, Sun, Trash2, UsersRound, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { demoLogs, demoProfile, demoTerms, demoUsers } from "@/lib/demoData";
import type { AuditLog, Profile, Term, UserRole } from "@/types/database";
import { AdminDashboard } from "./AdminDashboard";
import { ConfirmDialog } from "./ConfirmDialog";
import { LoginPanel } from "./LoginPanel";
import { TermModal } from "./TermModal";
import { InstallAppButton } from "./InstallAppButton";
import { ShareAppButton } from "./ShareAppButton";

type SortMode = "alphabetical" | "newest" | "oldest";

export function GlossaryApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(isSupabaseConfigured ? null : demoProfile);
  const [terms, setTerms] = useState<Term[]>(isSupabaseConfigured ? [] : demoTerms);
  const [users, setUsers] = useState<Profile[]>(isSupabaseConfigured ? [] : demoUsers);
  const [logs, setLogs] = useState<AuditLog[]>(isSupabaseConfigured ? [] : demoLogs);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("alphabetical");
  const [activeView, setActiveView] = useState<"glossary" | "admin">("glossary");
  const [editingTerm, setEditingTerm] = useState<Term | null | undefined>(undefined);
  const [deletingTerm, setDeletingTerm] = useState<Term | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadData = useCallback(async (userId: string) => {
    if (!supabase) return;
    setLoading(true);
    const [profileResult, termsResult] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("terms").select("*, creator:users!terms_created_by_fkey(name)").order("created_at", { ascending: false }),
    ]);
    if (profileResult.data) setProfile(profileResult.data);
    if (termsResult.data) setTerms(termsResult.data as unknown as Term[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); if (data.session) loadData(data.session.user.id); else setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); if (nextSession) loadData(nextSession.user.id); else setProfile(null); });
    return () => data.subscription.unsubscribe();
  }, [loadData]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeView !== "admin" || profile?.role !== "admin" || !supabase) return;
    Promise.all([
      supabase.from("users").select("*").order("name"),
      supabase.from("audit_logs").select("*, user:users!audit_logs_user_id_fkey(name)").order("timestamp", { ascending: false }).limit(100),
    ]).then(([userResult, logResult]) => { if (userResult.data) setUsers(userResult.data); if (logResult.data) setLogs(logResult.data as unknown as AuditLog[]); });
  }, [activeView, profile?.role]);

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("he");
    const result = terms.filter((item) => !normalized || item.term.toLocaleLowerCase("he").includes(normalized) || item.definition.toLocaleLowerCase("he").includes(normalized));
    return [...result].sort((a, b) => sort === "alphabetical" ? a.term.localeCompare(b.term, "he") : sort === "newest" ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [query, sort, terms]);

  const canEdit = profile?.role === "admin" || profile?.role === "editor";

  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 2800); }

  async function saveTerm(values: { term: string; definition: string }) {
    if (!profile) return;
    if (!supabase) {
      if (editingTerm) setTerms((items) => items.map((item) => item.id === editingTerm.id ? { ...item, ...values } : item));
      else setTerms((items) => [{ id: crypto.randomUUID(), ...values, created_by: profile.id, created_at: new Date().toISOString(), creator: { name: profile.name } }, ...items]);
    } else if (editingTerm) {
      const { data, error } = await supabase.from("terms").update(values).eq("id", editingTerm.id).select().single();
      if (error) { showNotice("שמירת השינויים נכשלה."); return; }
      setTerms((items) => items.map((item) => item.id === editingTerm.id ? { ...item, ...data } : item));
    } else {
      const { data, error } = await supabase.from("terms").insert({ ...values, created_by: profile.id }).select().single();
      if (error) { showNotice("הוספת המושג נכשלה."); return; }
      setTerms((items) => [{ ...data, creator: { name: profile.name } }, ...items]);
    }
    setEditingTerm(undefined);
    showNotice(editingTerm ? "השינויים נשמרו בהצלחה." : "המושג נוסף למילון.");
  }

  async function deleteTerm() {
    if (!deletingTerm) return;
    if (supabase) {
      const { error } = await supabase.from("terms").delete().eq("id", deletingTerm.id);
      if (error) { showNotice("מחיקת המושג נכשלה."); return; }
    }
    setTerms((items) => items.filter((item) => item.id !== deletingTerm.id));
    setDeletingTerm(null);
    showNotice("המושג נמחק מהמילון.");
  }

  async function changeRole(user: Profile, role: UserRole) {
    if (role === "admin" && !window.confirm(`להעניק ל־${user.name} הרשאת מנהל מערכת מלאה?`)) return;
    if (supabase) {
      const { error } = await supabase.from("users").update({ role }).eq("id", user.id);
      if (error) { showNotice("עדכון ההרשאה נכשל."); return; }
    }
    setUsers((items) => items.map((item) => item.id === user.id ? { ...item, role } : item));
    if (!supabase) setLogs((items) => [{ id: crypto.randomUUID(), action: `role_updated|${user.name}|${role}`, user_id: profile!.id, timestamp: new Date().toISOString(), user: { name: profile!.name } }, ...items]);
    showNotice("ההרשאה עודכנה.");
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("glossary-theme", nextTheme);
  }

  if (isSupabaseConfigured && !loading && !session) return <LoginPanel />;
  if (loading || !profile) return <LoadingScreen />;

  return (
    <main className="mesh flex min-h-dvh flex-col">
      <Header profile={profile} theme={theme} onToggleTheme={toggleTheme} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} activeView={activeView} setActiveView={setActiveView} onLogout={() => supabase?.auth.signOut()} />
      {!isSupabaseConfigured && <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm font-semibold text-violet-700"><Sparkles size={17} className="shrink-0" /><span>מצב הדגמה פעיל - כל היכולות זמינות לבדיקה, והשינויים נשמרים עד לרענון העמוד.</span></div></div>}
      <div className="flex-1">{activeView === "admin" && profile.role === "admin" ? <AdminDashboard users={users} logs={logs} currentUserId={profile.id} onBack={() => setActiveView("glossary")} onRoleChange={changeRole} /> : <GlossaryView terms={filteredTerms} total={terms.length} query={query} setQuery={setQuery} sort={sort} setSort={setSort} canEdit={canEdit} setEditingTerm={setEditingTerm} setDeletingTerm={setDeletingTerm} />}</div>
      <footer className="border-t border-slate-200/70 bg-white/40 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 text-center text-sm font-semibold text-slate-500 backdrop-blur-xl">© 2026 מתן סויסה</footer>
      {canEdit && activeView === "glossary" && <button onClick={() => setEditingTerm(null)} className="focus-ring pulse-soft fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-30 flex h-16 -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-2xl bg-violet-600 px-7 text-base font-bold text-white shadow-2xl shadow-violet-500/30 transition hover:-translate-y-1 hover:bg-violet-700" aria-label="הוספת מושג חדש"><BookPlus size={26} /><span>מושג חדש</span></button>}
      {editingTerm !== undefined && <TermModal term={editingTerm} onClose={() => setEditingTerm(undefined)} onSave={saveTerm} />}
      {deletingTerm && <ConfirmDialog termName={deletingTerm.term} onCancel={() => setDeletingTerm(null)} onConfirm={deleteTerm} />}
      {notice && <div className="fade-in fixed bottom-[calc(10.5rem+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl" role="status">{notice}</div>}
    </main>
  );
}

function Header({ profile, theme, onToggleTheme, mobileMenu, setMobileMenu, activeView, setActiveView, onLogout }: { profile: Profile; theme: "light" | "dark"; onToggleTheme: () => void; mobileMenu: boolean; setMobileMenu: (value: boolean) => void; activeView: "glossary" | "admin"; setActiveView: (value: "glossary" | "admin") => void; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => setActiveView("glossary")} className="focus-ring flex items-center gap-3 rounded-xl text-right">
          <Image src="/icons/logo-192.png" alt="" width={44} height={44} className="h-11 w-11 rounded-2xl object-cover shadow-lg shadow-cyan-500/20" priority />
          <span><strong className="block leading-none">מילון 4.0</strong><small className="mt-1 block text-[10px] font-semibold text-slate-400">שרשרת אספקה חכמה</small></span>
        </button>
        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-2 sm:flex">
            <button onClick={() => setActiveView("glossary")} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold transition ${activeView === "glossary" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}>המילון</button>
            {profile.role === "admin" && <button onClick={() => setActiveView("admin")} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold transition ${activeView === "admin" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}>ניהול</button>}
            <span className="mx-2 h-7 w-px bg-slate-200" />
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-black text-white">{profile.name.charAt(0)}</span>
            <div className="text-right"><p className="text-sm font-bold leading-none">{profile.name}</p><p className="mt-1 text-[10px] text-slate-400">{profile.role === "admin" ? "מנהל מערכת" : profile.role === "editor" ? "עורך" : "צופה"}</p></div>
            {isSupabaseConfigured && <button onClick={onLogout} className="focus-ring ms-2 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600" aria-label="יציאה מהחשבון"><LogOut size={18} /></button>}
          </nav>
          <button onClick={onToggleTheme} className="focus-ring grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-violet-600" aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"} title={theme === "dark" ? "מצב בהיר" : "מצב כהה"}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>
          <InstallAppButton />
          <ShareAppButton />
          <button className="focus-ring grid h-10 w-10 place-items-center rounded-xl sm:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="פתיחת תפריט">{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {mobileMenu && <div className="fade-in border-t border-slate-100 bg-white p-4 sm:hidden"><button onClick={() => { setActiveView("glossary"); setMobileMenu(false); }} className="w-full rounded-xl p-3 text-right font-bold">המילון</button>{profile.role === "admin" && <button onClick={() => { setActiveView("admin"); setMobileMenu(false); }} className="w-full rounded-xl p-3 text-right font-bold">ניהול המערכת</button>}{isSupabaseConfigured && <button onClick={onLogout} className="w-full rounded-xl p-3 text-right font-bold text-rose-600">יציאה מהחשבון</button>}</div>}
    </header>
  );
}

function GlossaryView({ terms, total, query, setQuery, sort, setSort, canEdit, setEditingTerm, setDeletingTerm }: { terms: Term[]; total: number; query: string; setQuery: (value: string) => void; sort: SortMode; setSort: (value: SortMode) => void; canEdit: boolean; setEditingTerm: (term: Term | null) => void; setDeletingTerm: (term: Term) => void }) {
  return <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8"><div className="slide-up grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-violet-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-cyan-400" /> קורס 55-724 · תשפ״ו</div><h1 className="max-w-3xl text-4xl font-black tracking-[-0.035em] sm:text-6xl">המושגים שמעצבים את <span className="gradient-text">שרשרת האספקה</span> החדשה.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">מילון חי ושיתופי מעולמות הדיגיטציה, האוטומציה והלוגיסטיקה החכמה - מבוסס על הרצאות הקורס ומקרי בוחן מהתעשייה.</p></div><div className="glass flex min-w-44 items-center gap-3 rounded-2xl p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700"><BookOpenText size={21} /></span><div><strong className="block text-2xl leading-none">{total}</strong><span className="text-xs text-slate-500">מושגים במילון</span></div></div></div>

    <div className="glass slide-up mt-10 flex flex-col gap-3 rounded-[1.6rem] p-3 sm:flex-row sm:items-center" style={{ animationDelay: "100ms" }}><label className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm"><Search className="text-slate-400" size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-full w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="חיפוש לפי מושג או תוכן ההגדרה..." aria-label="חיפוש במילון" />{query && <button onClick={() => setQuery("")} className="focus-ring rounded-lg p-1 text-slate-400" aria-label="ניקוי החיפוש"><X size={17} /></button>}</label><label className="relative flex h-12 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm font-bold text-slate-600"><ArrowDownAZ size={18} className="text-violet-600" /><span className="sr-only">מיון המושגים</span><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="appearance-none bg-transparent pe-5 outline-none"><option value="alphabetical">לפי א״ב</option><option value="newest">החדשים תחילה</option><option value="oldest">הוותיקים תחילה</option></select><ChevronLeft className="pointer-events-none absolute left-3 rotate-[-90deg] text-slate-400" size={15} /></label></div>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{terms.map((item, index) => <article key={item.id} className="glass term-card slide-up group flex min-h-64 flex-col rounded-[1.65rem] p-6" style={{ animationDelay: `${Math.min(index * 55, 330)}ms` }}><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-bold text-violet-600">מושג מקצועי</span>{canEdit && <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><button onClick={() => setEditingTerm(item)} className="focus-ring rounded-xl p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600" aria-label={`עריכת ${item.term}`}><Pencil size={17} /></button><button onClick={() => setDeletingTerm(item)} className="focus-ring rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`מחיקת ${item.term}`}><Trash2 size={17} /></button></div>}</div><h2 className="mt-5 text-2xl font-black tracking-tight">{item.term}</h2><p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.definition}</p><div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4 text-[11px] text-slate-400"><span className="flex items-center gap-1.5"><UsersRound size={14} /> {item.creator?.name ?? "חבר בקורס"}</span><span className="flex items-center gap-1.5"><Clock3 size={14} /> {new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "short" }).format(new Date(item.created_at))}</span></div></article>)}</div>
    {terms.length === 0 && <div className="glass mt-6 rounded-[1.75rem] p-14 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Search size={24} /></span><h2 className="mt-5 text-xl font-black">לא נמצאו מושגים מתאימים</h2><p className="mt-2 text-sm text-slate-500">אפשר לנסות ניסוח אחר או לנקות את החיפוש.</p></div>}
  </section>;
}

function LoadingScreen() { return <main className="grid min-h-dvh place-items-center bg-slate-50"><div className="text-center"><Image src="/icons/logo-192.png" alt="" width={56} height={56} className="mx-auto h-14 w-14 animate-pulse rounded-2xl object-cover shadow-lg shadow-cyan-500/20" priority /><p className="mt-4 text-sm font-bold text-slate-500">טוענים את המילון...</p></div></main>; }
