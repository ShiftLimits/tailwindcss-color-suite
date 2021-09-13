import { isReactive, reactive, Ref, watch } from 'vue';

export function debounceAnimationFrame<F extends (...args:any[]) => any>(fn:F) {
	let animation_frame:number;
	return function(...args:Parameters<F>) {
		cancelAnimationFrame(animation_frame)
		return new Promise<ReturnType<F>>(res => {
			animation_frame = requestAnimationFrame(() => res(fn(...args)))
		})
	}
}

export function reactiveCloneDeep<T = ReturnType<typeof reactive>>(object:ReturnType<typeof reactive>) {
	const new_object = reactive(Object.create(Object.getPrototypeOf(object)))

	if (isReactive(object)) {
		for (let [key, value] of Object.entries(object)) {
			if (typeof value === "object" || Array.isArray(value)) new_object[key] = reactiveCloneDeep(value)
			else new_object[key] = value
		}
	}

	return new_object as T
}

