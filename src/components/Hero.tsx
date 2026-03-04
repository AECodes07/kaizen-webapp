"use client";

import { useEffect, useState } from "react";

export default function Hero({ show }: { show: boolean }) {
    const [letters, setLetters] = useState<string[]>([]);
    const titleText = "Kaizen";

    useEffect(() => {
        if (show) {
            setLetters(titleText.split(""));
        }
    }, [show]);

    return (
        <main
            id="main"
            className={`relative z-10 h-full flex flex-col items-center justify-center gap-10 opacity-0 transition-opacity duration-1000 ${show ? "opacity-100" : ""
                }`}
        >
            <div className="relative flex items-center justify-center">
                {/* Subtle glow behind title */}
                <div className="absolute w-[500px] h-[140px] bg-[radial-gradient(ellipse,rgba(249,115,22,0.25),transparent_70%)] blur-[40px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

                <h1 className="title text-center">
                    {letters.map((ch, i) => (
                        <span
                            key={i}
                            className="title-letter"
                            style={{ animationDelay: `${0.12 * i + 0.3}s` }}
                        >
                            {ch}
                        </span>
                    ))}
                </h1>
            </div>

            <button
                id="ctaBtn"
                className="group relative inline-flex items-center justify-center py-4 px-12 font-sans text-[1.15rem] font-semibold tracking-wide text-[#050510] border-none rounded-full cursor-pointer bg-white 
        shadow-[0_4px_20px_rgba(255,255,255,0.25),0_1px_3px_rgba(255,255,255,0.08)] 
        overflow-hidden transition-all duration-300 transform-gpu
        hover:-translate-y-1 hover:animate-[rainbow-glow_3s_linear_infinite]
        active:translate-y-0 active:shadow-[0_2px_10px_rgba(255,255,255,0.4)] active:animate-none"
                onClick={(e) => {
                    const btn = e.currentTarget;
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const ripple = document.createElement("span");
                    ripple.className = "absolute rounded-full bg-[rgba(255,255,255,0.35)] scale-0 pointer-events-none animate-[ripple-out_0.6s_ease-out_forwards]";
                    ripple.style.width = ripple.style.height = `${size}px`;
                    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                    btn.appendChild(ripple);

                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }}
            >
                Harness your mind
                {/* Shine sweep on hover */}
                <span className="absolute top-0 -left-[75%] w-1/2 h-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] -skew-x-[20deg] group-hover:animate-[shine-sweep_0.7s_ease_forwards]" />
            </button>

            <p className="text-[0.95rem] font-light text-orange-300 opacity-70 tracking-widest uppercase text-center mt-[-10px]">
                Take the first step towards renewed self-awareness
            </p>
        </main>
    );
}
