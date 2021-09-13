import { CSComponentCurve } from '../../types'
import { Point } from './point'
import { BezierCurve } from './bezier-curve'

export function componentCurveToBezierPoints(curve:CSComponentCurve):{start:[Point, Point, Point, Point], end:[Point, Point, Point, Point]} {
	let start = new Point(curve.start, 0)
	let mid = new Point(curve.mid, 0.5)
	let end = new Point(curve.end, 1)
	
	let C1 = Point.max(0, Point.min(1, Point.add(start, new Point(curve.controls[0]))))
	let C2 = Point.max(0, Point.min(1, Point.add(mid, new Point(curve.controls[1]))))
	let C3 = Point.max(0, Point.min(1, Point.add(mid, new Point(curve.controls[2]))))
	let C4 = Point.max(0, Point.min(1, Point.add(end, new Point(curve.controls[3]))))

	return {
		start: [start, C1, C2, mid],
		end: [mid, C3, C4, end]
	}
}

export function sampleComponentCurve(component:CSComponentCurve, y:number, max:number = 100) {
	let { start, end } = componentCurveToBezierPoints(component)
	let start_bezier = new BezierCurve(start)
	let end_bezier = new BezierCurve(end)

	if (y < 0.5) return start_bezier.getXForY(y) * max
	if (y == 0.5) return start[3].x * max
	return end_bezier.getXForY(y) * max
}