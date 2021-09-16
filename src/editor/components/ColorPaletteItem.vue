<template>
	<abstract-button :is="locked ? 'div' : null" :to="locked ? null : `/colors/${token}`" class="__cs-group __cs-flex __cs-border-b __cs-border-black" :class="{ '__cs-bg-red-900 hover:__cs-bg-red-800': has_error, '__cs-bg-gray-700 hover:__cs-bg-gray-600': !has_error }">
		<div class="__cs-p-2 __cs-flex">
			<div class="handle __cs-rounded-sm __cs-bg-gray-800 hover:__cs-bg-gray-900 __cs-w-3 __cs-cursor-move" :class="{ '__cs-invisible': locked }"></div>
		</div>
		<div class="__cs-flex-1 __cs-min-w-0 __cs-flex __cs-flex-col">
			<div class="__cs-flex __cs-p-2 __cs-bg-gray-900 __cs-rounded-bl-lg">
				<div class="__cs-flex-1 __cs-grid __cs-grid-stack __cs-h-7  __cs-rounded-md __cs-overflow-hidden after:__cs-border-3 after:__cs-border-black after:__cs-rounded-md before:__cs-rounded-md before:__cs-bg-transparency-grid before:__cs-m-px">
					<div v-if="css" class="__cs-m-px __cs-rounded-md" :style="`background-color: ${ color };`"></div>
					<div v-else-if="isColorSolid(resolved_color)" class="__cs-m-px __cs-rounded-md" :style="`background-color: ${ hsvaToHex(resolved_color) };`"></div>
					<div v-else-if="isColorScale(resolved_color)" class="__cs-m-px __cs-rounded-md __cs-flex __cs-overflow-hidden">
						<div v-for="(hex, modifier) in colorScaleHexValues(resolved_color)" :key="`swatch-${token}-${modifier}`" class="__cs-flex-grow" :style="`background-color: ${ hex };`"></div>
					</div>
				</div>
			</div>
			<div class="__cs-flex __cs-space-x-2 __cs-bg-gray-900 __cs-square-only-child __cs-h-8">
				<div class="__cs-flex-1 __cs-min-w-0 __cs-overflow-ellipsis __cs-overflow-hidden __cs-whitespace-nowrap  __cs-font-semibold __cs-rounded-tr-lg __cs-pt-1 __cs-px-3"  :class="{ '__cs-bg-red-900 group-hover:__cs-bg-red-800': has_error, '__cs-bg-gray-700 group-hover:__cs-bg-gray-600': !has_error }">
					{{ token }}
					<span v-if="isColorAlias(color) && !css" class="__cs-text-xs" :class="{'__cs-text-gray-200':has_error, '__cs-text-gray-400': !has_error}">{{ has_error ? resolved_color.message : color }}</span>
					<span v-if="help" class="__cs-text-xs __cs-text-gray-400">{{ help }}</span>
				</div>
				<slot />
			</div>
		</div>
	</abstract-button>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { CSColor, CSColorAliasResolutionError } from '../../types'
import { hsvaToHex } from '../lib/color'
import { resolveAlias } from '../lib/color-alias'
import { colorScaleHexValues } from '../lib/color-scale'
import { isColorAlias, isColorScale, isColorSolid, isColorAliasResolutionError } from '../lib/utils.color-suite'
import { useColorService } from '../services/color'

export default defineComponent({
	props: {
		token:String,
		color: {
			type: [String, Object] as PropType<CSColor>,
			required: true
		},
		help:String,
		locked:Boolean,
		css:Boolean
	},
	setup(props) {
		const { colors } = useColorService()
		const resolved_color = computed<CSColor|CSColorAliasResolutionError>(() => {
			if (isColorAlias(props.color)) return resolveAlias(props.color, colors)
			return props.color
		})

		const has_error = computed<boolean>(() => {
			return isColorAliasResolutionError(resolved_color.value) && !props.css
		})

		return {
			has_error,
			resolved_color,
			hsvaToHex,
			colorScaleHexValues,
			isColorAliasResolutionError,
			isColorAlias,
			isColorScale,
			isColorSolid
		}
	}
})
</script>
