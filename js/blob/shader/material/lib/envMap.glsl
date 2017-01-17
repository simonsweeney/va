vec2 envMap( vec3 eye, vec3 nor ) {
    
    vec3 r = reflect( eye, nor );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    return r.xy / m + .5;
    
}

#pragma glslify: export(envMap)