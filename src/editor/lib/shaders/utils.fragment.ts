import { glsl } from '../glsl'

export const CommonUniforms = glsl`
uniform vec2 resolution;
`

export const CommonUtils = glsl`
#define EPSILON 0.000001

bool approximately(float a, float b) {
	return abs(a - b) <= EPSILON;
}
`

export const ColorConversionUtils = glsl`
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
`
export const BezierUtils = glsl`
#define PI 3.1415926535897932384626433832795
#define TAU PI*2.0

float D(float t) { return t * t * t; }
float C(float t) { return 3.0 * t * t         * (1.0 - t); }
float B(float t) { return 3.0 * t * (1.0 - t) * (1.0 - t); }
float A(float t) { return (1.0 - t) * (1.0 - t) * (1.0 - t); }

vec2 CubicBezier(float t, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
	return P0*A(t) + P1*B(t) + P2*C(t) + P3*D(t);
}

float cuberoot(float v) {
	return v < 0.0 ? -pow(-v, 1.0 / 3.0) : pow(v, 1.0 / 3.0);
}

float reduce(float v) {
	return clamp(v, 0.0, 1.0);
}

float getRoot(float pa, float pb, float pc, float pd) {

	float d = -pa + 3.0 * pb - 3.0 * pc + pd;
	float a = 3.0 * pa - 6.0 * pb + 3.0 * pc;
	float b = -3.0 * pa + 3.0 * pb;
	float c = pa;

	if (approximately(d, 0.0)) {
		// this is not a cubic curve.
		if (approximately(a, 0.0)) {
			// in fact, this is not a quadratic curve either.
			if (approximately(b, 0.0)) {
				// in fact in fact, there are no solutions.
				return 0.0;
			}
			// linear solution:
			return reduce(-c / b);
		}
		// quadratic solution:
		float q = sqrt(b * b - 4.0 * a * c);
		float a2 = 2.0 * a;
		return reduce((q - b) / a2);
	}

	// at this point, we know we need a cubic solution:
	a /= d;
	b /= d;
	c /= d;

	float p = (3.0 * b - a * a) / 3.0;
	float p3 = p / 3.0;
	float q = (2.0 * a * a * a - 9.0 * a * b + 27.0 * c) / 27.0;
  float q2 = q / 2.0;
	float discriminant = q2 * q2 + p3 * p3 * p3;

	if (discriminant < 0.0) {
		float mp3 = -p / 3.0;
		float mp33 = mp3 * mp3 * mp3;
		float r = sqrt(mp33);
		float t = -q / (2.0 * r);
		float cosphi = (t < -1.0) ? -1.0 : (t > 1.0) ? 1.0 : t;
		float phi = acos(cosphi);
		float crtr = cuberoot(r);
		float t1 = 2.0 * crtr;

		float x1 = t1 * cos(phi / 3.0) - a / 3.0;
		float x2 = t1 * cos((phi + TAU) / 3.0) - a / 3.0;
		float x3 = t1 * cos((phi + 2.0 * TAU) / 3.0) - a / 3.0;
		if (0.0 <= x1 && x1 <= 1.0) return x1;
		if (0.0 <= x2 && x2 <= 1.0) return x2;
		if (0.0 <= x3 && x3 <= 1.0) return x3;
		return 0.0;
	} else if (discriminant == 0.0) {
		float u1 = (q2 < 0.0) ? cuberoot(-q2) : -cuberoot(q2);
		float x1 = 2.0 * u1 - a / 3.0;
		float x2 = -u1 - a / 3.0;
		return reduce(x1);
	} else {
		float sd = sqrt(discriminant);
		float u1 = cuberoot(-q2 + sd);
		float v1 = cuberoot(q2 + sd);
		return reduce(u1 - v1 - a / 3.0);
	}
}

float getTForYCubic(float y, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
	return getRoot(P0.y - y, P1.y - y, P2.y - y, P3.y - y);
}

float getXForYCubic(float y, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
	return CubicBezier(getTForYCubic(y, P0, P1, P2, P3), P0, P1, P2, P3).x;
}
`