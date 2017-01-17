#pragma glslify: latitude = require(../lib/latitude.glsl);
#pragma glslify: longitude = require(../lib/longitude.glsl);
#pragma glslify: normal = require(./lib/normal.glsl, field=field)
#pragma glslify: orenn = require(glsl-diffuse-oren-nayar)
#pragma glslify: gauss = require(glsl-specular-gaussian)
#pragma glslify: rotateVec3 = require(../../lib/rotateVec3.glsl)
#pragma glslify: crinklyNormal = require(./lib/crinklyNormal.glsl);
#pragma glslify: gradientSample = require(./lib/gradientSample.glsl)
#pragma glslify: oil = require(./lib/oil.glsl)
#pragma glslify: glitter = require(./lib/glitter.glsl)
#pragma glslify: twist = require(../field/lib/twist);
#pragma glslify: envMap = require(./lib/envMap);


const float PI = 3.14159;
const float PI2 = PI * 2.;

uniform float oiliness;
uniform samplerCube marbleTexture;
uniform sampler2D backgroundTexture;
uniform float marbleAmount;

//uniform sampler2D texture;

vec3 pointLight(
    vec3 p,
    vec3 nor,
    vec3 eye,
    vec3 position,
    vec3 diffuseColor,
    float roughness,
    float specularity,
    vec3 specColor
) {
    
    vec3 dir = normalize( position - p );
    
    float diffuse = orenn( dir, eye, nor, roughness, 1. );
    
    float spec = gauss( dir, eye, nor, specularity );
    
    return diffuse * diffuseColor + spec * clamp( specColor, 0., 1. );
    
}

vec3 pointLight( vec3 p, vec3 nor, vec3 eye, vec3 position, vec3 color ) {
    
    return pointLight( p, nor, eye, position, color, .15, .05, vec3(1.) );
    
}

vec3 render( in vec3 p, const in vec3 eye, const in vec2 mouse, float ao ) {
    
    vec3 rotP = p;
    vec3 n = normal( p );
    vec3 pn = normalize( normalize(p) + n );
    vec3 rotN = n;
    
    #if rotateX_nonzero
    
        rotP = rotateVec3( p, vec3( 1., 0, 0.), time );
        rotN = rotateVec3( n, vec3( 1., 0, 0.), time );
    
    #endif
    
    #if rotateY_nonzero
    
        rotP = rotateVec3( p, vec3( sin(time / 2.33), 1, 0.), time );
        rotN = rotateVec3( n, vec3( sin(time / 2.33), 1, 0.), time );
    
    #endif
    
    //n = normalize( n - noiseNormal( normalize(cross(n, p)).xy * 5. ) * .25 );
    
    vec3 baseColor = gradientSample( rotP, time );
    
    vec3 marbleColor = vec3(1.) - baseColor;
    float marble = 0.;
    
    float lat = latitude( rotN ) / (PI / 2.);
    float lng = longitude( rotN ) / (PI / 2.);
    vec2 latLng = vec2( abs( lat ), lng );
    
    #if marbleAmount_nonzero
    
        float marbleOpacity = clamp( marbleAmount * 20., 0., 1.);
        vec3 marbleSample = rotP + rotN;
        float marbleTex = ( textureCube( marbleTexture, marbleSample ).r ) * marbleOpacity;
        marbleColor = mix( marbleColor, vec3(1.), marbleTex );
        
        marble = 1. - smoothstep( marbleAmount - 1.2, marbleAmount, marbleTex );
    
    #endif
    
    vec3 diffuse = mix(baseColor, marbleColor, marble);
    
    //vec3 bump = crinklyNormal(p + rotN);
    //n = normalize( n + bump * .2 );
    
    vec3 emissive = vec3(.7, .7, .7) * 0.;
    vec3 ambient = mix( mix( vec3(.5), vec3(.3), marbleAmount), vec3(.1), marble);// * ao;
    float roughness = mix( mix( .15, 0., marbleAmount), .3, marble);
    float specularity = mix(.05, .5, marble);
    vec3 specColor = mix(vec3(.3), vec3(0.), marble);
    
    // vec3 rotP = rotateVec3( p, vec3(.2, .9, .4), time );
    // float stripes = step( .8, fract( rotP.x * 10. ) );
    
    vec3 light = ambient;
    
    vec3 mouseLightPosition = vec3( camera.xy + mouse * 2., -3. );
    vec3 oilColor = vec3(0.);
    
    #if oiliness_nonzero
        oilColor = oil( p, n, mouseLightPosition ) * 3.;
    #endif
    
    vec3 mouseLightColor = mix( vec3(.8, .8, .8), oilColor, oiliness );
    //vec3 mouseLightPosition = vec3( mouse * 8., -4. + length(mouse) * 4. );
    light += pointLight( p, n, eye, mouseLightPosition, mouseLightColor, roughness, specularity, specColor );
    
    vec3 light1Position = vec3(0., 3., 0.);
    vec3 light1Color = vec3( 1.4, .8, .9 ) * .5;
    light += pointLight( p, n, eye, light1Position, light1Color, roughness, specularity, specColor );
    
    vec3 light2Position = vec3(-1., -1., -.7);
    vec3 light2Color = vec3( .7, .2, .1 ) * .5;
    light += pointLight( p, n, eye, light2Position, light2Color, roughness, specularity, specColor );
    
    //vec2 points2 = vec2(1.) - step( vec2(.1), mod( pn.xy * vec2(20.), vec2(2.) ) );
    //float points = points2.x * points2.y * 10.;
    
    //vec2 env = envMap( -eye, n );
    
    light = clamp( light, 0., .95 );
    
    vec3 color = emissive + diffuse * light;
    
    float points = smoothstep( .85, 1., 1. - length( mod( pn.xy * 14., vec2(1.) ) - .5 ) );
    
    color = mix( color, vec3(1.), points );
    
    #if backgroundTexture_nonzero
        
        vec3 refracted = refract( -eye, pn, 1.333 );
        refracted = refract( refracted, vec3( pn.xy, -pn.z ), .75 );
        
        vec3 bg = 1. - texture2D( backgroundTexture, refracted.xy * vec2(.25, .5) + .5 ).rgb;
        
        color = mix( color, vec3(1.), bg * ( 1. - abs(n.z) ) );
    
    #endif
    
    // gamma!?
    color = pow( color, vec3(0.5545) );
    
    return color;
    
}

#pragma glslify: export(render)