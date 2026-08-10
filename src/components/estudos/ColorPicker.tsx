"use client";

import { useRef, useState } from "react";
import { EVENT_PALETTE } from "@/lib/palette";

function hsvToHex(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`.toUpperCase();
}

export function ColorPicker({ name, defaultColor }: { name: string; defaultColor: string }) {
  const [selected, setSelected] = useState(defaultColor);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(20);
  const [pos, setPos] = useState({ x: 80, y: 10 }); // % dentro do quadrado
  const squareRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const previewHex = hsvToHex(hue, pos.x, 100 - pos.y);

  function setFromPointer(clientX: number, clientY: number) {
    const el = squareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    setPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <div className="flex flex-wrap items-center gap-2.5">
        {EVENT_PALETTE.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.nome}
            onClick={() => setSelected(c.hex)}
            className="relative h-[34px] w-[34px] shrink-0 rounded-full border-2"
            style={{ background: c.hex, borderColor: selected === c.hex ? "var(--text)" : "transparent" }}
          >
            {selected === c.hex && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow">✓</span>}
          </button>
        ))}
        {customColors.map((hex) => (
          <button
            key={hex}
            type="button"
            title="Personalizada"
            onClick={() => setSelected(hex)}
            className="relative h-[34px] w-[34px] shrink-0 rounded-full border-2"
            style={{ background: hex, borderColor: selected === hex ? "var(--text)" : "transparent" }}
          >
            {selected === hex && <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow">✓</span>}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Criar cor personalizada"
          className="h-[34px] w-[34px] shrink-0 rounded-full border-[1.5px] border-dashed border-text-dim text-base text-text-dim"
        >
          +
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[340px] rounded-2xl border border-border bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3.5 text-[15px] font-bold">Criar cor personalizada</h3>

            <div
              ref={squareRef}
              className="relative mb-3.5 h-[150px] w-full cursor-crosshair rounded-lg"
              style={{
                background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0)), hsl(${hue}, 100%, 50%)`,
              }}
              onPointerDown={(e) => {
                dragging.current = true;
                (e.target as Element).setPointerCapture(e.pointerId);
                setFromPointer(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => dragging.current && setFromPointer(e.clientX, e.clientY)}
              onPointerUp={() => (dragging.current = false)}
            >
              <div
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              />
            </div>

            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="mb-4 h-3.5 w-full appearance-none rounded-full"
              style={{
                background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
            />

            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full border border-border" style={{ background: previewHex }} />
              <input
                type="text"
                readOnly
                value={previewHex}
                className="flex-1 rounded-lg border border-border bg-surface-2 px-2.5 py-2 font-mono text-sm"
              />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-surface-2 py-2.5 text-[13.5px] font-bold text-text-dim"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomColors((cur) => [...cur, previewHex]);
                  setSelected(previewHex);
                  setOpen(false);
                }}
                className="flex-1 rounded-lg bg-accent py-2.5 text-[13.5px] font-bold text-accent-text"
              >
                Usar esta cor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
