import { useState } from "react";

// ── Palette: one color per day-of-week (Mon–Sun) ──────────────────────────────
// Main (solid), light shade for WU/CD. Day hues are intentionally distinct so
// each weekday reads at a glance; site-brand chrome (axes, total line, tooltip)
// is layered on top of these.
interface DayColor {
  readonly main: string;
  readonly light: string;
}

const DAY_COLORS: Readonly<Record<DayName, DayColor>> = {
  Mon: { main: "#2563EB", light: "#93C5FD" }, // blue
  Tue: { main: "#16A34A", light: "#86EFAC" }, // green (AM run = dark, River Rats = medium)
  Wed: { main: "#9333EA", light: "#D8B4FE" }, // purple
  Thu: { main: "#EA580C", light: "#FDB98A" }, // orange
  Fri: { main: "#CA8A04", light: "#FDE68A" }, // amber
  Sat: { main: "#DC2626", light: "#FCA5A5" }, // red
  Sun: { main: "#0891B2", light: "#A5F3FC" }, // cyan
};

// Tuesday two-a-day shades: AM (dark) and River Rats (medium-light)
const TUE_AM_COLOR = "#15803D"; // dark green
const TUE_RR_COLOR = "#4ADE80"; // medium-light green

// ── Site-brand chrome colors (blend chart frame with rovani.net theme) ─────────
const RAISINBLACK = "#212227";
const DIMGRAY = "#637074";
const TEKHELET = "#573280"; // weekly-total accent (replaces low-contrast amber on white)
const GRID_LINE = "#E5E7EB"; // gray-200
const AXIS_LINE = "#D1D5DB"; // gray-300
const TICK_LINE = "#9CA3AF"; // gray-400

