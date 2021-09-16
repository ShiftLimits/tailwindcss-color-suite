import { Point } from './point';

const EPSILON = 0.000001
const TAU = Math.PI * 2
function approximately(a:number,b:number,precision?:number) {
	return Math.abs(a-b) <= (precision || EPSILON)
}
function cuberoot(v:number) {
	return v < 0 ? -Math.pow(-v, 1 / 3) : Math.pow(v, 1 / 3);
}

function getRoots(pa:number, pb:number, pc:number, pd:number) {
	var reduce = function(t) {
		return 0 <= t && t <= 1;
	}

	var d = -pa + 3 * pb - 3 * pc + pd,
			a = 3 * pa - 6 * pb + 3 * pc,
			b = -3 * pa + 3 * pb,
			c = pa;

	if (approximately(d, 0)) {
		// this is not a cubic curve.
		if (approximately(a, 0)) {
			// in fact, this is not a quadratic curve either.
			if (approximately(b, 0)) {
				// in fact in fact, there are no solutions.
				return [];
			}
			// linear solution:
			return [-c / b].filter(reduce);
		}
		// quadratic solution:
		var q = Math.sqrt(b * b - 4 * a * c),
			a2 = 2 * a;
		return [(q - b) / a2, (-b - q) / a2].filter(reduce);
	}

	// at this point, we know we need a cubic solution:

	a /= d;
	b /= d;
	c /= d;

	var p = (3 * b - a * a) / 3,
		p3 = p / 3,
		q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
		q2 = q / 2,
		discriminant = q2 * q2 + p3 * p3 * p3,
		u1,
		v1,
		x1,
		x2,
		x3;
	if (discriminant < 0) { // Discriminant is negative, there are 3 roots
		var mp3 = -p / 3,
			mp33 = mp3 * mp3 * mp3,
			r = Math.sqrt(mp33),
			t = -q / (2 * r),
			cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
			phi = Math.acos(cosphi),
			crtr = cuberoot(r),
			t1 = 2 * crtr;
		x1 = t1 * Math.cos(phi / 3) - a / 3;
		x2 = t1 * Math.cos((phi + TAU) / 3) - a / 3;
		x3 = t1 * Math.cos((phi + 2 * TAU) / 3) - a / 3;
		return [x1, x2, x3].filter(reduce);
	} else if (discriminant === 0 && p + q != 0) { // Discriminant is zero, there are two roots
		u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
		x1 = 2 * u1 - a / 3;
		x2 = -u1 - a / 3;
		return [x1, x2].filter(reduce);
	} else { // Discriminant is positive, there is one root
		var sd = Math.sqrt(discriminant);
		u1 = cuberoot(-q2 + sd);
		v1 = cuberoot(q2 + sd);
		return [u1 - v1 - a / 3].filter(reduce);
	}
}

export class BezierCurve {
	P1:Point = new Point(0, 0)
	P2:Point = new Point(0.5, 0.5)
	P3:Point = new Point(0.5, 0.5)
	P4:Point = new Point(1, 1)

	constructor(points:[Point, Point, Point, Point]) {
		this.P1 = points[0]
		this.P2 = points[1]
		this.P3 = points[2]
		this.P4 = points[3]
	}

	sample(t:number) {
		const inverse_t = 1-t;
		const a = inverse_t * inverse_t * inverse_t
		const b = 3 * t * inverse_t * inverse_t
		const c = 3 * t * t * inverse_t
		const d = t * t * t

		return new Point(
			this.P1.x * a + this.P2.x * b + this.P3.x * c + this.P4.x * d,
			this.P1.y * a + this.P2.y * b + this.P3.y * c + this.P4.y * d
		)
	}

	getTForY(y:number) {
		let roots = getRoots(this.P1.y - y, this.P2.y - y, this.P3.y - y, this.P4.y - y)
		return roots[0]
	}

	getXForY(y:number) {
		let t:number

		if (y == 0 || y == 1) t = y
		else t = this.getTForY(y)

		return this.sample(t).x
	}
}