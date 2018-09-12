import { parseToRgb } from 'polished';

export function toRgb(hex) {
    const { red: r, green: g, blue: b } = parseToRgb(hex);
    return {r, g, b};
}
