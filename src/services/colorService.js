const path = require('path');
const COLOR_NAMES = require(path.join(__dirname, '../../json/colorNames.json'));

// validates hex color format with 3, 4, 6, or 8 digit variants
function validateHex(hex) {
  if (!hex) {
    return { valid: false, error: 'hex value is required' };
  }

  const cleanHex = hex.replace('#', '');
  const validLengths = [3, 4, 6, 8];

  if (!validLengths.includes(cleanHex.length)) {
    return { valid: false, error: 'invalid hex format. use #RGB, #RGBA, #RRGGBB, or #RRGGBBAA' };
  }

  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    return { valid: false, error: 'hex contains invalid characters. only 0-9, a-f allowed' };
  }

  return { valid: true, hex: cleanHex.toLowerCase() };
}

// validates rgb values - each channel must be 0-255
function validateRgb(r, g, b) {
  const values = [r, g, b];
  const names = ['r', 'g', 'b'];

  for (let i = 0; i < values.length; i++) {
    const val = parseInt(values[i], 10);

    if (isNaN(val) || val < 0 || val > 255) {
      return { valid: false, error: `invalid ${names[i]} value. must be 0-255` };
    }
  }

  return { valid: true, r: parseInt(r, 10), g: parseInt(g, 10), b: parseInt(b, 10) };
}

// validates hsl values - hue 0-360, saturation and lightness 0-100
function validateHsl(h, s, l) {
  const hue = parseFloat(h);
  const saturation = parseFloat(s);
  const lightness = parseFloat(l);

  if (isNaN(hue) || hue < 0 || hue > 360) {
    return { valid: false, error: 'invalid hue value. must be 0-360' };
  }

  if (isNaN(saturation) || saturation < 0 || saturation > 100) {
    return { valid: false, error: 'invalid saturation value. must be 0-100' };
  }

  if (isNaN(lightness) || lightness < 0 || lightness > 100) {
    return { valid: false, error: 'invalid lightness value. must be 0-100' };
  }

  return { valid: true, h: hue, s: saturation, l: lightness };
}

// validates cmyk values - each channel must be 0-100
function validateCmyk(c, m, y, k) {
  const values = [c, m, y, k];
  const names = ['c', 'm', 'y', 'k'];

  for (let i = 0; i < values.length; i++) {
    const val = parseFloat(values[i]);

    if (isNaN(val) || val < 0 || val > 100) {
      return { valid: false, error: `invalid ${names[i]} value. must be 0-100` };
    }
  }

  return { valid: true, c: parseFloat(c), m: parseFloat(m), y: parseFloat(y), k: parseFloat(k) };
}

// converts hex to rgb object
function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');

  // expand 3-digit hex to 6 digits
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

// converts rgb to hex string
function rgbToHex(r, g, b) {
  const toHex = (val) => {
    const hex = val.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

// converts rgb to hsl
function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    if (max === rNorm) {
      h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
    }

    if (max === gNorm) {
      h = (bNorm - rNorm) / diff + 2;
    }

    if (max === bNorm) {
      h = (rNorm - gNorm) / diff + 4;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// converts hsl to rgb
function hslToRgb(h, s, l) {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r, g, b;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// converts rgb to cmyk
function rgbToCmyk(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

// converts cmyk to rgb
function cmykToRgb(c, m, y, k) {
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;

  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

// finds the closest named color using euclidean distance in rgb space
function findClosestColorName(r, g, b) {
  let closestName = 'Unknown';
  let minDistance = Infinity;

  const entries = Object.entries(COLOR_NAMES);

  for (let i = 0; i < entries.length; i++) {
    const [hex, name] = entries[i];
    const rgb = hexToRgb(hex);

    const distance = Math.sqrt(
      Math.pow(r - rgb.r, 2) + Math.pow(g - rgb.g, 2) + Math.pow(b - rgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestName = name;
    }
  }

  return closestName;
}

// converts color from any format to all other formats
function convertColor(input) {
  try {
    const { from } = input;
    let rgb = null;

    if (from === 'hex') {
      const validation = validateHex(input.hex);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      rgb = hexToRgb(validation.hex);
    }

    if (from === 'rgb') {
      const validation = validateRgb(input.r, input.g, input.b);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      rgb = { r: validation.r, g: validation.g, b: validation.b };
    }

    if (from === 'hsl') {
      const validation = validateHsl(input.h, input.s, input.l);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      rgb = hslToRgb(validation.h, validation.s, validation.l);
    }

    if (from === 'cmyk') {
      const validation = validateCmyk(input.c, input.m, input.y, input.k);

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      rgb = cmykToRgb(validation.c, validation.m, validation.y, validation.k);
    }

    if (!rgb) {
      return { success: false, error: 'invalid from parameter. use hex, rgb, hsl, or cmyk' };
    }

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const colorName = findClosestColorName(rgb.r, rgb.g, rgb.b);

    return {
      success: true,
      data: {
        hex,
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
        cmyk: { c: cmyk.c, m: cmyk.m, y: cmyk.y, k: cmyk.k },
        colorName
      }
    };
  } catch (error) {
    return { success: false, error: `color conversion failed: ${error.message}` };
  }
}

module.exports = {
  validateHex,
  validateRgb,
  validateHsl,
  validateCmyk,
  convertColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb,
  findClosestColorName
};
