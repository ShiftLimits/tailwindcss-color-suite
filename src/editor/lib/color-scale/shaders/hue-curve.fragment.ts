import { glsl } from "../../glsl"
import { ColorConversionUtils, CommonUtils, BezierUtils, CommonUniforms } from "../../shaders/utils.fragment"
import { HueUniforms, SaturationUniforms, ValueUniforms } from "./uniforms.fragment"

export default glsl`#version 300 es

precision highp float;

${ CommonUniforms }
${ SaturationUniforms }
${ ValueUniforms }
out vec4 color;

${ CommonUtils }
${ ColorConversionUtils }
${ BezierUtils }

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;
	float y = 1.0 - uv.y;

	vec2 saturation_p1 = y < 0.5 ? start_saturation_curve_points[0] : end_saturation_curve_points[0];
	vec2 saturation_p2 = y < 0.5 ? start_saturation_curve_points[1] : end_saturation_curve_points[1];
	vec2 saturation_p3 = y < 0.5 ? start_saturation_curve_points[2] : end_saturation_curve_points[2];
	vec2 saturation_p4 = y < 0.5 ? start_saturation_curve_points[3] : end_saturation_curve_points[3];
	float saturation = getXForYCubic(y, saturation_p1, saturation_p2, saturation_p3, saturation_p4);

	vec2 value_p1 = y < 0.5 ? start_value_curve_points[0] : end_value_curve_points[0];
	vec2 value_p2 = y < 0.5 ? start_value_curve_points[1] : end_value_curve_points[1];
	vec2 value_p3 = y < 0.5 ? start_value_curve_points[2] : end_value_curve_points[2];
	vec2 value_p4 = y < 0.5 ? start_value_curve_points[3] : end_value_curve_points[3];
	float value = getXForYCubic(y, value_p1, value_p2, value_p3, value_p4);

	color = vec4(
		hsv2rgb(
			vec3(
				uv.x, // hue
				saturation, // saturation
				value // value
			)
		),
		1.0
	);
}
`