type DayName = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAYS: readonly DayName[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

type WeekType = "Build" | "Cutback" | "Peak" | "Taper" | "Race";

// ── Raw plan data ─────────────────────────────────────────────────────────────
// Each entry: { wu, main, cd }  (miles)
// Tuesday entries use { wu, am, rr, cd } to distinguish AM run vs River Rats
interface DayPlan {
  readonly wu: number;
  readonly main: number;
  readonly cd: number;
  readonly isTue?: boolean;
  readonly am?: number;
  readonly rr?: number;
}

interface Week {
  readonly label: string;
  readonly type: WeekType;
  readonly days: readonly DayPlan[];
}

const TUE = (am: number, rr: number): DayPlan => ({
  wu: 0,
  am,
  rr,
  cd: 0,
  isTue: true,
  main: am + rr,
});

const WEEKS: readonly Week[] = [
  {
    label: "Wk 1",
    type: "Build",
    days: [
      { wu: 0, main: 8, cd: 0 }, // Mon
      TUE(8, 8), // Tue: 8mi AM + 8mi River Rats
      { wu: 2, main: 4.0, cd: 1 }, // Wed
      { wu: 0, main: 8, cd: 0 }, // Thu
      { wu: 0, main: 8, cd: 0 }, // Fri
      { wu: 0, main: 14, cd: 0 }, // Sat
      { wu: 0, main: 0, cd: 0 }, // Sun REST
    ],
  },
  {
    label: "Wk 2",
    type: "Build",
    days: [
      { wu: 2, main: 3, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 2.5, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 15, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 3",
    type: "Cutback",
    days: [
      { wu: 2, main: 3, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 2.6, cd: 1 }, // Time Trial
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 13, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 4",
    type: "Build",
    days: [
      { wu: 2, main: 4, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 3.75, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 17, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 5",
    type: "Build",
    days: [
      { wu: 2, main: 4, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.0, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 18, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 6",
    type: "Cutback",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 2.61, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 16, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 7",
    type: "Build",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 3.0, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 19, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 8",
    type: "Build",
    days: [
      { wu: 2, main: 6, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 3.1, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 21, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 9",
    type: "Cutback",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.0, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 18, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 10",
    type: "Build",
    days: [
      { wu: 2, main: 8, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 4.35, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 22, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 11",
    type: "Build",
    days: [
      { wu: 2, main: 8, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.0, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 24, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 12",
    type: "Cutback",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 4.25, cd: 1 },
      { wu: 0, main: 9, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 18, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 13",
    type: "Build",
    days: [
      { wu: 2, main: 9, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.23, cd: 1 },
      { wu: 0, main: 9, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 26, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 14",
    type: "Cutback",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.0, cd: 1 },
      { wu: 0, main: 9, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 20, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 15",
    type: "Peak",
    days: [
      { wu: 2, main: 10, cd: 1 },
      TUE(8, 8),
      { wu: 2, main: 5.0, cd: 1 },
      { wu: 0, main: 9, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 9, cd: 0 },
      { wu: 4, main: 20, cd: 0 }, // CARA: 4mi WU + 20mi event
    ],
  },
  {
    label: "Wk 16",
    type: "Taper",
    days: [
      { wu: 0, main: 0, cd: 0 }, // REST
      TUE(0, 8), // River Rats only (no AM run in taper)
      { wu: 2, main: 2.61, cd: 1 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 8, cd: 0 },
      { wu: 0, main: 17, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 17",
    type: "Taper",
    days: [
      { wu: 2, main: 5, cd: 1 },
      TUE(0, 8), // River Rats only
      { wu: 2, main: 4.0, cd: 1 },
      { wu: 0, main: 6, cd: 0 },
      { wu: 0, main: 6, cd: 0 },
      { wu: 0, main: 14, cd: 0 },
      { wu: 0, main: 0, cd: 0 },
    ],
  },
  {
    label: "Wk 18",
    type: "Race",
    days: [
      { wu: 0, main: 4, cd: 0 },
      TUE(6, 8), // 6mi AM + 8mi River Rats
      { wu: 2, main: 3, cd: 1 },
      { wu: 0, main: 5, cd: 0 },
      { wu: 0, main: 0, cd: 0 }, // REST
      { wu: 0, main: 3, cd: 0 },
      { wu: 0, main: 26.2, cd: 0 }, // MARATHON
    ],
  },
];

// Week-type badge colors (light pastels — already blend on a white page)
interface BadgeColor {
  readonly bg: string;
  readonly text: string;
}

const TYPE_BADGE: Readonly<Record<WeekType, BadgeColor>> = {
  Build: { bg: "#DBEAFE", text: "#1D4ED8" },
  Cutback: { bg: "#FEF9C3", text: "#92400E" },
  Peak: { bg: "#FCE7F3", text: "#9D174D" },
  Taper: { bg: "#D1FAE5", text: "#065F46" },
  Race: { bg: "#FFE4E6", text: "#9F1239" },
};

// ── Derived flat bar list ─────────────────────────────────────────────────────
interface Bar {
  readonly weekIdx: number;
  readonly dayIdx: number;
  readonly dayName: DayName;
  readonly wu: number;
  readonly main: number;
  readonly cd: number;
  readonly total: number;
  readonly weekLabel: string;
  readonly weekType: WeekType;
  readonly isTue: boolean;
  readonly am: number;
  readonly rr: number;
}

function buildBars(): Bar[] {
  const bars: Bar[] = [];
  WEEKS.forEach((wk, wi) => {
    wk.days.forEach((d, di) => {
      const total = d.wu + d.main + d.cd;
      bars.push({
        weekIdx: wi,
        dayIdx: di,
        dayName: DAYS[di],
        wu: d.wu,
        main: d.main,
        cd: d.cd,
        total,
        weekLabel: wk.label,
        weekType: wk.type,
        // Tuesday two-a-day fields
        isTue: d.isTue ?? false,
        am: d.am ?? 0,
        rr: d.rr ?? 0,
      });
    });
  });
  return bars;
}

function weeklyTotals(): number[] {
  return WEEKS.map((wk) =>
    wk.days.reduce((s, d) => s + d.wu + d.main + d.cd, 0)
  );
}

// ── Chart constants ───────────────────────────────────────────────────────────
const BAR_W = 14;
const GAP_INNER = 0; // no gap within a week
const GAP_WEEK = 8; // gap between weeks
const CHART_H = 340; // pixel height of the bar area
const MAX_DAILY = 27; // y-axis max (miles, left)
const MAX_WEEKLY = 100; // y-axis max (miles, right)
const LEFT_AXIS_W = 38;
const RIGHT_AXIS_W = 46;
const TOP_PAD = 20;
const BOTTOM_PAD = 60; // room for week labels

function yLeft(miles: number): number {
  return TOP_PAD + CHART_H - (miles / MAX_DAILY) * CHART_H;
}
function yRight(miles: number): number {
  return TOP_PAD + CHART_H - (miles / MAX_WEEKLY) * CHART_H;
}

interface TooltipState {
  readonly x: number;
  readonly y: number;
  readonly bar: Bar;
}

export default function MarathonTraining2026(): React.ReactElement {
  const bars = buildBars();
  const totals = weeklyTotals();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // ── Layout: compute x positions ────────────────────────────────────────────
  // 18 weeks × 7 days each, with gap between weeks
  const totalBars = 18 * 7;
  const totalWidth =
    totalBars * (BAR_W + GAP_INNER) +
    17 * GAP_WEEK + // 17 inter-week gaps
    LEFT_AXIS_W +
    RIGHT_AXIS_W +
    16;

  // x position of bar i (0-indexed flat)
  function barX(flatIdx: number): number {
    const wi = Math.floor(flatIdx / 7);
    const di = flatIdx % 7;
    return LEFT_AXIS_W + wi * (7 * BAR_W + GAP_WEEK) + di * BAR_W;
  }

  // Center x of a week group (for weekly label and line point)
  function weekCenterX(wi: number): number {
    return LEFT_AXIS_W + wi * (7 * BAR_W + GAP_WEEK) + 3.5 * BAR_W;
  }

  // Build weekly line path
  const linePoints: readonly [number, number][] = totals.map((t, i) => [
    weekCenterX(i),
    yRight(t),
  ]);
  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");

  // ── Y-axis ticks ───────────────────────────────────────────────────────────
  const leftTicks: readonly number[] = [0, 5, 10, 15, 20, 25];
  const rightTicks: readonly number[] = [0, 20, 40, 60, 80, 100];

  const svgH = TOP_PAD + CHART_H + BOTTOM_PAD;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-raisinblack tracking-tight">
          Chicago Marathon 2026 — 18-Week Training Load
        </h1>
        <div className="text-sm text-dimgray mt-1">
          Jun 8 → Oct 11, 2026 · Sub-3:00 Goal
        </div>
      </div>

      {/* Week-type legend row */}
      <div className="flex gap-2 justify-center flex-wrap mb-3">
        {(Object.entries(TYPE_BADGE) as [WeekType, BadgeColor][]).map(
          ([t, c]) => (
            <span
              key={t}
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: c.bg, color: c.text }}
            >
              {t}
            </span>
          )
        )}
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-dimgray">
          ▓ WU/CD &nbsp; ██ Main workout
        </span>
      </div>

      {/* Day-of-week color legend */}
      <div className="flex gap-2.5 justify-center flex-wrap mb-4">
        {DAYS.map((d) => (
          <div key={d} className="flex items-center gap-1">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: DAY_COLORS[d].main,
              }}
            />
            <span className="text-xs text-raisinblack">{d}</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <svg width="24" height="4">
            <line
              x1="0"
              y1="2"
              x2="24"
              y2="2"
              stroke={TEKHELET}
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>
          <span className="text-xs text-raisinblack">Weekly total</span>
        </div>
      </div>

      {/* Scrollable chart container */}
      <div style={{ overflowX: "auto", overflowY: "hidden" }}>
        <svg width={totalWidth} height={svgH} style={{ display: "block" }}>
          {/* ── Background grid lines (left axis) ─────────────────────────── */}
          {leftTicks.map((v) => (
            <line
              key={v}
              x1={LEFT_AXIS_W}
              y1={yLeft(v)}
              x2={totalWidth - RIGHT_AXIS_W}
              y2={yLeft(v)}
              stroke={GRID_LINE}
              strokeWidth={v === 0 ? 1 : 0.5}
            />
          ))}

          {/* ── Week background shading ──────────────────────────────────── */}
          {WEEKS.map((wk, wi) => {
            const x = LEFT_AXIS_W + wi * (7 * BAR_W + GAP_WEEK);
            const w = 7 * BAR_W;
            const badge = TYPE_BADGE[wk.type];
            return (
              <rect
                key={wi}
                x={x}
                y={TOP_PAD}
                width={w}
                height={CHART_H}
                fill={badge.bg}
                fillOpacity={0.35}
              />
            );
          })}

          {/* ── Bars ─────────────────────────────────────────────────────── */}
          {bars.map((b, i) => {
            const x = barX(i);
            const col = DAY_COLORS[b.dayName];
            if (b.total === 0) return null;

            const baseY = yLeft(0);
            const isMarathon = b.weekIdx === 17 && b.dayIdx === 6;

            // Tuesday two-a-day: stack AM (dark green) below, River Rats (light green) above
            if (b.isTue) {
              const rrH = (b.rr / MAX_DAILY) * CHART_H;
              const amH = (b.am / MAX_DAILY) * CHART_H;
              const rrY = baseY - rrH;
              const amY = rrY - amH;
              const topY = b.am > 0 ? amY : rrY;
              return (
                <g
                  key={i}
                  onMouseEnter={() =>
                    setTooltip({ x: x + BAR_W / 2, y: topY - 6, bar: b })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* AM run — dark green, bottom segment */}
                  {b.am > 0 && (
                    <rect
                      x={x}
                      y={rrY - amH}
                      width={BAR_W}
                      height={amH}
                      fill={TUE_AM_COLOR}
                    />
                  )}
                  {/* River Rats — medium-light green, top segment */}
                  {b.rr > 0 && (
                    <rect
                      x={x}
                      y={rrY}
                      width={BAR_W}
                      height={rrH}
                      fill={TUE_RR_COLOR}
                    />
                  )}
                </g>
              );
            }

            const cdH = (b.cd / MAX_DAILY) * CHART_H;
            const mainH = (b.main / MAX_DAILY) * CHART_H;
            const wuH = (b.wu / MAX_DAILY) * CHART_H;

            const cdY = baseY - cdH;
            const mainY = cdY - mainH;
            const wuY = mainY - wuH;

            return (
              <g
                key={i}
                onMouseEnter={() =>
                  setTooltip({ x: x + BAR_W / 2, y: wuY - 6, bar: b })
                }
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              >
                {/* WU */}
                {b.wu > 0 && (
                  <rect
                    x={x}
                    y={wuY}
                    width={BAR_W}
                    height={wuH}
                    fill={col.light}
                  />
                )}
                {/* Main */}
                <rect
                  x={x}
                  y={mainY}
                  width={BAR_W}
                  height={mainH}
                  fill={col.main}
                />
                {/* CD */}
                {b.cd > 0 && (
                  <rect
                    x={x}
                    y={cdY}
                    width={BAR_W}
                    height={cdH}
                    fill={col.light}
                  />
                )}
                {/* Marathon flag */}
                {isMarathon && (
                  <text
                    x={x + BAR_W / 2}
                    y={wuY - 6}
                    textAnchor="middle"
                    fontSize={12}
                    fill={TEKHELET}
                  >
                    🏁
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Weekly totals line ───────────────────────────────────────── */}
          <path
            d={linePath}
            fill="none"
            stroke={TEKHELET}
            strokeWidth={2}
            strokeDasharray="5 3"
          />

          {/* Dots + labels */}
          {linePoints.map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r={3.5} fill={TEKHELET} />
              <text
                x={px}
                y={py - 7}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={600}
                fill={TEKHELET}
              >
                {totals[i].toFixed(1)}
              </text>
            </g>
          ))}

          {/* ── Left Y axis ──────────────────────────────────────────────── */}
          <line
            x1={LEFT_AXIS_W}
            y1={TOP_PAD}
            x2={LEFT_AXIS_W}
            y2={TOP_PAD + CHART_H}
            stroke={AXIS_LINE}
          />
          {leftTicks.map((v) => (
            <g key={v}>
              <line
                x1={LEFT_AXIS_W - 4}
                y1={yLeft(v)}
                x2={LEFT_AXIS_W}
                y2={yLeft(v)}
                stroke={TICK_LINE}
              />
              <text
                x={LEFT_AXIS_W - 6}
                y={yLeft(v) + 4}
                textAnchor="end"
                fontSize={10}
                fill={DIMGRAY}
              >
                {v}
              </text>
            </g>
          ))}
          <text
            transform={`rotate(-90, 11, ${TOP_PAD + CHART_H / 2})`}
            x={11}
            y={TOP_PAD + CHART_H / 2}
            textAnchor="middle"
            fontSize={10}
            fill={DIMGRAY}
          >
            Miles / day
          </text>

          {/* ── Right Y axis ─────────────────────────────────────────────── */}
          <line
            x1={totalWidth - RIGHT_AXIS_W}
            y1={TOP_PAD}
            x2={totalWidth - RIGHT_AXIS_W}
            y2={TOP_PAD + CHART_H}
            stroke={AXIS_LINE}
          />
          {rightTicks.map((v) => (
            <g key={v}>
              <line
                x1={totalWidth - RIGHT_AXIS_W}
                y1={yRight(v)}
                x2={totalWidth - RIGHT_AXIS_W + 4}
                y2={yRight(v)}
                stroke={TICK_LINE}
              />
              <text
                x={totalWidth - RIGHT_AXIS_W + 6}
                y={yRight(v) + 4}
                textAnchor="start"
                fontSize={10}
                fill={TEKHELET}
              >
                {v}
              </text>
            </g>
          ))}
          <text
            transform={`rotate(90, ${totalWidth - 10}, ${TOP_PAD + CHART_H / 2})`}
            x={totalWidth - 10}
            y={TOP_PAD + CHART_H / 2}
            textAnchor="middle"
            fontSize={10}
            fill={TEKHELET}
          >
            Weekly miles
          </text>

          {/* ── X axis — week labels + type badges ───────────────────────── */}
          {WEEKS.map((wk, wi) => {
            const cx = weekCenterX(wi);
            const badgeCol = TYPE_BADGE[wk.type];
            return (
              <g key={wi}>
                {/* week number */}
                <text
                  x={cx}
                  y={TOP_PAD + CHART_H + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={DIMGRAY}
                >
                  {wk.label}
                </text>
                {/* type pill */}
                <rect
                  x={cx - 18}
                  y={TOP_PAD + CHART_H + 22}
                  width={36}
                  height={13}
                  rx={3}
                  fill={badgeCol.bg}
                  fillOpacity={0.9}
                />
                <text
                  x={cx}
                  y={TOP_PAD + CHART_H + 32}
                  textAnchor="middle"
                  fontSize={7.5}
                  fontWeight={700}
                  fill={badgeCol.text}
                >
                  {wk.type}
                </text>
              </g>
            );
          })}

          {/* ── Tooltip ──────────────────────────────────────────────────── */}
          {tooltip &&
            (() => {
              const b = tooltip.bar;
              const lines: string[] = b.isTue
                ? [
                  `${b.weekLabel} · Tue (two-a-day)`,
                  `Total: ${b.total.toFixed(1)} mi`,
                  ...(b.am > 0 ? [`  AM run: ${b.am} mi`] : []),
                  `  River Rats: ${b.rr} mi`,
                ]
                : [
                  `${b.weekLabel} · ${b.dayName}`,
                  `Total: ${b.total.toFixed(1)} mi`,
                  b.wu > 0 ? `  WU: ${b.wu} mi` : null,
                  b.main > 0 ? `  Main: ${b.main.toFixed(2)} mi` : null,
                  b.cd > 0 ? `  CD: ${b.cd} mi` : null,
                ].filter((l): l is string => l !== null);

              const ttW = 145;
              const ttH = lines.length * 14 + 10;
              let tx = tooltip.x - ttW / 2;
              const ty = tooltip.y - ttH - 6;
              if (tx < 2) tx = 2;

              return (
                <g>
                  <rect
                    x={tx}
                    y={ty}
                    width={ttW}
                    height={ttH}
                    rx={4}
                    fill={RAISINBLACK}
                    stroke={TEKHELET}
                  />
                  {lines.map((l, i) => (
                    <text
                      key={i}
                      x={tx + 7}
                      y={ty + 14 + i * 14}
                      fontSize={9.5}
                      fill={i === 0 ? "#F8FAFC" : "#CBD5E1"}
                      fontWeight={i === 0 ? 700 : 400}
                    >
                      {l}
                    </text>
                  ))}
                </g>
              );
            })()}
        </svg>
      </div>
    </div>
  );
}
