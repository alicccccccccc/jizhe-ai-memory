import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

function LiquidChrome({
  baseColor = [0.64, 0.08, 0.08],
  speed = 0.18,
  amplitude = 0.28,
  frequencyX = 2.4,
  frequencyY = 2.8,
  interactive = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const container = containerRef.current;
    const renderer = new Renderer({ antialias: false, alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.25) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 7.0; i++) {
          uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
          uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = uvCoord - uMouse;
        float dist = length(diff);
        float falloff = exp(-dist * 18.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.026;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
        return vec4(color, 1.0);
      }

      void main() {
        gl_FragColor = renderImage(vUv);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, 1]) },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = Math.max(container.offsetWidth, 1);
      const height = Math.max(container.offsetHeight, 1);
      renderer.setSize(width, height);
      const resolution = program.uniforms.uResolution.value;
      resolution[0] = gl.canvas.width;
      resolution[1] = gl.canvas.height;
      resolution[2] = gl.canvas.width / gl.canvas.height;
    };

    const move = (event) => {
      const rect = container.getBoundingClientRect();
      const mouse = program.uniforms.uMouse.value;
      mouse[0] = (event.clientX - rect.left) / rect.width;
      mouse[1] = 1 - (event.clientY - rect.top) / rect.height;
    };

    let animationId = 0;
    const update = (time) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001 * speed;
      renderer.render({ scene: mesh });
    };

    resize();
    container.appendChild(gl.canvas);
    window.addEventListener("resize", resize);
    if (interactive) container.addEventListener("pointermove", move);
    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      if (interactive) container.removeEventListener("pointermove", move);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, baseColor, frequencyX, frequencyY, interactive, speed]);

  return <div className="liquidChrome-container" ref={containerRef} />;
}

export default LiquidChrome;

