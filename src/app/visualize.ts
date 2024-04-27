export function normalize(x: number, max: number = 1, min: number = 0): number {
    const y = (x - min) / (max - min);
    return clamp(y, 0, 1);
}

function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}


export function createPalette(hexColors: string[]): { r: number; g: number; b: number }[] {
    // Map each hex color into an RGB value.
    const rgb = hexColors.map(colorToRGB);
    // Create a palette with 256 colors derived from our rgb colors.
    const size = 256;
    const step = (rgb.length - 1) / (size - 1);
    return Array(size)
      .fill(0)
      .map((_, i) => {
        // Get the lower and upper indices for each color.
        const index = i * step;
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        // Interpolate between the colors to get the shades.
        return {
          r: lerp(rgb[lower].r, rgb[upper].r, index - lower),
          g: lerp(rgb[lower].g, rgb[upper].g, index - lower),
          b: lerp(rgb[lower].b, rgb[upper].b, index - lower),
        };
      });
}

export function colorToRGB(color: string): { r: number; g: number; b: number } {
    const hex = color.startsWith('#') ? color.slice(1) : color;
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
}

export function lerp(x: number, y: number, t: number): number {
    return x + t * (y - x);
}

export function rgbToColor({ r, g, b }: { r: number; g: number; b: number }): string {
  const f = (x: number) => {
    const hex = Math.round(x).toString(16);
    return hex.length == 1 ? `0${hex}` : hex;
  };
  return `#${f(r)}${f(g)}${f(b)}`;
}