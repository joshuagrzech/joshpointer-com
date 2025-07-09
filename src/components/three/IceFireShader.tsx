import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface IceFireShaderProps {
  shader?: 'icefire' | 'custom';
  customVertexShader?: string;
  customFragmentShader?: string;
  uniforms?: Record<string, any>;
  resolution?: number;
  intensity?: number;
  speed?: number;
  interactive?: boolean;
  // Color customization props
  colorA?: THREE.Color | string;
  colorB?: THREE.Color | string;
  colorC?: THREE.Color | string;
  colorD?: THREE.Color | string;
}

// Constants for positioning behind phone model
const PHONE_MODEL_Z = 0;
const SAFETY_BUFFER = 1.5;
const MAX_FORWARD_Z = PHONE_MODEL_Z - SAFETY_BUFFER;

const IceFireShader: React.FC<IceFireShaderProps> = ({
  shader = 'icefire',
  customVertexShader,
  customFragmentShader,
  uniforms: customUniforms = {},
  resolution = 1024,
  intensity = 1.0,
  speed = 1.0,
  interactive = true,
  colorA = '#808080', // Default gray
  colorB = '#404040', // Default dark gray
  colorC = '#CCCC80', // Default light yellow
  colorD = '#000080', // Default dark blue
}) => {
  const { mouse, viewport, camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Enhanced vertex shader for all presets
  const vertexShader =
    customVertexShader ||
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Convert color props to THREE.Color objects
  const colors = useMemo(() => {
    const parseColor = (color: THREE.Color | string) => {
      if (color instanceof THREE.Color) {
        return color;
      }
      return new THREE.Color(color);
    };

    return {
      a: parseColor(colorA),
      b: parseColor(colorB),
      c: parseColor(colorC),
      d: parseColor(colorD),
    };
  }, [colorA, colorB, colorC, colorD]);

  // Ice and Fire shader preset
  const iceFireShader = `
    /* ice and fire, by mattz
       License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
       Demonstrate triangulation of jittered triangular lattice.
    */
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_speed;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_colorC;
    uniform vec3 u_colorD;
    varying vec2 vUv;

    const float s3 = 1.7320508075688772;
    const float i3 = 0.5773502691896258;

    const mat2 tri2cart = mat2(1.0, 0.0, -0.5, 0.5*s3);
    const mat2 cart2tri = mat2(1.0, 0.0, i3, 2.0*i3);

    //////////////////////////////////////////////////////////////////////
    // cosine based palette with customizable colors
    vec3 pal( in float t ) {
        return clamp(u_colorA + u_colorB*cos( 6.28318*(u_colorC*t+u_colorD) ), 0.0, 1.0);
    }

    //////////////////////////////////////////////////////////////////////
    // from https://www.shadertoy.com/view/4djSRW

    #define HASHSCALE1 .1031
    #define HASHSCALE3 vec3(443.897, 441.423, 437.195)

    float hash12(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);   
    }

    vec2 hash23(vec3 p3) {
        p3 = fract(p3 * HASHSCALE3);
        p3 += dot(p3, p3.yzx+19.19);
        return fract((p3.xx+p3.yz)*p3.zy);
    }

    //////////////////////////////////////////////////////////////////////
    // compute barycentric coordinates from point differences
    vec3 bary(vec2 v0, vec2 v1, vec2 v2) {
        float inv_denom = 1.0 / (v0.x * v1.y - v1.x * v0.y);
        float v = (v2.x * v1.y - v1.x * v2.y) * inv_denom;
        float w = (v0.x * v2.y - v2.x * v0.y) * inv_denom;
        float u = 1.0 - v - w;
        return vec3(u,v,w);
    }

    //////////////////////////////////////////////////////////////////////
    // distance to line segment from point differences

    float dseg(vec2 xa, vec2 ba) {
        return length(xa - ba*clamp(dot(xa, ba)/dot(ba, ba), 0.0, 1.0));
    }

    //////////////////////////////////////////////////////////////////////
    // generate a random point on a circle from 3 integer coords (x, y, t)

    vec2 randCircle(vec3 p) {
        vec2 rt = hash23(p);
        float r = sqrt(rt.x);
        float theta = 6.283185307179586 * rt.y;
        return r*vec2(cos(theta), sin(theta));
    }

    //////////////////////////////////////////////////////////////////////
    // make a time-varying cubic spline at integer coords p that stays
    // inside a unit circle

    vec2 randCircleSpline(vec2 p, float t) {
        // standard catmull-rom spline implementation
        float t1 = floor(t);
        t -= t1;
        
        vec2 pa = randCircle(vec3(p, t1-1.0));
        vec2 p0 = randCircle(vec3(p, t1));
        vec2 p1 = randCircle(vec3(p, t1+1.0));
        vec2 pb = randCircle(vec3(p, t1+2.0));
        
        vec2 m0 = 0.5*(p1 - pa);
        vec2 m1 = 0.5*(pb - p0);
        
        vec2 c3 = 2.0*p0 - 2.0*p1 + m0 + m1;
        vec2 c2 = -3.0*p0 + 3.0*p1 - 2.0*m0 - m1;
        vec2 c1 = m0;
        vec2 c0 = p0;
        
        return (((c3*t + c2)*t + c1)*t + c0) * 0.8;
    }

    //////////////////////////////////////////////////////////////////////
    // perturbed point from index

    vec2 triPoint(vec2 p) {
        float t0 = hash12(p);
        return tri2cart*p + 0.45*randCircleSpline(p, 0.15*u_time*u_speed + t0);
    }

    //////////////////////////////////////////////////////////////////////
    // main shading function
    void tri_color(in vec2 p, 
                   in vec4 t0, in vec4 t1, in vec4 t2, 
                   in float scl, 
                   inout vec4 cw) {
                   
        // get differences relative to vertex 0
        vec2 p0 = p - t0.xy;
        vec2 p10 = t1.xy - t0.xy;
        vec2 p20 = t2.xy - t0.xy;
        
        // get barycentric coords
        vec3 b = bary(p10, p20, p0);
        
        // distances to line segments
        float d10 = dseg(p0, p10);
        float d20 = dseg(p0, p20);
        float d21 = dseg(p - t1.xy, t2.xy - t1.xy);
        
        // unsigned distance to triangle boundary
        float d = min(min(d10, d20), d21);

        // now signed distance (negative inside, positive outside)
        d *= -sign(min(b.x, min(b.y, b.z))); 

        // only worry about coloring if close enough
        if (d < 0.5*scl) {
            //////////////////////////////////////////////////
            // generate per-vertex palette entries
        
            // sum of all integer grid indices
            vec2 tsum = t0.zw + t1.zw + t2.zw;

            // generate unique random number in [0, 1] for each vertex of
            // this triangle
            vec3 h_tri = vec3(hash12(tsum + t0.zw),
                              hash12(tsum + t1.zw),
                              hash12(tsum + t2.zw));

            //////////////////////////////////////////////////
            // now set up the "main" triangle color:
            
            // get the cartesian centroid of this triangle
            vec2 pctr = (t0.xy + t1.xy + t2.xy) / 3.0;

            // angle of scene-wide color gradient
            float theta = 1.0 + 0.01*u_time*u_speed;
            vec2 dir = vec2(cos(theta), sin(theta));

            // how far are we along gradient?
            float grad_input = dot(pctr, dir) - sin(0.05*u_time*u_speed);

            // h0 varies smoothly from 0 to 1
            float h0 = sin(0.7*grad_input)*0.5 + 0.5;

            // now the per-vertex random numbers are all biased towards h
            // (still in [0, 1] range tho)
            h_tri = mix(vec3(h0), h_tri, 0.4);

            //////////////////////////////////////////////////
            // final color accumulation
            
            // barycentric interpolation of per-vertex palette indices
            float h = dot(h_tri, b);

            // color lookup
            vec3 c = pal(h);
            
            // weight for anti-aliasing is 0.5 at border, 0 just outside,
            // 1 just inside
            float w = smoothstep(0.5*scl, -0.5*scl, d);

            // add to accumulator
            cw += vec4(w*c, w);
        }
    }

    //////////////////////////////////////////////////////////////////////

    void main() {
        vec2 fragCoord = vUv * u_resolution;
        float iTime = u_time * u_speed;
        vec2 iResolution = u_resolution;
        
        float scl = 4.1 / iResolution.y;
        
        // get 2D scene coords
        vec2 p = (fragCoord - 0.5 - 0.5*iResolution.xy) * scl;
        
        // get triangular base coords
        vec2 tfloor = floor(cart2tri * p + 0.5);

        // precompute 9 neighboring points
        vec2 pts[9];

        for (int i=0; i<3; ++i) {
            for (int j=0; j<3; ++j) {
                pts[3*i+j] = triPoint(tfloor + vec2(i-1, j-1));
            }
        }
        
        // color accumulator
        vec4 cw = vec4(0);

        // for each of the 4 quads:
        for (int i=0; i<2; ++i) {
            for (int j=0; j<2; ++j) {
        
                // look at lower and upper triangle in this quad
                vec4 t00 = vec4(pts[3*i+j  ], tfloor + vec2(i-1, j-1));
                vec4 t10 = vec4(pts[3*i+j+3], tfloor + vec2(i,   j-1));
                vec4 t01 = vec4(pts[3*i+j+1], tfloor + vec2(i-1, j));
                vec4 t11 = vec4(pts[3*i+j+4], tfloor + vec2(i,   j));
              
                // lower
                tri_color(p, t00, t10, t11, scl, cw);

                // upper
                tri_color(p, t00, t11, t01, scl, cw);
               
            }
        }    
            
        // final pixel color
        vec3 final_color = cw.rgb / cw.w;
        
        // Apply intensity
        final_color *= u_intensity;
        
        // Mouse interaction
        vec2 mouseUv = u_mouse * 0.5 + 0.5;
        float mouseDist = distance(vUv, mouseUv);
        float mouseEffect = smoothstep(0.3, 0.0, mouseDist) * 0.2;
        final_color += mouseEffect;
        
        gl_FragColor = vec4(final_color, 1.0);
    }
  `;

  // Shader presets
  const shaderPresets = {
    icefire: iceFireShader,
  };

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(resolution, resolution) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_colorA: { value: colors.a },
      u_colorB: { value: colors.b },
      u_colorC: { value: colors.c },
      u_colorD: { value: colors.d },
      ...customUniforms,
    }),
    [resolution, intensity, speed, colors, customUniforms]
  );

  // Create shader material
  const shaderMaterial = useMemo(() => {
    const fragmentShader =
      customFragmentShader ||
      (shader === 'custom' ? iceFireShader : shaderPresets[shader as keyof typeof shaderPresets]) ||
      iceFireShader;

    try {
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    } catch (error) {
      console.error('Shader compilation error:', error);
      // Fallback to icefire shader
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: iceFireShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    }
  }, [shader, customFragmentShader, vertexShader, uniforms, iceFireShader]);

  // Update uniforms
  useFrame((state) => {
    setTime(state.clock.elapsedTime);

    // Update time uniform
    if (shaderMaterial.uniforms.u_time) {
      shaderMaterial.uniforms.u_time.value = state.clock.elapsedTime;
    }

    // Update mouse uniform if interactive
    if (interactive && shaderMaterial.uniforms.u_mouse) {
      shaderMaterial.uniforms.u_mouse.value.set(mouse.x, mouse.y);
    }

    // Update resolution
    if (shaderMaterial.uniforms.u_resolution) {
      shaderMaterial.uniforms.u_resolution.value.set(viewport.width, viewport.height);
    }

    // Update color uniforms
    if (shaderMaterial.uniforms.u_colorA) {
      shaderMaterial.uniforms.u_colorA.value = colors.a;
    }
    if (shaderMaterial.uniforms.u_colorB) {
      shaderMaterial.uniforms.u_colorB.value = colors.b;
    }
    if (shaderMaterial.uniforms.u_colorC) {
      shaderMaterial.uniforms.u_colorC.value = colors.c;
    }
    if (shaderMaterial.uniforms.u_colorD) {
      shaderMaterial.uniforms.u_colorD.value = colors.d;
    }
  });

  return (
    <group position={[0, 0, 0]} renderOrder={-10}>
      {/* Single shader layer - removed duplicate background layer for better performance */}
      <mesh ref={meshRef} position={[0, 0, -2.5]} renderOrder={-15}>
        <planeGeometry args={[25, 25]} />
        <primitive object={shaderMaterial} />
      </mesh>
    </group>
  );
};

export default IceFireShader;
