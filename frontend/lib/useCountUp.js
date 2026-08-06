"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 -> target using requestAnimationFrame.
 * Used for score / percentage / XP reveals so results feel earned
 * rather than just appearing.
 */
export default function useCountUp(target, { duration = 900, decimals = 0 } = {}) {
    const [value, setValue] = useState(0);
    const frameRef = useRef(null);
    const startRef = useRef(null);

    useEffect(() => {
        const numericTarget = Number(target) || 0;
        startRef.current = null;

        const step = (timestamp) => {
            if (startRef.current === null) startRef.current = timestamp;
            const progress = Math.min((timestamp - startRef.current) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(numericTarget * eased);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(step);
            } else {
                setValue(numericTarget);
            }
        };

        frameRef.current = requestAnimationFrame(step);
        return () => frameRef.current && cancelAnimationFrame(frameRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
}
