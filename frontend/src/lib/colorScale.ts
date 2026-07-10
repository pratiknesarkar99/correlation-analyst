export function rToColor(r: number): string {
    const clamped = Math.max(-1, Math.min(1, r));
    const abs = Math.abs(clamped);

    if (clamped === 0 || abs < 0.02) {
        return "rgb(248, 250, 252)";
    }

    if (clamped > 0) {
        const t = clamped;
        const r_ = Math.round(219 + (37 - 219) * t);
        const g = Math.round(234 + (99 - 234) * t);
        const b = Math.round(254 + (235 - 254) * t);
        return `rgb(${r_}, ${g}, ${b})`;
    } else {
        const t = Math.abs(clamped);
        const r_ = Math.round(219 + (254 - 219) * t);
        const g = Math.round(234 + (202 - 234) * t);
        const b = Math.round(254 + (202 - 254) * t);
        return `rgb(${r_}, ${g}, ${b})`;
    }
}

export function rToTextColor(r: number): string {
    return Math.abs(r) > 0.6 ? "#0F172A" : "#334155";
}

export function interpretR(r: number): string {
    const abs = Math.abs(r);
    if (abs >= 0.8) return "Very strong";
    if (abs >= 0.6) return "Strong";
    if (abs >= 0.4) return "Moderate";
    if (abs >= 0.2) return "Weak";
    return "Negligible";
}