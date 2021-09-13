import { ColorHEX, ColorHSV, ColorHSVA, ColorRGB, ColorRGBA } from './types'

export function isRGBColor(color:any):color is ColorRGB {
	return typeof color == "object" && color.r != undefined && color.a == undefined
}
export function isRGBAColor(color:any):color is ColorRGBA {
	return typeof color == "object" && color.r != undefined && color.a != undefined
}
export function isHSVColor(color:any):color is ColorHSV {
	return typeof color == "object" && color.h != undefined && color.a == undefined
}
export function isHSVAColor(color:any):color is ColorHSVA {
	return typeof color == "object" && color.h != undefined && color.a != undefined
}
export function isHexColor(color:any):color is ColorHEX {
	return typeof color == 'string' && color[0] == '#' && (color.length == 7 || color.length == 9)
}

export function rgbToHSV({ r, g, b }:ColorRGB):ColorHSV {
	r /= 255, g /= 255, b /= 255

	let max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h = 0, s = 0, v = max

	let d = max - min
	s = max == 0 ? 0 : d / max

	if(max == min) {
			h = 0; // achromatic
	} else {
			switch(max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
			}
			h /= 6
	}

	h *= 360, s *= 100, v *= 100
  return { h, s, v }
}

export function rgbaToHSVA({ r, g, b, a = 100 }:ColorRGBA):ColorHSVA {
  return { ...rgbToHSV({ r, g, b }), a }
}

export function hsvToRGB({ h, s, v }:ColorHSV):ColorRGB {
	h /= 360, s /= 100, v /= 100

	let r = 0, g = 0, b = 0;

	let i = Math.floor(h * 6);
	let f = h * 6 - i;
	let p = v * (1 - s);
	let q = v * (1 - f * s);
	let t = v * (1 - (1 - f) * s);

	switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
	}

	r = Math.round(r * 255), g = Math.round(g * 255), b = Math.round(b * 255)
  return { r, g, b }
}

export function hsvaToRGBA({ h, s, v, a = 100 }:ColorHSVA):ColorRGBA {
  return { ...hsvToRGB({ h, s, v }), a }
}

function decToHex(decimal:number):string {
	return Math.round(decimal).toString(16).padStart(2, '0')
}

function hexToDec(hex:string):number {
	return parseInt(hex, 16)
}

export function rgbToHex({ r, g, b }:ColorRGB):ColorHEX {
  return `#${ decToHex(r) }${ decToHex(g) }${ decToHex(b) }`
}

export function rgbaToHex({ r, g, b, a = 100 }:ColorRGBA):ColorHEX {
  return rgbToHex({r, g, b }) + (a == 100 ? '' : decToHex(a * 2.55))
}

export function hexToRGB(hex:ColorHEX):ColorRGB {
	const [r, g, b] = (hex.slice(1).match(/.{1,2}/g) || []).map(hexToDec)
  return {
		r, g, b
	}
}

export function hexToRGBA(hex:ColorHEX):ColorRGBA {
	const [r, g, b, a] = (hex.slice(1).match(/.{1,2}/g) || []).map(hexToDec)
  return {
		...{ a: 100 }, // Make sure we always have alpha
		r, g, b, a
	}
}

export function hsvaToHex(hsva:ColorHSVA):ColorHEX {
	return rgbaToHex(hsvaToRGBA(hsva))
}

export function hexToHSVA(hex:ColorHEX):ColorHSVA {
	return rgbaToHSVA(hexToRGBA(hex))
}

export function isDarkColor(hex:ColorHEX) {
	const { r, g, b } = hexToRGBA(hex)

	let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
	return (yiq >= 128) ? false : true
}
