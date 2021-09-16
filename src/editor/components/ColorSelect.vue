<template>
	<div>
		<div v-if="resolved_colors.length" class="__cs-flex-1 __cs-flex __cs-flex-col __cs-space-y-2">
			<template v-for="([token, color], i) in resolved_colors" :key="token">
				<div v-if="!isColorAliasResolutionError(color) && (!omit || !omit.includes(token.toString()))" class="__cs-space-y-2 ">
					<div class="__cs-flex">
						<button @click="open[token] = !open[token]" type="button" :tabindex="i*100000" class="__cs-outline-none focus:__cs-border-2 __cs-border-blue-600 __cs-rounded-l-md __cs-flex __cs-justify-center __cs-items-center __cs-w-8 __cs-bg-gray-800 __cs-cursor-pointer">
							<svg-icon v-if="isColorSolid(color)" name="dot" class="__cs-inline-block __cs-h-3 __cs-fill-gray-500" />
							<svg-icon v-if="isColorScale(color)" :name="open[token] ? 'caret-down': 'caret-forward'" class="__cs-inline-block __cs-h-3 __cs-fill-gray-500" />
						</button>
						<label class="__cs-cursor-pointer __cs-relative __cs-flex __cs-group focus-within:__cs-ring-2 __cs-flex-1 __cs-rounded-r-md">
							<input type="radio" :tabindex="i*100000+1" name="selected_token" :value="token" v-model="value" class="__cs-absolute __cs-inset-0  __cs-peer __cs-opacity-0" />
							<div class="__cs-flex-1 __cs-border-2 __cs-border-r-0 __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-flex __cs-items-center __cs-space-x-2">
								<div class="__cs-grid __cs-grid-stack __cs-overflow-hidden after:__cs-border-3 __cs-rounded after:__cs-border-black after:__cs-rounded-md before:__cs-rounded before:__cs-bg-transparency-grid before:__cs-m-px">
									<svg viewBox="0 0 1 1" class="__cs-h-6" />
									<div v-if="isColorSolid(color)" class="__cs-m-px __cs-rounded" :style="`background-color: ${ hsvaToHex(color) };`"></div>
									<div v-if="isColorScale(color)" class="__cs-m-px __cs-rounded __cs-flex __cs-overflow-hidden">
										<div v-for="(hex, modifier) in colorScaleHexValues(color)" :key="`swatch-${token}-${modifier}`" class="__cs-flex-grow" :style="`background-color: ${ hex };`"></div>
									</div>
								</div>
								<div class="__cs-flex-1">
									{{ token }}
									<span v-if="isColorAlias(colors[token])" class="__cs-text-sm __cs-text-gray-500">{{ colors[token] }}</span>
									<span v-else-if="isColorSolid(color)" class="__cs-text-sm __cs-text-gray-500">{{ hsvaToHex(color) }}</span>
								</div>
							</div>
							<div class="__cs-flex peer-checked:__cs-hidden __cs-px-4 __cs-items-center __cs-border-2 __cs-border-l-0 __cs-rounded-l-none __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-rounded-md"><svg viewBox="0 0 1 1" class="__cs-h-3 __cs-rounded-full __cs-bg-gray-300" /></div>
							<div class="__cs-hidden peer-checked:__cs-flex __cs-px-4 __cs-items-center __cs-border-2 __cs-border-l-0 __cs-rounded-l-none __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-rounded-md"><svg viewBox="0 0 1 1" class="__cs-h-3 __cs-rounded-full __cs-bg-blue-500 __cs-border-2 __cs-border-gray-300" /></div>
						</label>
					</div>
					<div v-if="isColorScale(color) && open[token]" class="__cs-pl-8 __cs-flex __cs-flex-col __cs-space-y-2">
						<template v-for="(hex, modifier, j) in colorScaleHexValues(color)" :key="`token-${token}-${modifier}`">
							<label v-if="!omit || !omit.includes(`${token}.${modifier}`)" class="__cs-cursor-pointer __cs-relative __cs-flex __cs-group focus-within:__cs-ring-2 __cs-rounded-md">
								<input type="radio" :tabindex="i*100000+j+2" name="selected_token" :value="`${token}.${modifier}`" v-model="value" class="__cs-absolute __cs-inset-0  __cs-peer __cs-opacity-0" />
								<div class="__cs-flex-1 __cs-border-2 __cs-border-r-0 __cs-rounded-r-none __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-rounded-md __cs-flex __cs-items-center __cs-space-x-2">
									<div class="__cs-grid __cs-grid-stack __cs-overflow-hidden after:__cs-border-3 __cs-rounded after:__cs-border-black after:__cs-rounded-md before:__cs-rounded before:__cs-bg-transparency-grid before:__cs-m-px">
										<svg viewBox="0 0 1 1" class="__cs-h-6" />
										<div class="__cs-m-px __cs-rounded" :style="`background-color: ${ hex };`"></div>
									</div>
									<div class="__cs-flex-1">
										{{ token }}-{{ modifier }}
										<span v-if="isColorAlias(colors[token])" class="__cs-text-sm __cs-text-gray-500">{{ colors[token] }}.{{ modifier }}</span>
										<span v-else class="__cs-text-sm __cs-text-gray-500">{{ hex }}</span>
									</div>
								</div>
								<div class="__cs-flex peer-checked:__cs-hidden __cs-px-4 __cs-items-center __cs-border-2 __cs-border-l-0 __cs-rounded-l-none __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-rounded-md"><svg viewBox="0 0 1 1" class="__cs-h-3 __cs-rounded-full __cs-bg-gray-300" /></div>
								<div class="__cs-hidden peer-checked:__cs-flex __cs-px-4 __cs-items-center __cs-border-2 __cs-border-l-0 __cs-rounded-l-none __cs-border-gray-800 __cs-bg-gray-700 group-hover:__cs-bg-gray-600 peer-checked:__cs-border-blue-600 __cs-p-2 __cs-rounded-md"><svg viewBox="0 0 1 1" class="__cs-h-3 __cs-rounded-full __cs-bg-blue-500 __cs-border-2 __cs-border-gray-300" /></div>
							</label>
						</template>
					</div>
				</div>
			</template>
		</div>
		<div v-else class="__cs-flex-1 __cs-flex __cs-items-center __cs-justify-center __cs-text-gray-600">
			Your palette is empty.
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, nextTick, PropType, computed } from 'vue';
import { useColorService } from '../services/color'
import { isColorSolid, isColorScale, isColorAlias, isColorAliasResolutionError } from '../lib/utils.color-suite';
import { hsvaToHex } from '../lib/color'
import { colorScaleHexValues } from '../lib/color-scale'
import { resolveAlias } from '../lib/color-alias';
import { CSColor, CSColorAliasResolutionError } from '../../types'

