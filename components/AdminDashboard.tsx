"use client";

import { Activity, ArrowRight, Check, Clock3, ShieldCheck, UserCog, UsersRound } from "lucide-react";
import type { AuditLog, Profile, UserRole } from "@/types/database";

const roleLabels: Record<UserRole, string> = { admin: "מנהל מערכת", editor: "עורך", viewer: "צופה" };

export function AdminDashboard({ users, logs, currentUserId, onBack, onRoleChange }: { users: Profile[]; logs: AuditLog[]; currentUserId: string; onBack: () => void; onRoleChange: (user: Profile, role: UserRole) => Promise<void> }) {
  const editors = users.filter((user) => user.role === "editor").length;
  const admins = users.filter((user) => user.role === "admin").length;

  return (
    <section className="fade-in mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 lg:px-8">
      <button onClick={onBack} className="focus-ring mb-6 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-500 transition hover:text-violet-600"><ArrowRight size={18} /> חזרה למילון</button>
      <div className="glass-dark relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-9">
        <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><ShieldCheck size={25} /></span><p className="text-sm font-bold text-cyan-300">ניהול ובקרה</p><h1 className="mt-1 text-3xl font-black sm:text-4xl">לוח מנהל המערכת</h1><p className="mt-3 max-w-xl text-slate-300">ניהול הרשאות ומעקב שקוף אחר השינויים במילון.</p></div>
          <div className="flex gap-3"><Stat value={users.length} label="משתמשים" /><Stat value={editors} label="עורכים" /><Stat value={admins} label="מנהלים" /></div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <div className="glass overflow-hidden rounded-[1.75rem]">
          <div className="flex items-center justify-between border-b border-slate-200/70 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600"><UsersRound size={20} /></span><div><h2 className="font-black">ניהול משתמשים</h2><p className="text-xs text-slate-500">הקצאת הרשאות צפייה, עריכה וניהול</p></div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{users.length} רשומים</span></div>
          <div className="divide-y divide-slate-100">
            {users.map((user) => <div key={user.id} className="flex flex-col gap-4 p-5 transition hover:bg-white/60 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-black text-white">{user.name.charAt(0)}</span><div><p className="font-bold">{user.name}</p><p className="text-xs text-slate-500">{roleLabels[user.role]}</p></div></div>{user.id === currentUserId ? <span className="flex items-center gap-1.5 self-start rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 sm:self-auto"><ShieldCheck size={14} /> החשבון שלך · מנהל</span> : <label className="relative"><span className="sr-only">בחירת הרשאה עבור {user.name}</span><select value={user.role} onChange={(event) => onRoleChange(user, event.target.value as UserRole)} className="focus-ring min-w-36 appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pe-9 ps-3 text-sm font-bold outline-none"><option value="viewer">קריאה בלבד</option><option value="editor">עורך</option><option value="admin">מנהל מערכת</option></select><UserCog className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></label>}</div>)}
          </div>
        </div>

        <div className="glass overflow-hidden rounded-[1.75rem]">
          <div className="flex items-center justify-between border-b border-slate-200/70 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-100 text-cyan-700"><Activity size={20} /></span><div><h2 className="font-black">יומן פעילות</h2><p className="text-xs text-slate-500">השינויים האחרונים במערכת</p></div></div><Clock3 size={18} className="text-slate-400" /></div>
          <div className="max-h-[34rem] divide-y divide-slate-100 overflow-y-auto">
            {logs.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">עדיין לא תועדה פעילות.</p> : logs.map((log) => { const formatted = formatAction(log.action); return <div key={log.id} className="flex gap-3 p-5"><span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${formatted.tone}`}><Check size={14} /></span><div className="min-w-0"><p className="text-sm leading-6"><strong>{log.user?.name ?? "משתמש"}</strong> {formatted.text}</p><p className="mt-1 text-xs text-slate-400">{new Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(log.timestamp))}</p></div></div>; })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) { return <div className="min-w-24 rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur"><strong className="block text-2xl">{value}</strong><span className="text-xs text-slate-300">{label}</span></div>; }

function formatAction(action: string) {
  const [type, subject, role] = action.split("|");
  if (type === "created") return { text: <>הוסיף את המושג <strong>„{subject}”</strong></>, tone: "bg-emerald-100 text-emerald-700" };
  if (type === "updated") return { text: <>ערך את המושג <strong>„{subject}”</strong></>, tone: "bg-violet-100 text-violet-700" };
  if (type === "deleted") return { text: <>מחק את המושג <strong>„{subject}”</strong></>, tone: "bg-rose-100 text-rose-700" };
  if (type === "role_updated") return { text: <>שינה את הרשאת <strong>{subject}</strong> ל־{roleLabels[role as UserRole] ?? "תפקיד אחר"}</>, tone: "bg-amber-100 text-amber-700" };
  return { text: <>ביצע פעולה במערכת</>, tone: "bg-slate-100 text-slate-600" };
}
