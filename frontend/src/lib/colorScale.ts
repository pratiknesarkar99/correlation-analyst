export function rToColor(r: number): string {
    const clamped = Math.max(-1, Math.min(1, r));

    if (clamped > 0) {
        const intensity = Math.round(clamped * 180);
        return `rgb(${255 - intensity}, ${255}, ${255 - intensity})`;
    } else {
        const intensity = Math.round(Math.abs(clamped) * 180);
        return `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
    }
}

export function interpretR(r: number): string {
    const abs = Math.abs(r);
    if (abs >= 0.8) return "Very strong";
    if (abs >= 0.6) return "Strong";
    if (abs >= 0.4) return "Moderate";
    if (abs >= 0.2) return "Weak";
    return "Negligible";
}