import { glsl } from '../../glsl'

export const HueUniforms = glsl`
uniform vec2 start_hue_curve_points[4];
uniform vec2 end_hue_curve_points[4];
`

export const SaturationUniforms = glsl`
uniform vec2 start_saturation_curve_points[4];
uniform vec2 end_saturation_curve_points[4];
`

export const ValueUniforms = glsl`
uniform vec2 start_value_curve_points[4];
uniform vec2 end_value_curve_points[4];
`