import { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import {
  signInWithEmail,
  signOutFromSupabase,
  signUpWithEmail,
  supabase,
  validateEmail,
} from "../lib/supabase";
import {
  LayoutDashboard, Car, BookOpen, Sparkles, BarChart2, Library,
  Bell, Settings, ShoppingBag, Sun, Moon, Mic, Camera, PenLine,
  ChevronRight, Plus, X, Menu, MessageSquare,
  Wrench, Fuel, AlertTriangle, CheckCircle, Clock, FileText,
  TrendingUp, Download, Search, Star, MapPin, Phone,
  Check, Send, LogOut, Calendar, Gauge, Activity,
  Award, BatteryCharging, Shield, ChevronDown, Zap, Edit2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Page = "dashboard" | "cars" | "journal" | "recommendations" | "reports" | "references" | "notifications" | "settings" | "marketplace";

// ── data ─────────────────────────────────────────────────────────────────────
const CARS = [
  {
    id: 1, name: "Toyota Camry", year: 2019, plate: "777 ABA 02",
    status: "ok", mileage: 87400, nextTO: "12 авг 2025", daysLeft: 34,
    vin: "4T1BF1FK5JU784312", engine: "2.5 л · Бензин", power: "181 л.с.",
    color: "Чёрный", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=480&fit=crop&auto=format",
    toKm: 12000, totalKm: 90000,
  },
  {
    id: 2, name: "Kia Sportage", year: 2021, plate: "555 KAZ 01",
    status: "warn", mileage: 43200, nextTO: "28 июл 2025", daysLeft: 9,
    vin: "XWEH371AA0L000192", engine: "2.0 л · Бензин", power: "150 л.с.",
    color: "Белый", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=480&fit=crop&auto=format",
    toKm: 800, totalKm: 45000,
  },
];

const JOURNAL = [
  { id: 1, car: "Toyota Camry", type: "maintenance", icon: Wrench, label: "ТО-90 000 км", date: "15 июн 2025", cost: 42000, place: "АвтоМастер", desc: "Замена масла 5W-30, масляный и воздушный фильтры, диагностика", ai: false },
  { id: 2, car: "Kia Sportage", type: "fuel", icon: Fuel, label: "Заправка", date: "12 июн 2025", cost: 12800, place: "KazMunaiGas", desc: "АИ-95, 47 л · 272 ₸/л", ai: false },
  { id: 3, car: "Toyota Camry", type: "repair", icon: Wrench, label: "Замена передних стоек", date: "2 мая 2025", cost: 68000, place: "СТО ПрофиСервис", desc: "Замена передних амортизаторов, балансировка колёс", ai: true },
  { id: 4, car: "Kia Sportage", type: "insurance", icon: Shield, label: "ОСАГО", date: "1 апр 2025", cost: 35200, place: "Халык Страхование", desc: "Полис до 01.04.2026", ai: false },
  { id: 5, car: "Toyota Camry", type: "fuel", icon: Fuel, label: "Заправка", date: "29 мар 2025", cost: 9600, place: "Shell", desc: "АИ-95, 36 л · 267 ₸/л", ai: false },
  { id: 6, car: "Kia Sportage", type: "maintenance", icon: Wrench, label: "ТО-40 000 км", date: "10 мар 2025", cost: 38500, place: "Kia Центр", desc: "Замена масла, свечей, тормозная жидкость", ai: false },
];

const RECS = [
  { id: 1, urgency: "urgent", title: "Тормозные колодки", car: "Kia Sportage", icon: AlertTriangle, reason: "По пробегу 43 200 км и данным о последней замене (1,5 года назад) — износ более 80%" },
  { id: 2, urgency: "soon", title: "Плановое ТО-45 000", car: "Kia Sportage", icon: Wrench, reason: "До планового ТО осталось ~800 км или 9 дней" },
  { id: 3, urgency: "soon", title: "Воздушный фильтр", car: "Toyota Camry", icon: Activity, reason: "18 месяцев с последней замены при норме 12–18 мес" },
  { id: 4, urgency: "future", title: "Проверка антифриза", car: "Toyota Camry", icon: Gauge, reason: "Рекомендуется каждые 2 года, следующий раз через 4 месяца" },
  { id: 5, urgency: "future", title: "Обновление ОСАГО", car: "Toyota Camry", icon: Shield, reason: "Текущий полис истекает 01.09.2025 (через 77 дней)" },
];

const EXPENSE_DATA = [
  { month: "Янв", camry: 12000, sportage: 8500 },
  { month: "Фев", camry: 9500, sportage: 14000 },
  { month: "Мар", camry: 41000, sportage: 48000 },
  { month: "Апр", camry: 11000, sportage: 45000 },
  { month: "Май", camry: 68000, sportage: 7800 },
  { month: "Июн", camry: 42000, sportage: 22000 },
];

const PIE_DATA = [
  { name: "ТО и ремонт", value: 155000, color: "#3F7DE8" },
  { name: "Топливо", value: 68400, color: "#5BB8F5" },
  { name: "Страховка", value: 35200, color: "#4CAF82" },
  { name: "Штрафы", value: 12000, color: "#E87A7A" },
  { name: "Прочее", value: 8600, color: "#9B7DE8" },
];

// ── utils ─────────────────────────────────────────────────────────────────────
function cn(...c: (string | false | undefined | null)[]) { return c.filter(Boolean).join(" "); }

function StatusBadge({ status }: { status: string }) {
  return status === "ok"
    ? <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle size={10} />Всё в порядке</span>
    : <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><AlertTriangle size={10} />Требует внимания</span>;
}

function AiBadge() {
  return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary"><Sparkles size={9} />ИИ</span>;
}

function UrgencyTag({ u }: { u: string }) {
  const s: Record<string, string> = { urgent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400", soon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", future: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" };
  const l: Record<string, string> = { urgent: "Срочно", soon: "Скоро", future: "На будущее" };
  return <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", s[u])}>{l[u]}</span>;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "cars", label: "Мои авто", icon: Car },
  { id: "journal", label: "Журнал", icon: BookOpen },
  { id: "recommendations", label: "Рекомендации", icon: Sparkles },
  { id: "reports", label: "Отчёты", icon: BarChart2 },
  { id: "references", label: "Справочники", icon: Library },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "settings", label: "Настройки", icon: Settings },
  { id: "marketplace", label: "Маркетплейс", icon: ShoppingBag },
];

function Sidebar({ page, setPage, dark, setDark, collapsed, setCollapsed }: {
  page: Page; setPage: (p: Page) => void;
  dark: boolean; setDark: (v: boolean) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-200 z-30 flex-shrink-0",
      collapsed ? "w-14" : "w-52"
    )}>
      <div className={cn("flex items-center gap-2.5 border-b border-sidebar-border h-14 px-4", collapsed && "justify-center px-0")}>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Car size={14} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-sidebar-foreground text-base tracking-tight">CarControl</span>}
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id as Page)}
              title={collapsed ? label : undefined}
              className={cn(
                "w-full flex items-center gap-3 text-sm transition-colors relative",
                collapsed ? "justify-center py-3" : "px-4 py-2.5",
                active ? "text-primary font-semibold bg-sidebar-accent" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}>
              {active && !collapsed && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-primary" />}
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span className="truncate flex-1 text-left">{label}</span>}
              {!collapsed && id === "marketplace" && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Скоро</span>}
              {!collapsed && id === "notifications" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />}
            </button>
          );
        })}
      </nav>

      <div className={cn("border-t border-sidebar-border py-2", collapsed && "flex flex-col items-center")}>
        <button onClick={() => setDark(!dark)}
          className={cn("flex items-center gap-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
            collapsed ? "justify-center w-10 h-10 rounded" : "w-full px-4 py-2.5")}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{dark ? "Светлая" : "Тёмная"}</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className={cn("flex items-center gap-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
            collapsed ? "justify-center w-10 h-10 rounded" : "w-full px-4 py-2.5")}>
          <Menu size={16} />
          {!collapsed && <span>Свернуть</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Mobile nav ────────────────────────────────────────────────────────────────
function MobileHeader({ page, setPage, dark, setDark, menuOpen, setMenuOpen }: {
  page: Page; setPage: (p: Page) => void; dark: boolean; setDark: (v: boolean) => void;
  menuOpen: boolean; setMenuOpen: (v: boolean) => void;
}) {
  return (
    <>
      <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border flex items-center px-4 h-14 gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Car size={13} className="text-white" />
        </div>
        <span className="font-bold text-foreground flex-1">CarControl</span>
        <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-accent transition-colors">
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Menu size={17} />
        </button>
      </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center px-4 h-14 border-b border-border bg-card">
            <span className="font-bold flex-1">Меню</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-accent"><X size={18} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setPage(id as Page); setMenuOpen(false); }}
                className={cn("w-full flex items-center gap-4 px-5 py-3.5 text-sm transition-colors",
                  page === id ? "text-primary font-semibold bg-accent" : "text-foreground/70 hover:bg-accent/50")}>
                <Icon size={19} />{label}
                {id === "marketplace" && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Скоро</span>}
              </button>
            ))}
          </nav>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex">
        {[
          { id: "dashboard", icon: LayoutDashboard },
          { id: "cars", icon: Car },
          { id: "journal", icon: BookOpen },
          { id: "recommendations", icon: Sparkles },
          { id: "reports", icon: BarChart2 },
        ].map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => setPage(id as Page)}
            className={cn("flex-1 flex flex-col items-center py-2.5 transition-colors",
              page === id ? "text-primary" : "text-muted-foreground")}>
            <Icon size={19} />
          </button>
        ))}
      </nav>
    </>
  );
}

