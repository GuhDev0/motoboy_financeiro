"use client";
import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import "./dashboard.css";

/* ── TIPOS ───────────────────────────────── */
type Gain = {
  id: number;
  value: number;
  date: string;
  platform: string;
};

type Expense = {
  id: number;
  value: number;
  date: string;
  category: string;
};

type WeekSummary = {
  week: number;
  label: string;
  range: string;
  gains: number;
  expenses: number;
  balance: number;
  platforms: string[];
  pct: number;
};

/* ── HELPERS ─────────────────────────────── */
function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getWeekNumber(dateStr: string): number {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

function getWeekRange(weekNum: number, year: number): string {
  const jan1 = new Date(year, 0, 1);
  const startDay = new Date(jan1.getTime() + (weekNum - 1) * 7 * 86400000);
  const endDay   = new Date(startDay.getTime() + 6 * 86400000);
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return `${fmt(startDay)} – ${fmt(endDay)}`;
}

function buildWeekSummaries(gains: Gain[], expenses: Expense[]): WeekSummary[] {
  const year = new Date().getFullYear();
  const map = new Map<number, WeekSummary>();

  gains.forEach((g) => {
    const w = getWeekNumber(g.date);
    if (!map.has(w)) {
      map.set(w, {
        week: w,
        label: `Semana ${w}`,
        range: getWeekRange(w, year),
        gains: 0, expenses: 0, balance: 0,
        platforms: [], pct: 0,
      });
    }
    const entry = map.get(w)!;
    entry.gains += g.value;
    if (!entry.platforms.includes(g.platform)) entry.platforms.push(g.platform);
  });

  expenses.forEach((e) => {
    const w = getWeekNumber(e.date);
    if (!map.has(w)) {
      map.set(w, {
        week: w,
        label: `Semana ${w}`,
        range: getWeekRange(w, year),
        gains: 0, expenses: 0, balance: 0,
        platforms: [], pct: 0,
      });
    }
    map.get(w)!.expenses += e.value;
  });

  const rows = Array.from(map.values())
    .sort((a, b) => b.week - a.week)
    .slice(0, 8);

  const maxGain = Math.max(...rows.map((r) => r.gains), 1);
  rows.forEach((r) => {
    r.balance = r.gains - r.expenses;
    r.pct = Math.round((r.gains / maxGain) * 100);
  });

  return rows;
}

/* ── COMPONENTE ──────────────────────────── */
export default function DashBoard() {
  const [gains, setGains]       = useState<Gain[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [gRes, eRes] = await Promise.all([
          api.get("/gain"),
          api.get("/expense"),
        ]);
        setGains(gRes.data.gains ?? []);
        setExpenses(eRes.data.expenses ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── CÁLCULOS ──────────────────────────── */
  const totalGains    = gains.reduce((s, g) => s + g.value, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.value, 0);
  const netBalance    = totalGains - totalExpenses;
  const totalTrips    = gains.length;

  const weeks = buildWeekSummaries(gains, expenses);
  const totWeekGains    = weeks.reduce((s, w) => s + w.gains, 0);
  const totWeekExpenses = weeks.reduce((s, w) => s + w.expenses, 0);
  const totWeekBalance  = totWeekGains - totWeekExpenses;

  /* Ganhos por plataforma */
  const byPlatform = gains.reduce<Record<string, number>>((acc, g) => {
    acc[g.platform] = (acc[g.platform] ?? 0) + g.value;
    return acc;
  }, {});
  const platformMax = Math.max(...Object.values(byPlatform), 1);

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  if (loading) {
    return (
      <div className="dashboard" style={{ alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--c-text-muted)", fontFamily: "var(--font-display)" }}>
          Carregando dados…
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ── HEADER ── */}
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">
            Olá, <span>MotoBoy</span> 👋
          </h1>
          <p className="dashboard__subtitle">Aqui está o resumo da sua operação financeira</p>
        </div>
        <div className="dashboard__date">📅 {today}</div>
      </div>

      {/* ── MÉTRICAS ── */}
      <div className="dashboard__metrics">
        <div className="metric-card metric-card--gain">
          <div className="metric-card__top">
            <span className="metric-card__label">Total Ganhos</span>
            <div className="metric-card__icon">💰</div>
          </div>
          <div className="metric-card__value">{formatBRL(totalGains)}</div>
          <span className="metric-card__delta metric-card__delta--up">↑ acumulado</span>
        </div>

        <div className="metric-card metric-card--expense">
          <div className="metric-card__top">
            <span className="metric-card__label">Total Despesas</span>
            <div className="metric-card__icon">💸</div>
          </div>
          <div className="metric-card__value">{formatBRL(totalExpenses)}</div>
          <span className="metric-card__delta metric-card__delta--down">↓ acumulado</span>
        </div>

        <div className={`metric-card metric-card--${netBalance >= 0 ? "primary" : "expense"}`}>
          <div className="metric-card__top">
            <span className="metric-card__label">Saldo Líquido</span>
            <div className="metric-card__icon">⚖️</div>
          </div>
          <div className="metric-card__value">{formatBRL(netBalance)}</div>
          <span className={`metric-card__delta metric-card__delta--${netBalance >= 0 ? "up" : "down"}`}>
            {netBalance >= 0 ? "↑ positivo" : "↓ negativo"}
          </span>
        </div>

        <div className="metric-card metric-card--accent">
          <div className="metric-card__top">
            <span className="metric-card__label">Corridas / Entregas</span>
            <div className="metric-card__icon">🛵</div>
          </div>
          <div className="metric-card__value">{totalTrips}</div>
          <span className="metric-card__delta metric-card__delta--up">↑ registros</span>
        </div>
      </div>

      {/* ── MID: GRÁFICO + RESUMO ── */}
      <div className="dashboard__mid">

        {/* Gráfico por plataforma */}
        <div className="card">
          <div className="card__header">
            <span className="card__title">Ganhos por Plataforma</span>
            <span className="card__badge">{Object.keys(byPlatform).length} plataformas</span>
          </div>
          <div className="card__body">
            {Object.keys(byPlatform).length === 0 ? (
              <p style={{ color: "var(--c-text-muted)", fontSize: "var(--text-sm)" }}>
                Nenhum dado encontrado.
              </p>
            ) : (
              <div className="bar-chart">
                {Object.entries(byPlatform)
                  .sort((a, b) => b[1] - a[1])
                  .map(([plat, val]) => (
                    <div className="bar-chart__row" key={plat}>
                      <span className="bar-chart__label">{plat}</span>
                      <div className="bar-chart__track">
                        <div
                          className="bar-chart__fill bar-chart__fill--gain"
                          style={{ width: `${Math.round((val / platformMax) * 100)}%` }}
                        />
                      </div>
                      <span className="bar-chart__value">{formatBRL(val)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo rápido */}
        <div className="card">
          <div className="card__header">
            <span className="card__title">Resumo Geral</span>
          </div>
          <div className="card__body">
            <div className="quick-summary">
              <div className="quick-summary__item">
                <div className="quick-summary__dot quick-summary__dot--gain" />
                <div className="quick-summary__info">
                  <div className="quick-summary__name">Total Ganhos</div>
                  <div className="quick-summary__amount quick-summary__amount--gain">
                    {formatBRL(totalGains)}
                  </div>
                </div>
              </div>

              <div className="quick-summary__item">
                <div className="quick-summary__dot quick-summary__dot--expense" />
                <div className="quick-summary__info">
                  <div className="quick-summary__name">Total Despesas</div>
                  <div className="quick-summary__amount quick-summary__amount--expense">
                    {formatBRL(totalExpenses)}
                  </div>
                </div>
              </div>

              <div className="quick-summary__item">
                <div className="quick-summary__dot quick-summary__dot--balance" />
                <div className="quick-summary__info">
                  <div className="quick-summary__name">Saldo Líquido</div>
                  <div className={`quick-summary__amount ${netBalance >= 0 ? "quick-summary__amount--gain" : "quick-summary__amount--expense"}`}>
                    {formatBRL(netBalance)}
                  </div>
                </div>
              </div>

              <div className="quick-summary__item">
                <div className="quick-summary__dot" style={{ background: "var(--c-accent)" }} />
                <div className="quick-summary__info">
                  <div className="quick-summary__name">Registros</div>
                  <div className="quick-summary__amount">{totalTrips} corridas</div>
                </div>
              </div>

              {totalGains > 0 && (
                <div className="quick-summary__item">
                  <div className="quick-summary__dot" style={{ background: "var(--c-info)" }} />
                  <div className="quick-summary__info">
                    <div className="quick-summary__name">Margem</div>
                    <div className="quick-summary__amount">
                      {Math.round((netBalance / totalGains) * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABELA DE GANHOS POR SEMANA ── */}
      <div className="card dashboard__table-section">
        <div className="card__header">
          <span className="card__title">📅 Ganhos por Semana</span>
          <span className="card__badge">últimas {weeks.length} semanas</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="week-table">
            <thead>
              <tr>
                <th>Semana</th>
                <th>Plataformas</th>
                <th>Progresso</th>
                <th>Ganhos</th>
                <th>Despesas</th>
                <th>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {weeks.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--c-text-muted)" }}>
                    Nenhum dado encontrado.
                  </td>
                </tr>
              ) : (
                weeks.map((w) => (
                  <tr key={w.week}>
                    <td>
                      <div className="week-label">{w.label}</div>
                      <div className="week-range">{w.range}</div>
                    </td>

                    <td>
                      <div className="platform-pills">
                        {w.platforms.length > 0
                          ? w.platforms.map((p) => (
                              <span className="platform-pill" key={p}>{p}</span>
                            ))
                          : <span style={{ color: "var(--c-text-muted)", fontSize: "var(--text-xs)" }}>—</span>
                        }
                      </div>
                    </td>

                    <td>
                      <div className="week-bar-wrap">
                        <div className="week-bar-track">
                          <div className="week-bar-fill" style={{ width: `${w.pct}%` }} />
                        </div>
                        <span className="week-bar-pct">{w.pct}%</span>
                      </div>
                    </td>

                    <td><span className="val-gain">{formatBRL(w.gains)}</span></td>
                    <td><span className="val-expense">{formatBRL(w.expenses)}</span></td>
                    <td>
                      <span className={w.balance >= 0 ? "val-balance-pos" : "val-balance-neg"}>
                        {formatBRL(w.balance)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {weeks.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={3}>Total ({weeks.length} semanas)</td>
                  <td><span className="val-gain">{formatBRL(totWeekGains)}</span></td>
                  <td><span className="val-expense">{formatBRL(totWeekExpenses)}</span></td>
                  <td>
                    <span className={totWeekBalance >= 0 ? "val-balance-pos" : "val-balance-neg"}>
                      {formatBRL(totWeekBalance)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

    </div>
  );
}
