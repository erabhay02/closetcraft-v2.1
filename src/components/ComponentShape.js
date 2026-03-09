/**
 * ComponentShape — SVG renderings for each closet component type
 * Used inside the 2D designer canvas to give each component a distinctive look.
 */
import React from 'react';
import Svg, { Rect, Line, Circle, Path, G, Text as SvgText } from 'react-native-svg';

const alpha = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

// ─── Individual shape renderers ───────────────────────────────────

function ShelfShape({ w, h, color }) {
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={color} rx={2} />
      <Rect x={0} y={h - 3} width={w} height={3} fill={alpha(color, 0.5)} rx={1} />
      <Line x1={4} y1={h / 2} x2={w - 4} y2={h / 2} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
    </>
  );
}

function DoubleHangShape({ w, h, color }) {
  const rodY1 = h * 0.12;
  const rodY2 = h * 0.55;
  const garmentW = Math.max(4, w / 6);
  const garments = Math.floor(w / (garmentW + 3));
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.3)} rx={3} />
      {/* Top rod */}
      <Rect x={2} y={rodY1} width={w - 4} height={3} fill={color} rx={1.5} />
      {/* Bottom rod */}
      <Rect x={2} y={rodY2} width={w - 4} height={3} fill={color} rx={1.5} />
      {/* Top garments */}
      {Array.from({ length: Math.min(garments, 6) }).map((_, i) => {
        const x = 4 + i * (garmentW + 3);
        return (
          <G key={`tg${i}`}>
            <Line x1={x + garmentW / 2} y1={rodY1 + 3} x2={x + garmentW / 2} y2={rodY2 - 4} stroke={alpha(color, 0.6)} strokeWidth={1} />
            <Rect x={x} y={rodY1 + 6} width={garmentW} height={rodY2 - rodY1 - 14} fill={alpha(color, 0.35)} rx={2} />
          </G>
        );
      })}
      {/* Bottom garments */}
      {Array.from({ length: Math.min(garments, 6) }).map((_, i) => {
        const x = 4 + i * (garmentW + 3);
        return (
          <G key={`bg${i}`}>
            <Line x1={x + garmentW / 2} y1={rodY2 + 3} x2={x + garmentW / 2} y2={h - 4} stroke={alpha(color, 0.6)} strokeWidth={1} />
            <Rect x={x} y={rodY2 + 6} width={garmentW} height={h - rodY2 - 14} fill={alpha(color, 0.35)} rx={2} />
          </G>
        );
      })}
    </>
  );
}

function LongHangShape({ w, h, color }) {
  const rodY = h * 0.1;
  const garmentW = Math.max(4, w / 5);
  const garments = Math.floor(w / (garmentW + 3));
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.3)} rx={3} />
      <Rect x={2} y={rodY} width={w - 4} height={3} fill={color} rx={1.5} />
      {Array.from({ length: Math.min(garments, 5) }).map((_, i) => {
        const x = 4 + i * (garmentW + 3);
        return (
          <G key={i}>
            <Line x1={x + garmentW / 2} y1={rodY + 3} x2={x + garmentW / 2} y2={h * 0.22} stroke={alpha(color, 0.5)} strokeWidth={1} />
            <Rect x={x} y={h * 0.22} width={garmentW} height={h * 0.7} fill={alpha(color, 0.4)} rx={2} />
          </G>
        );
      })}
    </>
  );
}

function DrawerShape({ w, h, color, drawers }) {
  const drawerH = h / drawers;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.4)} rx={3} />
      {Array.from({ length: drawers }).map((_, i) => (
        <G key={i}>
          <Rect x={2} y={i * drawerH + 2} width={w - 4} height={drawerH - 4} fill={alpha(color, 0.5)} rx={2} />
          <Rect x={w / 2 - 6} y={i * drawerH + drawerH / 2 - 2} width={12} height={4} fill={alpha(color, 0.8)} rx={2} />
        </G>
      ))}
    </>
  );
}

function ShoeRackShape({ w, h, color }) {
  const shelves = 3;
  const shelfH = h / shelves;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.25)} rx={3} />
      {Array.from({ length: shelves }).map((_, i) => (
        <G key={i}>
          <Line x1={2} y1={(i + 1) * shelfH - 3} x2={w - 2} y2={i * shelfH + 4} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </G>
      ))}
    </>
  );
}

function CubbyShape({ w, h, color }) {
  const cols = Math.max(1, Math.round(w / 20));
  const rows = Math.max(1, Math.round(h / 20));
  const cellW = w / cols;
  const cellH = h / rows;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.3)} rx={3} />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Line key={`cv${i}`} x1={(i + 1) * cellW} y1={0} x2={(i + 1) * cellW} y2={h} stroke={color} strokeWidth={1.5} />
      ))}
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <Line key={`ch${i}`} x1={0} y1={(i + 1) * cellH} x2={w} y2={(i + 1) * cellH} stroke={color} strokeWidth={1.5} />
      ))}
    </>
  );
}