// ── Add Record Modal ──────────────────────────────────────────────────────────
function AddRecordModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"voice" | "photo" | "manual">("voice");
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [photoUp, setPhotoUp] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-card rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-card-foreground">Добавить запись</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent"><X size={17} /></button>
        </div>

        <div className="flex gap-2 p-4 pb-0">
          {(["voice", "photo", "manual"] as const).map(id => {
            const conf = { voice: { l: "Голос", I: Mic }, photo: { l: "Фото чека", I: Camera }, manual: { l: "Вручную", I: PenLine } }[id];
            return (
              <button key={id} onClick={() => setTab(id)}
                className={cn("flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                  tab === id ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-transparent hover:border-border")}>
                <conf.I size={18} />{conf.l}
              </button>
            );
          })}
        </div>

        <div className="p-4 space-y-4">
          {tab === "voice" && !recorded && (
            <div className="flex flex-col items-center gap-5 py-6">
              <button onClick={() => { setRecording(true); setTimeout(() => { setRecording(false); setRecorded(true); }, 2500); }}
                className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg",
                  recording ? "bg-red-500 scale-110" : "bg-primary hover:scale-105")}>
                <Mic size={30} className="text-white" />
              </button>
              <p className="text-sm text-muted-foreground">{recording ? "Запись... говорите" : "Нажмите и расскажите о событии"}</p>
              {recording && (
                <div className="flex gap-1 items-end h-6">
                  {[3, 6, 4, 8, 5, 7, 4, 6, 3, 5].map((h, i) => (
                    <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 90}ms` }} />
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "voice" && recorded && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-muted border border-border">
                <p className="text-xs text-muted-foreground mb-1.5">Транскрипция</p>
                <p className="text-sm leading-relaxed">"Сегодня сделал ТО на Камри. Заменил масло и фильтры. Заплатил 42 000 тенге в АвтоМастере."</p>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">ИИ распознал</span>
                </div>
                {[["Тип", "ТО — Замена масла"], ["Сумма", "42 000 ₸"], ["Место", "АвтоМастер"], ["Авто", "Toyota Camry"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-semibold flex items-center gap-1.5">{v} <Check size={12} className="text-green-500" /></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "photo" && !photoUp && (
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setPhotoUp(true)}>
              <Camera size={30} className="text-muted-foreground" />
              <p className="font-semibold text-sm text-center">Загрузите фото чека</p>
              <p className="text-xs text-muted-foreground text-center">Перетащите файл или нажмите для выбора</p>
            </div>
          )}
          {tab === "photo" && photoUp && (
            <div className="space-y-3">
              <div className="rounded-xl bg-muted h-28 flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground"><FileText size={26} className="mx-auto mb-1 opacity-40" /><p className="text-xs">чек.jpg</p></div>
              </div>
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5"><Sparkles size={13} className="text-primary" /><span className="text-xs font-semibold text-primary">OCR</span></div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Распознано</span>
                </div>
                {[["СТО", "АвтоЛюкс, Алматы"], ["Дата", "15 июн 2025"], ["Сумма", "68 000 ₸"], ["Работы", "Подвеска, стойки"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "manual" && (
            <div className="space-y-3">
              {[["Тип события", "Выберите тип..."], ["Дата", "дд.мм.гггг"], ["Пробег (км)", "87 400"], ["Стоимость (₸)", "0"], ["СТО / Место", "Название..."], ["Комментарий", "Подробности..."]].map(([l, p]) => (
                <div key={l}>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">{l}</label>
                  <input placeholder={p} className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
              ))}
            </div>
          )}

          {saved
            ? <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold text-sm"><Check size={18} /> Запись сохранена!</div>
            : <button onClick={() => { setSaved(true); setTimeout(onClose, 1200); }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 active:scale-[.98] transition-all">
                Сохранить запись
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
function AiChat({ onClose }: { onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "ai", text: "Привет! Я ваш ИИ-помощник по обслуживанию авто. Спросите о состоянии автомобиля, предстоящих работах или расходах." }
  ]);
  const send = () => {
    if (!msg.trim()) return;
    const u = msg; setMsg("");
    setMsgs(m => [...m, { from: "user", text: u }]);
    setTimeout(() => setMsgs(m => [...m, { from: "ai", text: "Анализирую данные вашего гаража... По пробегу Kia Sportage (43 200 км) рекомендую проверить тормозные колодки и записаться на ТО в ближайшие 2 недели." }]), 800);
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 md:w-96 bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden" style={{ maxHeight: "460px" }}>
      <div className="flex items-center gap-2.5 px-4 py-3 bg-primary text-primary-foreground">
        <Sparkles size={16} />
        <span className="font-bold flex-1 text-sm">ИИ-помощник</span>
        <button onClick={onClose}><X size={16} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background" style={{ minHeight: "260px" }}>
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.from === "user" && "flex-row-reverse")}>
            {m.from === "ai" && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Sparkles size={11} className="text-primary-foreground" /></div>}
            <div className={cn("px-3 py-2 rounded-xl text-sm max-w-[82%] leading-relaxed",
              m.from === "ai" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground")}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3 border-t border-border bg-card">
        <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Написать..." className="flex-1 px-3 py-2 rounded-lg bg-input-background text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <button onClick={send} className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover:opacity-90">
          <Send size={13} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 rounded-2xl bg-primary p-5 text-primary-foreground flex flex-col gap-3">
          <p className="text-primary-foreground/70 text-sm">Гараж</p>
          <h2 className="text-2xl font-bold">Айдар Сейткали</h2>
          <div className="flex gap-4 text-sm text-primary-foreground/80 mt-auto">
            <span className="flex items-center gap-1.5"><Car size={14} />2 авто</span>
            <span className="flex items-center gap-1.5"><Activity size={14} />130 600 км</span>
          </div>
        </div>
        {[
          { label: "Расходы за июнь", value: "64 000 ₸", sub: "+12% к маю", icon: TrendingUp },
          { label: "Ближайшее ТО", value: "9 дней", sub: "Kia Sportage · 28 июл", icon: Clock },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={17} className="text-primary" />
            </div>
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-300 flex-1">
          <strong>Kia Sportage</strong> — плановое ТО через <strong>9 дней</strong> (28 июля). Рекомендуем записаться заранее.
        </p>
        <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:opacity-90 flex-shrink-0">Записаться</button>
      </div>

      <div>
        <h3 className="font-bold text-foreground mb-3">Мои автомобили</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARS.map(car => <CarCard key={car.id} car={car} />)}
          <div className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 p-8 cursor-pointer hover:border-primary hover:bg-accent/30 transition-all min-h-[160px]">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center"><Plus size={22} className="text-primary" /></div>
            <p className="font-semibold text-sm text-foreground">Добавить автомобиль</p>
            <p className="text-xs text-muted-foreground">По VIN или госномеру</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-primary" />
          <h3 className="font-bold text-foreground">Рекомендации ИИ</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RECS.slice(0, 3).map(r => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-4 space-y-2 hover:shadow-sm transition-shadow">
              <UrgencyTag u={r.urgency} />
              <p className="font-semibold text-sm text-card-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.car}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-foreground mb-3">Добавить запись</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={onAdd} className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 active:scale-[.97] transition-all">
            <Mic size={20} />Голосом
          </button>
          <button onClick={onAdd} className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-sm bg-blue-400 text-white hover:opacity-90 active:scale-[.97] transition-all">
            <Camera size={20} />По фото
          </button>
          <button onClick={onAdd} className="flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-sm bg-muted text-foreground border border-border hover:opacity-90 active:scale-[.97] transition-all">
            <PenLine size={20} />Вручную
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-card-foreground mb-4">Расходы за 6 месяцев</h3>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={EXPENSE_DATA} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.07} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [`${v.toLocaleString()} ₸`]} />
            <Bar dataKey="camry" name="Toyota Camry" fill="#3F7DE8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="sportage" name="Kia Sportage" fill="#5BB8F5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Car Card ──────────────────────────────────────────────────────────────────
function CarCard({ car, onClick }: { car: typeof CARS[0]; onClick?: () => void }) {
  const pct = Math.max(5, Math.min(100, Math.round((1 - car.toKm / 10000) * 100)));
  return (
    <div onClick={onClick} className="bg-card rounded-2xl border border-border overflow-hidden group cursor-pointer hover:shadow-md transition-all">
      <div className="relative h-44 overflow-hidden bg-muted">
        <img src={car.img} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-white font-bold text-lg leading-tight">{car.name} {car.year}</p>
            <p className="text-white/70 text-sm">{car.plate}</p>
          </div>
          <StatusBadge status={car.status} />
        </div>
      </div>

      {/* specs — 2-col grid like auto.ru */}
      <div className="grid grid-cols-2 border-t border-border divide-x divide-border">
        {[
          [car.vin.slice(-8), "VIN"],
          [car.engine, "Двигатель"],
          [`${car.mileage.toLocaleString()} км`, "Пробег"],
          [car.color, "Цвет"],
        ].map(([val, lbl], i) => (
          <div key={lbl} className={cn("px-4 py-2.5", i >= 2 && "border-t border-border")}>
            <p className="font-semibold text-sm text-card-foreground truncate">{val}</p>
            <p className="text-xs text-primary mt-0.5">{lbl}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="text-muted-foreground">ТО через</span>
          <span className="font-bold text-foreground">{car.toKm.toLocaleString()} км</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", car.toKm < 2000 ? "bg-amber-400" : "bg-green-400")} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// ── Car Profile ───────────────────────────────────────────────────────────────
function CarProfile({ car, onBack }: { car: typeof CARS[0]; onBack: () => void }) {
  const [tab, setTab] = useState("overview");
  const carJournal = JOURNAL.filter(j => j.car === car.name);
  const systems = [
    { name: "Двигатель", pct: 85 },
    { name: "Тормоза", pct: car.id === 2 ? 42 : 80 },
    { name: "Подвеска", pct: 70 },
    { name: "Кузов", pct: 90 },
    { name: "Электрика", pct: 78 },
  ];

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight size={15} className="rotate-180" />Мои авто
      </button>

      {/* auto.ru style card: photo + specs side by side */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="md:flex">
          <div className="md:w-[55%] relative bg-muted">
            <img src={car.img} alt={car.name} className="w-full h-52 md:h-full object-cover" />
            <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-card/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white transition-colors">
              <Edit2 size={14} className="text-foreground" />
            </button>
          </div>
          <div className="md:w-[45%] p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{car.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={car.status} />
                <span className="text-sm text-muted-foreground">{car.year}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {([
                [car.vin, "VIN", Car],
                [car.power, "Мощность", Zap],
                [car.engine, "Двигатель", Activity],
                [String(car.year), "Год выпуска", Calendar],
                [car.color, "Цвет", Gauge],
                [`${car.mileage.toLocaleString()} км`, "Пробег", TrendingUp],
              ] as [string, string, React.ElementType][]).map(([val, lbl, Icon]) => (
                <div key={lbl} className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground leading-tight truncate">{val}</p>
                    <p className="text-[11px] text-primary">{lbl}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 hover:bg-accent transition-colors self-start">
              Все параметры <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* view toggle */}
      <div className="flex gap-2 flex-wrap">
        {[["Фото", true], ["Схема повреждений", false], ["360° (скоро)", false]].map(([l, active]) => (
          <button key={l as string} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
            active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed")}>{l as string}</button>
        ))}
      </div>

      {/* tabs */}
      <div className="flex border-b border-border">
        {[["overview", "Состояние"], ["history", "История обслуживания"], ["docs", "Документы"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px",
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {l}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-bold text-card-foreground">История обслуживания</h3>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-xs text-muted-foreground">ТО через</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{car.toKm.toLocaleString()} км</p>
              <div className="mt-3 h-2.5 bg-background rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", car.toKm < 2000 ? "bg-amber-400" : "bg-green-400")}
                  style={{ width: `${Math.max(5, Math.round((1 - car.toKm / 10000) * 100))}%` }} />
              </div>
              <div className="flex items-center gap-4 mt-3">
                {([Wrench, Camera, FileText, BookOpen] as React.ElementType[]).map((Icon, i) => (
                  <Icon key={i} size={16} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                ))}
                <span className="text-xs text-muted-foreground">+{carJournal.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-bold text-card-foreground">Системы авто</h3>
            {systems.map(({ name, pct }) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{name}</span>
                  <span className={cn("font-semibold text-xs", pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500")}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", pct >= 70 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400")} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors pt-1">
              <Camera size={13} /> Оценить состояние по фото
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">скоро</span>
            </button>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {carJournal.map(evt => (
            <div key={evt.id} className="bg-card rounded-xl border border-border p-4 flex gap-3 hover:shadow-sm transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <evt.icon size={15} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-card-foreground">{evt.label}</p>
                  {evt.ai && <AiBadge />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{evt.date} · {evt.place}</p>
                <p className="text-xs text-foreground/60 mt-0.5 truncate">{evt.desc}</p>
              </div>
              <p className="font-bold text-sm text-card-foreground flex-shrink-0">{evt.cost.toLocaleString()} ₸</p>
            </div>
          ))}
        </div>
      )}

      {tab === "docs" && (
        <div className="grid grid-cols-2 gap-3">
          {([
            ["Техпаспорт", FileText, "ok", ""],
            ["Страховка ОСАГО", Shield, "ok", "до 01.04.2026"],
            ["Диагностическая карта", Activity, "warn", "до 28.07.2025"],
            ["Сервисная книжка", BookOpen, "ok", ""],
          ] as [string, React.ElementType, string, string][]).map(([n, Icon, s, exp]) => (
            <div key={n} className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-sm transition-shadow">
              <Icon size={22} className={s === "ok" ? "text-primary" : "text-amber-500"} />
              <p className="text-sm font-semibold text-card-foreground mt-2 leading-tight">{n}</p>
              {exp && <p className="text-xs text-muted-foreground mt-1">{exp}</p>}
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded mt-2 inline-block",
                s === "ok" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                {s === "ok" ? "Актуально" : "Обновить"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cars page ─────────────────────────────────────────────────────────────────
function CarsPage() {
  const [sel, setSel] = useState<typeof CARS[0] | null>(null);
  if (sel) return <CarProfile car={sel} onBack={() => setSel(null)} />;
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* auto.ru-style car switcher tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CARS.map(c => (
          <button key={c.id} onClick={() => setSel(c)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-sm transition-all flex-shrink-0 group">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.vin.slice(-8)}</p>
            </div>
          </button>
        ))}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:text-primary text-muted-foreground text-sm font-semibold transition-all flex-shrink-0">
          <Plus size={16} /> Добавить машину
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARS.map(car => <CarCard key={car.id} car={car} onClick={() => setSel(car)} />)}
      </div>
    </div>
  );
}

// ── Journal ───────────────────────────────────────────────────────────────────
function JournalPage({ onAdd }: { onAdd: () => void }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? JOURNAL : JOURNAL.filter(j => j.type === filter);
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Журнал</h2>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={15} /> Запись
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[["all", "Все"], ["maintenance", "ТО"], ["fuel", "Топливо"], ["repair", "Ремонт"], ["insurance", "Страховка"]].map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)}
            className={cn("px-3 py-1.5 rounded-lg text-sm font-semibold flex-shrink-0 transition-colors",
              filter === id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-primary hover:text-primary")}>
            {l}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(evt => (
          <div key={evt.id} className="bg-card rounded-xl border border-border p-4 flex gap-3 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <evt.icon size={17} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm text-card-foreground">{evt.label}</p>
                {evt.ai && <AiBadge />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{evt.date} · {evt.car} · {evt.place}</p>
              <p className="text-xs text-foreground/60 mt-0.5 truncate">{evt.desc}</p>
            </div>
            <p className="font-bold text-sm text-card-foreground flex-shrink-0">{evt.cost.toLocaleString()} ₸</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recommendations ───────────────────────────────────────────────────────────
function RecommendationsPage() {
  const [done, setDone] = useState<number[]>([]);
  const [skipped, setSkipped] = useState<number[]>([]);
  const visible = RECS.filter(r => !done.includes(r.id) && !skipped.includes(r.id));
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">Рекомендации ИИ</h2>
      </div>
      {(["urgent", "soon", "future"] as const).map(group => {
        const items = visible.filter(r => r.urgency === group);
        if (!items.length) return null;
        return (
          <div key={group} className="space-y-3">
            <div className="flex items-center gap-2"><UrgencyTag u={group} /><span className="text-xs text-muted-foreground">{items.length}</span></div>
            {items.map(r => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <r.icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-card-foreground">{r.title}</p>
                    <p className="text-xs text-primary mt-0.5">{r.car}</p>
                    <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-lg bg-muted">
                      <Sparkles size={11} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90">Записаться на СТО</button>
                  <button onClick={() => setDone(d => [...d, r.id])} className="px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-xs font-semibold">Выполнено</button>
                  <button onClick={() => setSkipped(s => [...s, r.id])} className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-semibold">Отложить</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────
function ReportsPage() {
  const total = PIE_DATA.reduce((a, b) => a + b.value, 0);
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Отчёты</h2>
        <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
          <Download size={14} /> PDF
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[["Всего расходов", `${Math.round(total / 1000)}k ₸`], ["На 1 000 км", "3 200 ₸"], ["Событий", "24"]].map(([l, v]) => (
          <div key={l} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-lg font-bold text-foreground">{v}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-card-foreground mb-4">Расходы по категориям</h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ResponsiveContainer width={180} height={160}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={44} outerRadius={72} paddingAngle={3}>
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2 w-full">
            {PIE_DATA.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="flex-1 text-foreground">{name}</span>
                <span className="font-semibold">{value.toLocaleString()} ₸</span>
                <span className="text-xs text-muted-foreground w-9 text-right">{Math.round(value / total * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-card-foreground mb-4">Динамика по месяцам</h3>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={EXPENSE_DATA}>
            <defs>
              {[["g1", "#3F7DE8"], ["g2", "#5BB8F5"]].map(([id, color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.07} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip formatter={(v: number) => [`${v.toLocaleString()} ₸`]} />
            <Area type="monotone" dataKey="camry" name="Toyota Camry" stroke="#3F7DE8" fill="url(#g1)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="sportage" name="Kia Sportage" stroke="#5BB8F5" fill="url(#g2)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── References ────────────────────────────────────────────────────────────────
function ReferencesPage() {
  const [q, setQ] = useState("");
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <h2 className="text-xl font-bold text-foreground">Справочники</h2>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск по марке, модели, работе..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {([
          ["Регламенты ТО", "Интервалы замены масла, фильтров, ремней по марке и модели", Wrench, "120+ марок"],
          ["База СТО", "Проверенные сервисы Алматы с рейтингом и ценами", MapPin, "340 СТО"],
          ["Типовые работы и цены", "Ориентировочная стоимость работ по регионам Казахстана", TrendingUp, "500+ работ"],
          ["База знаний", "FAQ и статьи по обслуживанию и эксплуатации авто", BookOpen, "80 статей"],
        ] as [string, string, React.ElementType, string][]).map(([t, d, Icon, c]) => (
          <div key={t} className="bg-card rounded-xl border border-border p-5 flex gap-4 cursor-pointer hover:shadow-sm hover:border-primary/40 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
              <Icon size={20} className="text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="font-bold text-card-foreground text-sm">{t}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d}</p>
              <p className="text-xs text-primary font-semibold mt-2">{c}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Топ СТО в Алматы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([["АвтоМастер", "Ходовая, ТО", 4.8, "от 5 000 ₸"], ["ПрофиСервис", "Двигатель, АКПП", 4.6, "от 8 000 ₸"], ["АвтоЛюкс", "Кузов, покраска", 4.5, "от 12 000 ₸"]] as [string, string, number, string][]).map(([n, s, r, p]) => (
            <div key={n} className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <p className="font-bold text-sm text-card-foreground">{n}</p>
                <div className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /><span className="text-xs font-semibold text-foreground">{r}</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{s}</p>
              <p className="text-sm font-semibold text-primary mt-2">{p}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90">Записаться</button>
                <button className="px-3 py-1.5 bg-muted rounded-lg text-xs hover:bg-accent transition-colors"><Phone size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
const NOTIFS = [
  { id: 1, type: "urgent", title: "Техосмотр истекает через 9 дней", body: "Kia Sportage — обновите ТО до 28 июля", time: "2ч назад", read: false },
  { id: 2, type: "ai", title: "ИИ: износ тормозных колодок", body: "На основе пробега выявлен критический износ", time: "5ч назад", read: false },
  { id: 3, type: "info", title: "Запись добавлена", body: "ТО-90 000 для Toyota Camry успешно сохранено", time: "2д назад", read: true },
  { id: 4, type: "info", title: "Подписка активна", body: "Расширенный план активен до 01.01.2026", time: "5д назад", read: true },
];

function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFS);
  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Уведомления</h2>
        <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} className="text-sm text-primary font-semibold">Прочитать все</button>
      </div>
      <div className="space-y-2">
        {notifs.map(n => {
          const Icon = n.type === "urgent" ? AlertTriangle : n.type === "ai" ? Sparkles : Bell;
          const col = n.type === "urgent" ? "text-red-500" : n.type === "ai" ? "text-primary" : "text-blue-500";
          return (
            <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={cn("bg-card rounded-xl border border-border p-4 flex gap-3 cursor-pointer hover:shadow-sm transition-all", n.read && "opacity-55")}>
              <div className={cn("w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0", col)}><Icon size={16} /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsPage({
  dark,
  setDark,
  user,
  onLogout,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
  user: AuthUser;
  onLogout: () => void;
}) {
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <h2 className="text-xl font-bold text-foreground">Настройки</h2>
      <div className="bg-card rounded-2xl border border-border p-5 flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">{user.avatar}</div>
        <div>
          <p className="font-bold text-card-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mt-1 inline-block">{user.plan}</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-bold text-card-foreground">Тема оформления</h3>
        <div className="flex gap-3">
          {([[Sun, "Светлая", false], [Moon, "Тёмная", true]] as [React.ElementType, string, boolean][]).map(([Icon, l, val]) => (
            <button key={l} onClick={() => setDark(val)}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all",
                dark === val ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-muted-foreground hover:border-primary")}>
              <Icon size={15} />{l}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <h3 className="font-bold text-card-foreground">Интеграции</h3>
        {([
          ["Telegram-бот", "Голосовые записи и уведомления", MessageSquare, true],
          ["Google Календарь", "Синхронизация напоминаний", Calendar, false],
          ["Apple Календарь", "Напоминания в iCloud", Calendar, false],
        ] as [string, string, React.ElementType, boolean][]).map(([n, d, Icon, conn]) => (
          <div key={n} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-primary" /></div>
            <div className="flex-1"><p className="text-sm font-semibold text-foreground">{n}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            <button className={cn("px-3 py-1.5 rounded-lg text-xs font-bold",
              conn ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:opacity-90")}>
              {conn ? "Подключено" : "Подключить"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
        <h3 className="font-bold text-card-foreground">Уведомления</h3>
        {["Напоминания о ТО", "Истечение документов", "ИИ-рекомендации", "Штрафы"].map(l => (
          <div key={l} className="flex items-center justify-between py-0.5">
            <p className="text-sm text-foreground">{l}</p>
            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer flex items-center px-0.5">
              <div className="w-4 h-4 bg-white rounded-full shadow ml-auto" />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        <LogOut size={15} /> Выйти
      </button>
    </div>
  );
}

// ── Marketplace ───────────────────────────────────────────────────────────────
function MarketplacePage() {
  return (
    <div className="space-y-5 pb-20 md:pb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-foreground">Маркетплейс</h2>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">В разработке</span>
      </div>
      <div className="bg-gradient-to-br from-primary/10 to-blue-300/10 rounded-2xl border border-primary/20 p-6 text-center">
        <Award size={30} className="text-primary mx-auto mb-2" />
        <p className="font-bold text-foreground">Экосистема сервисов — скоро</p>
        <p className="text-sm text-muted-foreground mt-1">Запись на СТО, подбор запчастей, страховка и зарядные станции</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {([
          ["Запись на СТО", Wrench, false],
          ["Подбор запчастей", Settings, true],
          ["Аренда авто", Car, true],
          ["Зарядные EV", BatteryCharging, true],
          ["Страховка онлайн", Shield, false],
          ["AI-оценка кузова", Camera, true],
        ] as [string, React.ElementType, boolean][]).map(([t, Icon, soon]) => (
          <div key={t} className={cn("bg-card rounded-xl border border-border p-4 flex flex-col gap-2.5",
            soon ? "opacity-55 cursor-not-allowed" : "hover:shadow-sm cursor-pointer hover:border-primary/40 transition-all")}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-card-foreground leading-tight">{t}</p>
              {soon && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">скоро</span>}
            </div>
            {!soon && <button className="mt-auto py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90">Открыть</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
// React is needed for JSX but imported implicitly via the transform
declare namespace React { type ElementType = any; }

type AuthUser = {
  name: string;
  email: string;
  role: string;
  plan: string;
  avatar: string;
};

const DEMO_USER: AuthUser = {
  name: "Айдар Сейткали",
  email: "admin@carcontrol.kz",
  role: "Администратор",
  plan: "Расширенный план",
  avatar: "АС",
};

const AUTH_KEY = "carcontrol-auth-user";

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

function AuthScreen({
  onLogin,
  onBack,
}: {
  onLogin: (user: AuthUser) => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const buildUserFromSupabase = (userData: { email?: string | null; user_metadata?: { full_name?: string | null; name?: string | null } | null }) => ({
    name: userData.user_metadata?.full_name || userData.user_metadata?.name || userData.email?.split("@")[0] || "Пользователь",
    email: userData.email || "",
    role: "Пользователь",
    plan: "Base",
    avatar: (userData.user_metadata?.full_name || userData.email || "U").slice(0, 2).toUpperCase(),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();
    const emailIsValid = validateEmail(normalizedEmail);

    if (!emailIsValid) {
      setError("Введите корректный email адрес.");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов.");
      return;
    }

    if (mode === "register" && fullName.trim().length < 2) {
      setError("Укажите имя и фамилию для регистрации.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const { data, error: signUpError } = await signUpWithEmail(normalizedEmail, password, fullName.trim());

        if (signUpError) {
          throw signUpError;
        }

        if (data.user && data.session) {
          onLogin(buildUserFromSupabase(data.user));
          return;
        }

        setSuccess("Регистрация создана. Проверьте email для подтверждения и затем войдите в аккаунт.");
        setMode("login");
        setPassword("");
      } else {
        const { data, error: signInError } = await signInWithEmail(normalizedEmail, password);

        if (signInError) {
          throw signInError;
        }

        if (!data.user) {
          throw new Error("Пользователь не найден.");
        }

        onLogin(buildUserFromSupabase(data.user));
      }
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Не удалось выполнить вход.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(63,125,232,0.18),_transparent_45%),linear-gradient(180deg,#eef4ff_0%,#f4f7fb_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(63,125,232,0.14),_transparent_35%),linear-gradient(180deg,#09131f_0%,#0b1725_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-between bg-primary p-8 text-primary-foreground">
            <div>
              <button
                type="button"
                onClick={onBack}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground/90 transition hover:bg-white/15"
              >
                <ChevronRight size={14} className="rotate-180" />
                На главную
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Car size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">CarControl</p>
                  <p className="text-xl font-bold">Личный кабинет</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-primary-foreground/80">Управление гаражом</p>
                  <h1 className="mt-2 text-4xl font-black leading-tight">Контроль авто, ТО, расходов и ИИ-подсказок.</h1>
                </div>
                <p className="max-w-md text-base text-primary-foreground/80">
                  Следите за пробегом, расходами, рекомендациями и сервисной историей в одном месте.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-primary-foreground/85">
              {[
                "Гараж и состояние авто",
                "ТО и история расходов",
                "ИИ-рекомендации и напоминания",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2.5">
                  <CheckCircle size={18} className="text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{mode === "login" ? "Вход" : "Регистрация"}</p>
                <h2 className="mt-2 text-2xl font-black text-foreground">{mode === "login" ? "Добро пожаловать" : "Создайте аккаунт"}</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Shield size={20} />
              </div>
            </div>

            <div className="mb-5 inline-flex w-full rounded-xl bg-muted p-1">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setMode(tab);
                    setError("");
                    setSuccess("");
                  }}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    mode === tab ? "bg-white text-foreground shadow-sm dark:bg-slate-800" : "text-muted-foreground"
                  )}
                >
                  {tab === "login" ? "Войти" : "Регистрация"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Имя</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-xl border border-border bg-input-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Алексей Иванов"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Пароль</label>
                <input
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (mode === "login" ? "Входим…" : "Создаём аккаунт…") : mode === "login" ? "Войти в кабинет" : "Создать аккаунт"}
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Подключение к Supabase</p>
              <div className="space-y-2 text-sm text-foreground">
                <p>После регистрации пользователь создается в Auth и profile.</p>
                <p>Используется email validation и secure auth flow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const [addOpen, setAddOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const titles: Record<Page, string> = {
    dashboard: "Дашборд", cars: "Гараж", journal: "Журнал",
    recommendations: "Рекомендации", reports: "Отчёты", references: "Справочники",
    notifications: "Уведомления", settings: "Настройки", marketplace: "Маркетплейс",
  };

  return (
    <div className={dark ? "dark" : ""} style={{ fontFamily: "'Nunito', 'Inter', sans-serif" }}>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar page={page} setPage={setPage} dark={dark} setDark={setDark}
          collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1 flex flex-col min-w-0">
          <MobileHeader page={page} setPage={setPage} dark={dark} setDark={setDark}
            menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <div className="hidden md:flex items-center justify-between px-6 h-14 border-b border-border bg-card sticky top-0 z-20">
            <h1 className="font-bold text-foreground">{titles[page]}</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
                <Plus size={15} /> Добавить запись
              </button>
              <button onClick={() => setChatOpen(!chatOpen)}
                className="relative w-9 h-9 rounded-xl bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors">
                <MessageSquare size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles size={9} className="text-primary-foreground" />
                </span>
              </button>
            </div>
          </div>

          <main className="flex-1 px-4 md:px-6 py-4 md:py-5 overflow-y-auto">
            {page === "dashboard" && <Dashboard onAdd={() => setAddOpen(true)} />}
            {page === "cars" && <CarsPage />}
            {page === "journal" && <JournalPage onAdd={() => setAddOpen(true)} />}
            {page === "recommendations" && <RecommendationsPage />}
            {page === "reports" && <ReportsPage />}
            {page === "references" && <ReferencesPage />}
            {page === "notifications" && <NotificationsPage />}
            {page === "settings" && <SettingsPage dark={dark} setDark={setDark} user={user} onLogout={onLogout} />}
            {page === "marketplace" && <MarketplacePage />}
          </main>
        </div>

        <div className="md:hidden fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2">
          <button onClick={() => setChatOpen(!chatOpen)} className="w-11 h-11 bg-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90">
            <Sparkles size={18} className="text-primary-foreground" />
          </button>
          <button onClick={() => setAddOpen(true)} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:opacity-90">
            <Plus size={22} className="text-primary-foreground" />
          </button>
        </div>

        {addOpen && <AddRecordModal onClose={() => setAddOpen(false)} />}
        {chatOpen && <AiChat onClose={() => setChatOpen(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [screen, setScreen] = useState<"landing" | "auth" | "app">("landing");

  const mapSupabaseUser = (supabaseUser: { email?: string | null; user_metadata?: { full_name?: string | null; name?: string | null } | null }) => ({
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Пользователь",
    email: supabaseUser.email || "",
    role: "Пользователь",
    plan: "Base",
    avatar: (supabaseUser.user_metadata?.full_name || supabaseUser.email || "U").slice(0, 2).toUpperCase(),
  });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setScreen("app");
      return;
    }

    if (!supabase) {
      setScreen("auth");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user;
      if (currentUser) {
        setUser(mapSupabaseUser(currentUser));
        setScreen("app");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setScreen("app");
      } else {
        setUser(null);
        setScreen("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setScreen("app");
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOutFromSupabase();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setScreen("landing");
    }
  };

  if (screen === "landing") {
    return <LandingPage onEnterCabinet={() => setScreen("auth")} />;
  }

  if (screen === "auth") {
    return <AuthScreen onLogin={setUser} onBack={() => setScreen("landing")} />;
  }

  return <AuthenticatedApp user={user as AuthUser} onLogout={handleLogout} />;
}
