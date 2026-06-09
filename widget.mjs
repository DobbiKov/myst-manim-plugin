/**
 * manim-web anywidget
 *
 * Runs inside the browser. MyST calls render({ model, el }) once per
 * `manim` directive on the page. `el` is a Shadow DOM element — we can
 * write arbitrary HTML/CSS into it without polluting the rest of the page.
 *
 * model keys (set by plugin.mjs):
 *   code            {string}  user's animation JS
 *   width           {number}  canvas width  (px)
 *   height          {number}  canvas height (px)
 *   backgroundColor {string}  CSS hex color
 */

const MANIM_CDN =
  'https://cdn.jsdelivr.net/npm/manim-web@0.3.22/dist/manim-web.browser.js';

/** All manim-web names we destructure into the user's animation scope. */
const MANIM_EXPORTS = [
  // core
  'Scene',
  // shapes
  'Circle', 'Square', 'Rectangle', 'Triangle', 'Polygon', 'RegularPolygon',
  'Ellipse', 'Arc', 'Dot', 'Line', 'Arrow',
  // text & math
  'Text', 'MathTex', 'Paragraph', 'MarkupText',
  // groups
  'VGroup', 'Group',
  // coordinate systems & graphs
  'Axes', 'NumberLine', 'NumberPlane', 'ComplexPlane', 'Graph',
  'BarChart', 'Table', 'Matrix',
  // value tracking
  'ValueTracker',
  // animations
  'Create', 'FadeIn', 'FadeOut',
  'Transform', 'ReplacementTransform',
  'Write', 'Unwrite',
  'MoveAlongPath', 'Rotate', 'Shift',
  'AnimationGroup', 'LaggedStart', 'Succession', 'LaggedStartMap',
  'Indicate', 'Circumscribe', 'ShowPassingFlash', 'Broadcast',
  'ApplyMatrix', 'ApplyComplexFunction', 'ApplyPointwiseFunction',
  // rate functions
  'smooth', 'linear', 'easeInOutSine', 'easeOutBounce',
  'exponentialDecay', 'lingering', 'thereAndBackWithPause', 'runningStart',
  // colors
  'RED', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'PINK',
  'WHITE', 'BLACK', 'GRAY', 'LIGHT_GRAY', 'DARK_GRAY',
  'ORANGE', 'TEAL', 'GOLD', 'MAROON',
];

function showError(container, message) {
  container.style.cssText = `
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  `;
  const pre = document.createElement('pre');
  pre.style.cssText =
    'color:#ff6b6b;padding:16px;font-size:13px;white-space:pre-wrap;margin:0;';
  pre.textContent = '[manim-web error]\n' + message;
  container.appendChild(pre);
}

export default {
  async render({ model, el }) {
    const code = model.get('code');
    const width = model.get('width');
    const height = model.get('height');
    const backgroundColor = model.get('backgroundColor');

    // ── Container ────────────────────────────────────────────────────────────
    const container = document.createElement('div');
    container.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      display: inline-block;
      overflow: hidden;
      border-radius: 6px;
    `;
    el.appendChild(container);

    // ── Load manim-web ────────────────────────────────────────────────────────
    let ManimWeb;
    try {
      ManimWeb = await import(MANIM_CDN);
    } catch (err) {
      showError(container, `Failed to load manim-web from CDN.\n${err.message}`);
      return;
    }

    // ── Boot scene ───────────────────────────────────────────────────────────
    const { Scene } = ManimWeb;
    const scene = new Scene(container, { width, height, backgroundColor });

    // ── Destructure all exports for user code ─────────────────────────────────
    const scope = {};
    for (const name of MANIM_EXPORTS) {
      if (name in ManimWeb) scope[name] = ManimWeb[name];
    }

    // ── Run user animation ────────────────────────────────────────────────────
    // We build an async function whose parameters are all the manim-web names
    // so the user can reference them without any import statement.
    try {
      const fn = new Function(
        'scene',
        ...Object.keys(scope),
        `"use strict"; return (async () => { ${code} })();`
      );
      await fn(scene, ...Object.values(scope));
    } catch (err) {
      console.error('[manim-web]', err);
      showError(container, err.message);
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      scene.dispose?.();
      container.remove();
    };
  },
};
