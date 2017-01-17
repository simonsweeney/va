precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform vec3 camera;

const int RAYMARCH_STEPS = 40;
const float RAYMARCH_PRECISION = .01;
const float RAYMARCH_MAX_DISTANCE = 9.;

const float fov = 1.4142135624; // 45 degrees

#pragma glslify: field = require( ./field/field.glsl, time=time )
#pragma glslify: contain = require( ./lib/contain.glsl, resolution = resolution)
#pragma glslify: cover = require( ./lib/cover.glsl, resolution = resolution)
#pragma glslify: raymarch = require( ./lib/raymarch.glsl, field = field, steps = RAYMARCH_STEPS, precis = RAYMARCH_PRECISION, maxDistance = RAYMARCH_MAX_DISTANCE)
#pragma glslify: material = require( ./material/material.glsl, time=time, field=field, camera=camera, background=background)
#pragma glslify: rayPlaneIntersect = require( ./lib/rayPlaneIntersect.glsl )
#pragma glslify: shadow = require( ./lib/shadow.glsl, time=time,field=field)

void main () {
    
    vec2 p = contain( gl_FragCoord.xy );
    
    vec2 m = mouse;
    vec3 rayDirection = normalize( vec3( p, fov ) );
    vec3 collision;
    
    int steps;
    
    vec3 color = vec3(0.);
    float alpha = 0.;
    
    float planeDistance;
    
    if ( raymarch( camera, rayDirection, collision, steps ) ) {
        
        float ao = float(steps - 1) / float(RAYMARCH_STEPS - 1);
        
        ao = pow( 1. - smoothstep( .05, 1., ao ), 2.) * .65 + .35;
        
        color = material( collision, -rayDirection, m, ao );
        alpha = 1.;
        
    } else if( -1. != rayPlaneIntersect( camera, rayDirection, vec4( 0., 1., 0., camera.z * -.5 ), planeDistance ) ) {
        
        vec3 pShadow = camera + rayDirection * planeDistance;
        
        alpha = shadow( pShadow );
        
    }
    
    if ( false ) {
    
        alpha = 1.;
        
        color = vec3( float(steps - 1) / float(RAYMARCH_STEPS - 1) );
    
    }
    
    gl_FragColor = vec4( color, alpha );
    
}