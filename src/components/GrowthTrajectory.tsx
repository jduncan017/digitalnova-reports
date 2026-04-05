"use client";

import { useRef } from "react";
import { type GrowthTrajectory as GrowthTrajectoryType } from "~/lib/types";
import { useThemeColors } from "~/hooks/useThemeColors";

const PHASES = ["LAUNCH", "LEARN", "OPTIMIZE", "SCALE"] as const;
const MARKERS = ["Start", "M1", "M2", "M3", "M4", "M5", "M6"] as const;

// The curve: starts at 0, small rise, dips back near 0, then smooth acceleration up
// y=100 is bottom of chart, y=0 is top
const CURVE_POINTS = [
  { x: 0, y: 98 },   // Start — at baseline
  { x: 14, y: 82 },  // Small rise during Launch
  { x: 27, y: 96 },  // Dip — back near baseline ("We Are Here")
  { x: 50, y: 62 },  // Recovery through Optimize
  { x: 75, y: 28 },  // Accelerating through Scale
  { x: 100, y: 2 },  // Full growth
];

// Index of the dip point that the marker sits on
const DIP_INDEX = 2;

function buildPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  // Monotone cubic interpolation for a smooth, natural curve
  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1]!.x - points[i]!.x);
    dy.push(points[i + 1]!.y - points[i]!.y);
    m.push(dy[i]! / dx[i]!);
  }
  // Tangents
  const tangents: number[] = [m[0]!];
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1]! * m[i]! <= 0) {
      tangents.push(0);
    } else {
      tangents.push((m[i - 1]! + m[i]!) / 2);
    }
  }
  tangents.push(m[n - 2]!);

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const seg = (p1.x - p0.x) / 3;
    const cp1x = p0.x + seg;
    const cp1y = p0.y + tangents[i]! * seg;
    const cp2x = p1.x - seg;
    const cp2y = p1.y - tangents[i + 1]! * seg;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function GrowthTrajectory({
  trajectory,
}: {
  trajectory: GrowthTrajectoryType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { primary } = useThemeColors(ref);

  // Marker sits exactly on the dip point of the curve
  const dipPoint = CURVE_POINTS[DIP_INDEX]!;
  const markerX = dipPoint.x;
  const markerY = dipPoint.y;

  const svgW = 700;
  const svgH = 320;
  const padL = 40;
  const padR = 20;
  const padT = 40;
  const padB = 60;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const toSvg = (px: number, py: number) => ({
    x: padL + (px / 100) * chartW,
    y: padT + (py / 100) * chartH,
  });

  const svgPoints = CURVE_POINTS.map((p) => toSvg(p.x, p.y));
  const curvePath = buildPath(svgPoints);

  const fillPath =
    curvePath +
    ` L ${padL + chartW} ${padT + chartH} L ${padL} ${padT + chartH} Z`;

  const mSvg = toSvg(markerX, markerY);

  // Phase boundaries (equal quarters)
  const phaseBoundaries = [0, 0.18, 0.4, 0.65, 1];

  return (
    <div
      ref={ref}
      className="card-shadow rounded-2xl p-6 backdrop-blur-sm sm:p-8"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--surface-transparent)",
      }}
    >
      <div className="mx-auto max-w-[680px]">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          {/* Phase labels */}
          {PHASES.map((phase, i) => {
            const x1 = padL + phaseBoundaries[i]! * chartW;
            const x2 = padL + phaseBoundaries[i + 1]! * chartW;
            return (
              <text
                key={phase}
                x={(x1 + x2) / 2}
                y={padT - 16}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                letterSpacing="0.08em"
                fill={
                  phase === trajectory.currentPhase ? primary : "var(--muted)"
                }
                opacity={phase === trajectory.currentPhase ? 1 : 0.5}
              >
                {phase}
              </text>
            );
          })}

          {/* Phase dividers */}
          {phaseBoundaries.slice(1, -1).map((b, i) => {
            const x = padL + b * chartW;
            return (
              <line
                key={i}
                x1={x}
                y1={padT - 6}
                x2={x}
                y2={padT + chartH}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            );
          })}

          {/* Y axis label */}
          <text
            x={12}
            y={padT + chartH / 2}
            textAnchor="middle"
            fontSize={11}
            fill="var(--muted)"
            transform={`rotate(-90, 12, ${padT + chartH / 2})`}
          >
            Growth
          </text>

          {/* Filled area under curve */}
          <path d={fillPath} fill={primary} opacity={0.08} />

          {/* The curve */}
          <path
            d={curvePath}
            fill="none"
            stroke={primary}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* X-axis markers */}
          {MARKERS.map((label, i) => {
            const x = padL + (i / (MARKERS.length - 1)) * chartW;
            return (
              <text
                key={label}
                x={x}
                y={padT + chartH + 24}
                textAnchor="middle"
                fontSize={12}
                fill="var(--muted)"
              >
                {label}
              </text>
            );
          })}

          {/* "We Are Here" arrow + label */}
          <g>
            {/* Arrow line */}
            <line
              x1={mSvg.x}
              y1={mSvg.y - 50}
              x2={mSvg.x}
              y2={mSvg.y - 12}
              stroke={primary}
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
            />
            {/* Dot on curve */}
            <circle cx={mSvg.x} cy={mSvg.y} r={5} fill={primary} />
            <circle
              cx={mSvg.x}
              cy={mSvg.y}
              r={9}
              fill={primary}
              opacity={0.2}
            />
            {/* Label */}
            <text
              x={mSvg.x}
              y={mSvg.y - 58}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={primary}
            >
              We Are Here
            </text>
          </g>

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 4 3 L 0 6 Z" fill={primary} />
            </marker>
          </defs>
        </svg>

        {/* Caption */}
        <p
          className="mt-4 text-center text-sm leading-relaxed"
          style={{ color: "var(--text-body)" }}
        >
          <span style={{ color: primary, fontWeight: 600 }}>
            {trajectory.currentPhase}:
          </span>{" "}
          {trajectory.caption}
        </p>
      </div>
    </div>
  );
}
