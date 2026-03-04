"use client";

import { useEffect, useRef } from "react";

export default function TunnelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let W = window.innerWidth;
        let H = window.innerHeight;
        let cx = W / 2;
        let cy = H / 2;
        let animationFrameId: number;

        function resize() {
            if (!canvas) return;
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            cx = W / 2;
            cy = H / 2;
        }
        resize();
        window.addEventListener("resize", resize);

        // Returns an HSL color that cycles through holographic hues
        function holoColor(offset: number, alpha: number) {
            const hue = (offset * 360) % 360;
            return `hsla(${hue}, 85%, 65%, ${alpha})`;
        }

        interface Streak {
            angle: number;
            spread: number;
            z: number;
            speed: number;
            hueOffset: number;
            hueShift: number;
            width: number;
            trailLen: number;
        }

        const STREAK_COUNT = 160;
        const streaks: Streak[] = [];

        function resetStreak(s: Partial<Streak> = {}, init: boolean = false): Streak {
            const angle = Math.random() * Math.PI * 2;
            const spread = 0.15 + Math.random() * 0.85;
            return Object.assign(s, {
                angle,
                spread,
                z: init ? Math.random() * 4 + 0.5 : 4 + Math.random() * 1,
                speed: 0.018 + Math.random() * 0.035,
                hueOffset: Math.random(),
                hueShift: 0.0006 + Math.random() * 0.0016,
                width: 0.5 + Math.random() * 1.5,
                trailLen: 6 + Math.random() * 10,
            }) as Streak;
        }

        for (let i = 0; i < STREAK_COUNT; i++) {
            streaks.push(resetStreak({}, true));
        }

        interface Ring {
            z: number;
            speed: number;
            hueOffset: number;
        }

        const RING_COUNT = 12;
        const rings: Ring[] = [];
        for (let i = 0; i < RING_COUNT; i++) {
            rings.push({
                z: (i / RING_COUNT) * 8 + 0.5,
                speed: 0.012 + Math.random() * 0.008,
                hueOffset: Math.random(),
            });
        }

        let time = 0;
        let mouseDistFactor = 1;
        let btnX = cx;
        let btnY = cy;

        function updateBtnPos() {
            const ctaBtn = document.getElementById("ctaBtn");
            if (!ctaBtn) return;
            const rect = ctaBtn.getBoundingClientRect();
            btnX = rect.left + rect.width / 2;
            btnY = rect.top + rect.height / 2;
        }

        window.addEventListener("resize", updateBtnPos);
        setTimeout(updateBtnPos, 100);

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - btnX;
            const dy = e.clientY - btnY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const proximity = Math.max(0, 1 - dist / 400);
            mouseDistFactor = 1 + proximity * 5;
        };
        window.addEventListener("mousemove", handleMouseMove);

        let themeCreamHex = '#050510';
        let themeR = 5, themeG = 5, themeB = 16;

        function updateThemeColors() {
            const bgStr = getComputedStyle(document.documentElement).getPropertyValue('--cream').trim() || '#050510';
            themeCreamHex = bgStr;
            if (bgStr === '#fffdfa') { themeR = 255; themeG = 253; themeB = 250; }
            else if (bgStr === '#000000') { themeR = 0; themeG = 0; themeB = 0; }
            else { themeR = 5; themeG = 5; themeB = 16; } // default dark
        }

        updateThemeColors();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateThemeColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        function drawFrame() {
            if (!ctx) return;
            time += 0.016;

            ctx.fillStyle = "rgba(5, 5, 16, 0.18)";
            ctx.fillRect(0, 0, W, H);

            const maxDim = Math.max(W, H);

            for (let i = 0; i < STREAK_COUNT; i++) {
                const s = streaks[i];
                s.z -= s.speed * mouseDistFactor;
                s.hueOffset += s.hueShift * mouseDistFactor;

                if (s.z <= 0.05) {
                    resetStreak(s, false);
                    continue;
                }

                const projScale = maxDim * 0.5;
                const sx = cx + Math.cos(s.angle) * (s.spread / s.z) * projScale;
                const sy = cy + Math.sin(s.angle) * (s.spread / s.z) * projScale;

                const tz = s.z + s.speed * s.trailLen;
                const tx = cx + Math.cos(s.angle) * (s.spread / tz) * projScale;
                const ty = cy + Math.sin(s.angle) * (s.spread / tz) * projScale;

                if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) {
                    resetStreak(s, false);
                    continue;
                }

                const closeness = Math.min(1, (4 - s.z) / 3);
                const alpha = closeness * 0.45;
                const lineW = s.width * (1 / s.z) * 0.4;

                const grad = ctx.createLinearGradient(tx, ty, sx, sy);
                const h1 = s.hueOffset;
                const h2 = s.hueOffset + 0.15;
                const h3 = s.hueOffset + 0.3;
                grad.addColorStop(0, holoColor(h1, 0));
                grad.addColorStop(0.3, holoColor(h2, alpha * 0.6));
                grad.addColorStop(0.7, holoColor(h2, alpha));
                grad.addColorStop(1, holoColor(h3, alpha * 0.8));

                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = grad;
                ctx.lineWidth = Math.max(0.3, lineW);
                ctx.stroke();

                if (closeness > 0.3) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, Math.max(0.4, lineW * 0.4), 0, Math.PI * 2);
                    ctx.fillStyle = holoColor(h3, closeness * 0.7);
                    ctx.fill();
                }
            }

            for (let i = 0; i < RING_COUNT; i++) {
                const ring = rings[i];
                ring.z -= ring.speed;
                ring.hueOffset += 0.001;
                if (ring.z <= 0.3) ring.z += 8;

                const scale = 1 / ring.z;
                const r = maxDim * scale * 0.18;
                const alpha = Math.max(0, Math.min(0.12, 0.16 - ring.z * 0.015));

                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = holoColor(ring.hueOffset, alpha);
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            const vignette = ctx.createRadialGradient(cx, cy, H * 0.1, cx, cy, H * 0.9);
            vignette.addColorStop(0, `rgba(${themeR}, ${themeG}, ${themeB}, 0)`);
            vignette.addColorStop(1, `rgba(${themeR}, ${themeG}, ${themeB}, 0.7)`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, W, H);

            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.3);
            glow.addColorStop(0, "rgba(249, 115, 22, 0.05)");
            glow.addColorStop(0.6, "rgba(200, 80, 180, 0.02)");
            glow.addColorStop(1, `rgba(${themeR}, ${themeG}, ${themeB}, 0)`);
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            animationFrameId = requestAnimationFrame(drawFrame);
        }

        ctx.fillStyle = themeCreamHex;
        ctx.fillRect(0, 0, W, H);
        drawFrame();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("resize", updateBtnPos);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none"
        />
    );
}