function BasketShape({ w, h, color }) {
  const lines = Math.max(2, Math.floor(h / 5));
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.2)} rx={3} />
      <Rect x={0} y={0} width={w} height={h} fill="none" stroke={color} strokeWidth={1.5} rx={3} />
      {Array.from({ length: lines }).map((_, i) => (
        <Line key={i} x1={2} y1={((i + 1) * h) / (lines + 1)} x2={w - 2} y2={((i + 1) * h) / (lines + 1)} stroke={alpha(color, 0.5)} strokeWidth={1} />
      ))}
    </>
  );
}

function HookShape({ w, h, color }) {
  const hooks = Math.max(2, Math.floor(w / 10));
  const spacing = w / hooks;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.3)} rx={2} />
      <Rect x={0} y={0} width={w} height={2} fill={color} rx={1} />
      {Array.from({ length: hooks }).map((_, i) => (
        <Path
          key={i}
          d={`M ${i * spacing + spacing / 2} 2 L ${i * spacing + spacing / 2} ${h * 0.5} Q ${i * spacing + spacing / 2 + 3} ${h * 0.9} ${i * spacing + spacing / 2 + 5} ${h * 0.75}`}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

function ValetRodShape({ w, h, color }) {
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.25)} rx={2} />
      <Rect x={4} y={h / 2 - 1} width={w - 8} height={2} fill={color} rx={1} />
      <Rect x={w / 2 - 3} y={0} width={6} height={h} fill={alpha(color, 0.4)} rx={1} />
    </>
  );
}

function SlidingDoorShape({ w, h, color }) {
  const midX = w / 2;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.15)} rx={3} />
      <Rect x={0} y={0} width={w} height={h} fill="none" stroke={color} strokeWidth={2} rx={3} />
      <Line x1={midX} y1={0} x2={midX} y2={h} stroke={color} strokeWidth={2} />
      <Rect x={midX - 12} y={h / 2 - 6} width={10} height={12} fill={alpha(color, 0.5)} rx={2} />
      <Rect x={midX + 2} y={h / 2 - 6} width={10} height={12} fill={alpha(color, 0.5)} rx={2} />
    </>
  );
}

function LedStripShape({ w, h, color }) {
  const dots = Math.floor(w / 8);
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.3)} rx={1} />
      {Array.from({ length: dots }).map((_, i) => (
        <Circle key={i} cx={6 + i * 8} cy={h / 2} r={2} fill={color} opacity={i % 2 === 0 ? 1 : 0.5} />
      ))}
    </>
  );
}

function TieRackShape({ w, h, color }) {
  const bars = Math.max(3, Math.floor(h / 6));
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.25)} rx={3} />
      <Line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke={alpha(color, 0.5)} strokeWidth={2} />
      {Array.from({ length: bars }).map((_, i) => (
        <Line key={i} x1={4} y1={((i + 1) * h) / (bars + 1)} x2={w - 4} y2={((i + 1) * h) / (bars + 1)} stroke={alpha(color, 0.6)} strokeWidth={1.5} strokeLinecap="round" />
      ))}
    </>
  );
}

function PantsRackShape({ w, h, color }) {
  const bars = Math.max(2, Math.floor(w / 10));
  const barSpacing = w / bars;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.25)} rx={3} />
      <Rect x={2} y={4} width={w - 4} height={3} fill={color} rx={1.5} />
      {Array.from({ length: bars }).map((_, i) => (
        <G key={i}>
          <Line x1={i * barSpacing + barSpacing / 2} y1={7} x2={i * barSpacing + barSpacing / 2} y2={h - 4} stroke={alpha(color, 0.7)} strokeWidth={1.5} />
          <Line x1={i * barSpacing + 3} y1={h - 4} x2={i * barSpacing + barSpacing - 3} y2={h - 4} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </G>
      ))}
    </>
  );
}

function LaundrySorterShape({ w, h, color }) {
  const bags = 3;
  const bagW = (w - 6) / bags;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.2)} rx={3} />
      <Rect x={0} y={0} width={w} height={8} fill={alpha(color, 0.5)} rx={3} />
      {Array.from({ length: bags }).map((_, i) => (
        <Rect key={i} x={2 + i * (bagW + 1)} y={10} width={bagW} height={h - 14} fill={alpha(color, 0.35)} rx={4} />
      ))}
    </>
  );
}

function SafeShape({ w, h, color }) {
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.5)} rx={3} />
      <Rect x={2} y={2} width={w - 4} height={h - 4} fill="none" stroke={alpha(color, 0.8)} strokeWidth={1} rx={2} />
      <Circle cx={w * 0.65} cy={h / 2} r={Math.min(h * 0.25, 8)} fill="none" stroke={color} strokeWidth={2} />
      <Rect x={w * 0.2} y={h * 0.3} width={w * 0.2} height={h * 0.4} fill={alpha(color, 0.6)} rx={2} />
    </>
  );
}

