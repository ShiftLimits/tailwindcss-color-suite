export function debounceAnimationFrame<F extends (...args:any[]) => any>(fn:F) {
	let animation_frame:number;
	return function(...args:Parameters<F>) {
		cancelAnimationFrame(animation_frame)
		return new Promise<ReturnType<F>>(res => {
			animation_frame = requestAnimationFrame(() => res(fn(...args)))
		})
	}
}
