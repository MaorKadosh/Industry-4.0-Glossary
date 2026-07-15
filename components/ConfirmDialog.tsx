"use client";

import { Trash2, X } from "lucide-react";

export function ConfirmDialog({ termName, onCancel, onConfirm }: { termName: string; onCancel: () => void; onConfirm: () => Promise<void> }) {
  return <div className="modal-backdrop fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm"><div className="modal-panel w-full max-w-sm rounded-[2rem] bg-white p-7 text-center shadow-2xl"><button onClick={onCancel} className="focus-ring absolute rounded-lg p-1 text-slate-400" aria-label="סגירת החלון"><X size={19} /></button><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-100 text-rose-600"><Trash2 size={25} /></span><h2 className="mt-5 text-xl font-black">למחוק את המושג?</h2><p className="mt-2 leading-7 text-slate-500">המושג „{termName}” יוסר מהמילון. הפעולה תתועד ביומן הפעילות.</p><div className="mt-7 flex gap-3"><button onClick={onConfirm} className="focus-ring flex-1 rounded-2xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700">כן, למחוק</button><button onClick={onCancel} className="focus-ring flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-slate-600 hover:bg-slate-50">ביטול</button></div></div></div>;
}