function IslandShape({ w, h, color }) {
  const drawers = 2;
  const drawerH = h * 0.55 / drawers;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.35)} rx={4} />
      <Rect x={0} y={h * 0.55} width={w} height={h * 0.45} fill={alpha(color, 0.5)} rx={4} />
      {Array.from({ length: drawers }).map((_, i) => (
        <G key={i}>
          <Rect x={4} y={i * drawerH + 4} width={w - 8} height={drawerH - 6} fill={alpha(color, 0.45)} rx={2} />
          <Rect x={w / 2 - 8} y={i * drawerH + drawerH / 2 - 2} width={16} height={4} fill={alpha(color, 0.8)} rx={2} />
        </G>
      ))}
      <Line x1={0} y1={h * 0.55} x2={w} y2={h * 0.55} stroke={alpha(color, 0.8)} strokeWidth={2} />
    </>
  );
}

function CornerShelfShape({ w, h, color }) {
  return (
    <>
      <Path d={`M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`} fill={alpha(color, 0.25)} />
      <Path d={`M 0 ${h} L ${w * 0.5} 0 L ${w} 0`} fill={alpha(color, 0.4)} />
      <Line x1={0} y1={0} x2={w} y2={0} stroke={color} strokeWidth={2} />
      <Line x1={0} y1={0} x2={0} y2={h} stroke={color} strokeWidth={2} />
    </>
  );
}

function JewelryTrayShape({ w, h, color }) {
  const cols = 3;
  const rows = 2;
  const cellW = (w - 4) / cols;
  const cellH = (h - 4) / rows;
  return (
    <>
      <Rect x={0} y={0} width={w} height={h} fill={alpha(color, 0.4)} rx={3} />
      {Array.from({ length: cols }).map((_, ci) =>
        Array.from({ length: rows }).map((_, ri) => (
          <Circle key={`${ci}-${ri}`} cx={2 + ci * cellW + cellW / 2} cy={2 + ri * cellH + cellH / 2} r={Math.min(cellW, cellH) * 0.3} fill={alpha(color, 0.6)} />
        ))
      )}
    </>
  );
}

function HamperShape({ w, h, color }) {
  const midH = h * 0.15;
  return (
    <>
      <Path
        d={`M 4 ${midH} Q 0 ${midH * 0.3} ${w / 2} ${midH * 0.1} Q ${w} ${midH * 0.3} ${w - 4} ${midH} L ${w - 2} ${h} L 2 ${h} Z`}
        fill={alpha(color, 0.4)}
      />
      <Line x1={2} y1={h * 0.35} x2={w - 2} y2={h * 0.35} stroke={alpha(color, 0.5)} strokeWidth={1} />
      <Line x1={2} y1={h * 0.6} x2={w - 2} y2={h * 0.6} stroke={alpha(color, 0.5)} strokeWidth={1} />
      <Line x1={2} y1={h * 0.8} x2={w - 2} y2={h * 0.8} stroke={alpha(color, 0.5)} strokeWidth={1} />
    </>
  );
}

// ─── Shape lookup ────────────────────────────────────────────────

const SHAPE_MAP = {
  'shelf': ShelfShape,
  'double-hang': DoubleHangShape,
  'long-hang': LongHangShape,
  'drawers-3': (props) => <DrawerShape {...props} drawers={3} />,
  'drawers-5': (props) => <DrawerShape {...props} drawers={5} />,
  'shoe-rack': ShoeRackShape,
  'cubbies': CubbyShape,
  'basket': BasketShape,
  'hooks': HookShape,
  'valet-rod': ValetRodShape,
  'jewelry-tray': JewelryTrayShape,
  'hamper': HamperShape,
  'sliding-doors': SlidingDoorShape,
  'led-strip': LedStripShape,
  'tie-rack': TieRackShape,
  'pants-rack': PantsRackShape,
  'laundry-sorter': LaundrySorterShape,
  'safe-lockbox': SafeShape,
  'island-unit': IslandShape,
  'corner-shelf': CornerShelfShape,
};

// ─── Export ───────────────────────────────────────────────────────

export default function ComponentShape({ type, w, h, color }) {
  const ShapeRenderer = SHAPE_MAP[type];
  if (!ShapeRenderer) {
    return (
      <Svg width={w} height={h}>
        <Rect x={0} y={0} width={w} height={h} fill={color + '88'} rx={3} />
      </Svg>
    );
  }
  return (
    <Svg width={w} height={h}>
      <ShapeRenderer w={w} h={h} color={color} />
    </Svg>
  );
}
