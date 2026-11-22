import { soilPhotoViewport as view, type SoilBounds } from "./soil-geometry";

type Skin = { image: HTMLImageElement | HTMLCanvasElement; bounds: SoilBounds };
type Track = { from: SoilBounds; to: SoilBounds };

const vertexSource = `
  attribute vec2 point;
  attribute vec2 flow;
  varying vec2 uv;
  varying vec2 drift;
  void main() {
    uv = point;
    drift = flow;
    gl_Position = vec4(point.x * 2.0 - 1.0, 1.0 - point.y * 2.0, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  uniform sampler2D previousPhoto;
  uniform sampler2D nextPhoto;
  uniform vec4 previousCrop;
  uniform vec4 nextCrop;
  uniform float progress;
  uniform float direction;
  varying vec2 uv;
  varying vec2 drift;

  vec3 soil(sampler2D photo, vec4 crop, vec2 position) {
    return texture2D(photo, crop.xy + clamp(position, 0.0, 1.0) * crop.zw).rgb;
  }

  void main() {
    // A slight push in follows the moving seam and settles on the new photo.
    float swell = sin(3.141593 * progress);
    vec2 position = (uv - vec2(.52, .48)) / (1.0 + .045 * swell) + vec2(.52, .48);
    float bend = (uv.x - .5) * .31 + (uv.y - .5) * .25
      + .04 * sin(uv.y * 8.0 + uv.x * 3.0);
    float front = progress - .5 + direction * bend;
    float nearSeam = 1.0 - smoothstep(.04, .21, abs(front));
    vec2 flowAtSeam = drift * (.62 + .38 * nearSeam);
    vec3 oldColor = soil(previousPhoto, previousCrop, position - flowAtSeam * progress);
    vec3 newColor = soil(nextPhoto, nextCrop, position + flowAtSeam * (1.0 - progress));
    float texture = dot(newColor - oldColor, vec3(.299, .587, .114));
    // Let the boundary follow the irregular edges of the real grains.
    float amount = smoothstep(-.075, .075, front + texture * .08 * nearSeam);
    gl_FragColor = vec4(mix(oldColor, newColor, amount), 1.0);
  }
`;

const columns = 18;
const rows = 12;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function normalized(bounds: SoilBounds) {
  return {
    x: (bounds.x + bounds.width / 2 - view.x) / view.width,
    y: (bounds.y + bounds.height / 2 - view.y) / view.height,
    w: bounds.width / view.width,
    h: bounds.height / view.height,
  };
}

function driftField(points: Float32Array, field: Float32Array, tracks: Track[], progress: number) {
  const regions = tracks.map(({ from, to }) => {
    const a = normalized(from);
    const b = normalized(to);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dw = b.w - a.w;
    const dh = b.h - a.h;
    return {
      x: a.x + dx * progress, y: a.y + dy * progress,
      w: Math.max(.12, a.w + dw * progress), h: Math.max(.12, a.h + dh * progress),
      dx, dy, dw, dh,
    };
  });
  for (let offset = 0; offset < points.length; offset += 2) {
    const x = points[offset];
    const y = points[offset + 1];
    let dx = 0;
    let dy = 0;
    let total = 0;
    for (const region of regions) {
      const u = (x - region.x) / region.w;
      const v = (y - region.y) / region.h;
      const weight = 1 / (1 + u * u + v * v) ** 3;
      dx += weight * (region.dx + Math.max(-.5, Math.min(.5, u)) * region.dw);
      dy += weight * (region.dy + Math.max(-.5, Math.min(.5, v)) * region.dh);
      total += weight;
    }
    const edgeX = Math.min(1, x * 7, (1 - x) * 7);
    const edgeY = Math.min(1, y * 7, (1 - y) * 7);
    // Constrain deformation so a distant correspondence can't stretch the
    // texture into streaks or pull the photographed corners into view.
    field[offset] = .68 * Math.max(-.15, Math.min(.15, dx / (total + .001))) * edgeX;
    field[offset + 1] = .68 * Math.max(-.15, Math.min(.15, dy / (total + .001))) * edgeY;
  }
}

function makeSurface(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const points = new Float32Array((columns + 1) * (rows + 1) * 2);
  const indices = new Uint16Array(columns * rows * 6);
  let index = 0;
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      const a = row * (columns + 1) + col;
      points.set([col / columns, row / rows], a * 2);
      if (row === rows || col === columns) continue;
      const b = a + columns + 1;
      indices.set([a, a + 1, b, a + 1, b + 1, b], index);
      index += 6;
    }
  }
  const field = new Float32Array(points.length);
  const coordinates = gl.createBuffer();
  const displacement = gl.createBuffer();
  const elements = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, coordinates);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, "point");
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, displacement);
  gl.bufferData(gl.ARRAY_BUFFER, field.byteLength, gl.DYNAMIC_DRAW);
  const flow = gl.getAttribLocation(program, "flow");
  gl.enableVertexAttribArray(flow);
  gl.vertexAttribPointer(flow, 2, gl.FLOAT, false, 0, 0);

  const textures = [gl.createTexture(), gl.createTexture()];
  const progressUniform = gl.getUniformLocation(program, "progress");
  const directionUniform = gl.getUniformLocation(program, "direction");
  const crops = ["previousCrop", "nextCrop"].map((name) => gl.getUniformLocation(program, name));
  for (const [i, name] of ["previousPhoto", "nextPhoto"].entries()) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, name), i);
  }
  gl.viewport(0, 0, width, height);

  return {
    get lost() { return gl.isContextLost(); },
    load(from: Skin, to: Skin, direction: number) {
      for (const [i, photo] of [from, to].entries()) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo.image);
        const { x, y, width, height } = photo.bounds;
        gl.uniform4f(crops[i], (view.x - x) / width, (view.y - y) / height, view.width / width, view.height / height);
      }
      gl.uniform1f(directionUniform, direction);
    },
    draw(tracks: Track[], progress: number) {
      driftField(points, field, tracks, progress);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, field);
      gl.uniform1f(progressUniform, progress);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      return canvas;
    },
  };
}

const surfaces = new WeakMap<HTMLCanvasElement, ReturnType<typeof makeSurface>>();

export function soilTexture(
  canvas: HTMLCanvasElement, from: Skin, to: Skin, tracks: Track[], direction: number,
) {
  let surface = surfaces.get(canvas);
  if (surface === undefined || surface?.lost) {
    surface = makeSurface(canvas.width, canvas.height);
    surfaces.set(canvas, surface);
  }
  if (!surface) return null;
  surface.load(from, to, direction);
  return (progress: number) => surface.lost ? null : surface.draw(tracks, progress);
}
