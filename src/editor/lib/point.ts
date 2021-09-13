export class Point {
	x:number = 0
	y:number = 0

	constructor()
	constructor(x:number, y:number)
	constructor(x_or_point_like:Partial<{x:number, y:number}>)
	constructor(x_or_point_like?:number|Partial<{x:number, y:number}>, y?:number) {
		if (typeof x_or_point_like == 'object') {
			const { x, y } = x_or_point_like
			if (x) this.x = x
			if (y) this.y = y
		} else if(typeof x_or_point_like == 'number') {
			this.x = x_or_point_like
			if (y) this.y = y
		}
	}

	toString() {
		return `${this.x * 100},${this.y * 100}`
	}

	toArray() {
		return [this.x, this.y]
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	static normalize(point:Point) {
		let length = point.length()
		if (length == 0) return new Point()
		return new Point(point.x / length, point.y / length)
	}

	static add(p1:Point, p2:Point) {
		return new Point(p1.x + p2.x, p1.y + p2.y)
	}

	static subtract(p1:Point, p2:Point) {
		return new Point(p1.x - p2.x, p1.y - p2.y)
	}

	static multiply(p1:Point, p2:Point) {
		return new Point(p1.x * p2.x, p1.y * p2.y)
	}

	static divide(p1:Point, p2:Point) {
		return new Point(p1.x / p2.x, p1.y / p2.y)
	}

	static min(min:number, p:Point) {
		return new Point(Math.min(min, p.x), Math.min(min, p.y))
	}

	static max(max:number, p:Point) {
		return new Point(Math.max(max, p.x), Math.max(max, p.y))
	}
}