import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Gauge, Car, Bell, BarChart3, Smartphone } from "lucide-react";

export default function LandingPage({
  onEnterCabinet,
}: {
  onEnterCabinet: () => void;
}) {
  const features = [
    { title: "Авто-учёт", text: "Пробег, ТО, расходы, страховка и сервисная история в одном месте.", icon: Gauge },
    { title: "ИИ-подсказки", text: "Сервисные рекомендации до проблем — ещё до первого сигнала о поломке.", icon: Sparkles },
    { title: "Мобильный кабинет", text: "Оптимизировано под смартфон: быстро открыть, проверить и действовать.", icon: Smartphone },
    { title: "Уведомления", text: "Напоминания о ТО, страховании, штрафах и новом статусе по авто.", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Car size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">CarControl</p>
            <p className="text-sm font-bold">Smart vehicle hub</p>
          </div>
        </div>

        <button
          onClick={onEnterCabinet}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Войти в кабинет
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 px-6 py-10 shadow-2xl md:grid-cols-2 md:px-10 md:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <ShieldCheck size={14} />
              Автомобильный сервис для владельцев и бизнеса
            </div>

            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Управляйте авто, расходами и страхованием без хаоса.
            </h1>

            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              CarControl помогает владельцам и компаниям отслеживать техническое состояние авто, диагностику, расходы, ТО и рекомендации — всё в одном личном кабинете.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onEnterCabinet}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Перейти в кабинет
                <ArrowRight size={16} />
              </button>
              <button className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                Узнать больше
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              {[
                "Поддержка до 2 авто",
                "AI-рекомендации",
                "Мобильная версия",
              ].map((tag) => (
                <div key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-4 h-32 w-32 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl">
              <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Гараж</p>
                    <p className="text-lg font-bold text-white">Ваш профиль</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">Всё в порядке</div>
                </div>

                <div className="space-y-3">
                  {[
                    ["Toyota Camry", "ТО через 12 000 км"],
                    ["Kia Sportage", "Плановое ТО через 9 дней"],
                    ["Расходы за месяц", "64 000 ₸"],
                  ].map(([title, value]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-slate-700/60 p-3">
                      <p className="text-xs text-slate-400">{title}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Почему это удобно</p>
            <h2 className="mt-3 text-3xl font-black text-white">Всё, что нужно для спокойного владения авто</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[30px] border border-white/10 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Как работает</p>
              <h3 className="mt-3 text-3xl font-black text-white">Профиль владельца, сервис и AI в одном потоке</h3>
            </div>

            <div className="space-y-4">
              {[
                "Создайте аккаунт и подтвердите email",
                "Подключите автомобиль и сервисную историю",
                "Следите за статусом, рекомендациями, расходами и ТО",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</div>
                  <p className="text-sm text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 pb-8 text-center">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-blue-500/20 bg-slate-900 p-8 shadow-2xl">
            <CheckCircle2 size={42} className="mx-auto text-primary" />
            <h3 className="mt-4 text-3xl font-black text-white">Готовы в личный кабинет?</h3>
            <p className="mt-3 text-slate-300">Супабейс, email-валидация и безопасная авторизация уже заложены в архитектуру проекта.</p>
            <button
              onClick={onEnterCabinet}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Открыть кабинет
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