export default defineComponent({
	props: {
		modelValue:String,
		omit:Array as PropType<string[]>
	},
	setup(props, { emit }) {
		const { colors } = useColorService()
		const tokens = computed(() => props.modelValue?.split('.'))
		const token_root = computed(() => tokens.value ? tokens.value[0] : undefined)
		const open = reactive<{ [key:string]:boolean }>({ ...(token_root.value && tokens.value!.length > 1 ? { [token_root.value]: true } : {} ) })

		const value = ref<string|undefined>('')

		const flush = 'sync'
		let syncing = false
		watch(() => props.modelValue, (new_value) => {
			syncing = true
			value.value = new_value
			nextTick(() => syncing = false)
		}, { flush, immediate: true })
		watch(value, (new_value) => {
			if (syncing) syncing = false
			else emit('update:modelValue', new_value)
		}, { flush, immediate: false })

		const resolved_colors = computed<[string, CSColor|CSColorAliasResolutionError][]>(() => Object.entries(colors).map(([token, color]) => {
			if (isColorAlias(color)) return [token, resolveAlias(color)]
			return [token, color]
		}))

		let order = 0
		return {
			value,
			order,
			open,
			colors,
			resolved_colors,
			hsvaToHex,
			colorScaleHexValues,
			isColorAliasResolutionError,
			isColorAlias,
			isColorSolid,
			isColorScale
		}
	},
})
</script>
