"use client";

import { useEffect, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [hidden, setHidden] = useState(false);
    const [flash, setFlash] = useState(false);
    const text = "Kaizen";

    useEffect(() => {
        // Wait for the letter animations (0.12 * 6) + initial wait (no extra exit delay)
        const totalLetterTime = Math.floor(0.12 * text.length * 1000) + 550;

        const timer = setTimeout(() => {
            setFlash(true);
            setHidden(true); // Fades out the background
            onComplete();    // Tells page.tsx to fade in the Hero

            // Flash cleanup
            setTimeout(() => {
                setFlash(false);
            }, 1800);
        }, totalLetterTime);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <>
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[var(--orange-500)] to-[var(--orange-700)] transition-all duration-800 ease-in-out
        ${hidden ? "opacity-0 invisible" : "opacity-100 visible"}
        after:absolute after:w-[340px] after:h-[340px] after:rounded-full after:bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)] after:animate-[pulse-glow_2.2s_ease-in-out_infinite]`}
            >
                <div className="loader-text z-10 flex">
                    {text.split("").map((ch, i) => (
                        <span
                            key={i}
                            style={{ animationDelay: `${0.12 * i}s` }}
                        >
                            {ch}
                        </span>
                    ))}
                </div>
            </div>

            {flash && (
                <div className="fixed inset-0 z-[49] pointer-events-none bg-[radial-gradient(circle,rgba(249,115,22,0.6),rgba(255,255,255,0.9))] opacity-0 animate-[flash-strobe_1.8s_ease-out_forwards]" />
            )}
        </>
    );
}
