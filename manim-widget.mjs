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
 *   showPlayer      {boolean} when true, render play/pause/seek controls
 */

const MANIM_CDN =
  'https://cdn.jsdelivr.net/npm/manim-web@0.3.22/dist/manim-web.browser.js';

/** All manim-web names we destructure into the user's animation scope. */
const MANIM_EXPORTS = [
  // scenes
  'Scene', 'ThreeDScene', 'MovingCameraScene', 'ZoomedScene',
  'LinearTransformationScene', 'VectorScene', 'InteractiveScene',
  // interactive controls
  'Controls', 'OrbitControls',
  // drag & interaction utilities
  'makeDraggable', 'Draggable',
  'makeHoverable', 'Hoverable',
  'makeClickable', 'Clickable',
  // base mobjects
  'Mobject', 'Mobject1D', 'Mobject2D',
  'VMobject', 'VMobjectFromSVGPath', 'VectorizedPoint',
  'PMobject', 'PointMobject', 'PointCloudDot',
  'TipableVMobject',
  // 2D shapes
  'Circle', 'Dot', 'SmallDot', 'LargeDot', 'AnnotationDot', 'LabeledDot',
  'Ellipse', 'AnnularSector', 'Annulus', 'Sector',
  'Square', 'Rectangle', 'RoundedRectangle',
  'Triangle', 'Polygon', 'RegularPolygon', 'Polygram', 'RegularPolygram',
  'ArcPolygon', 'Hexagon', 'Pentagon',
  'Star', 'Cross', 'ConvexHull',
  'Arc', 'ArcBetweenPoints', 'TangentialArc', 'CubicBezier',
  'Line', 'DashedLine', 'LabeledLine',
  'Arrow', 'DoubleArrow', 'CurvedArrow', 'CurvedDoubleArrow',
  'LabeledArrow', 'LabeledPolygram',
  'Vector', 'ArrowVectorField', 'StreamLines',
  'ArrowTip', 'StealthTip',
  'ArrowCircleTip', 'ArrowCircleFilledTip',
  'ArrowSquareTip', 'ArrowSquareFilledTip',
  'ArrowTriangleTip', 'ArrowTriangleFilledTip',
  'Angle', 'RightAngle', 'Elbow',
  'Brace', 'BraceBetweenPoints', 'BraceLabel', 'BraceText', 'ArcBrace',
  'TangentLine',
  'DashedVMobject', 'BackgroundRectangle', 'SurroundingRectangle',
  'ScreenRectangle', 'FullScreenRectangle', 'FullScreenFadeRectangle',
  'Cutout', 'SVGMobject', 'ImageMobject',
  'TracedPath', 'AnimatedBoundary',
  'Underline',
  // 3D shapes
  'Sphere', 'Cube', 'Cone', 'Cylinder', 'Torus',
  'Box3D', 'Line3D', 'Arrow3D', 'Dot3D',
  'Surface3D', 'ParametricSurface', 'TexturedSurface',
  'Tetrahedron', 'Octahedron', 'Icosahedron', 'Dodecahedron',
  'Polyhedron', 'Prism',
  'ThreeDAxes', 'ThreeDVMobject',
  'ConvexHull3D',
  // graphs & functions
  'FunctionGraph', 'ParametricFunction', 'ImplicitFunction',
  'Graph', 'DiGraph', 'GenericGraph',
  // coordinate systems
  'Axes', 'NumberLine', 'NumberPlane', 'ComplexPlane',
  'PolarPlane', 'SampleSpace',
  // data display
  'BarChart', 'Table', 'MathTable', 'DecimalTable', 'IntegerTable', 'MobjectTable',
  'Matrix', 'DecimalMatrix', 'IntegerMatrix', 'MobjectMatrix',
  // text & math
  'Text', 'MarkupText', 'MarkdownText', 'Paragraph', 'BulletedList', 'Title',
  'MathTex', 'Tex', 'SingleStringMathTex', 'MathTexSVG', 'MathTexImage', 'MathTexPart',
  'Code',
  'TexTemplate', 'TexTemplateLibrary', 'TexFontTemplates',
  'GlyphVMobject', 'TextGlyphGroup',
  // numbers & variables
  'DecimalNumber', 'Integer', 'Variable',
  'ChangingDecimal',
  // groups
  'VGroup', 'VDict', 'Group', 'PGroup',
  // value tracking
  'ValueTracker', 'ComplexValueTracker',
  // special scenes / objects
  'ManimBanner', 'DiceFace', 'MandelbrotSet', 'NewtonFractal',
  'PhaseFlow', 'VectorField', 'VectorFieldVector',
  // animations – base
  'Animation',
  // animations – add / remove
  'Add', 'Remove',
  // animations – creation/destruction
  'Create', 'Uncreate', 'DrawBorderThenFill',
  'Write', 'Unwrite',
  'AddTextLetterByLetter', 'RemoveTextLetterByLetter',
  'AddTextWordByWord',
  'TypeWithCursor', 'UntypeWithCursor',
  'ShowCreationThenDestruction',
  'ShowSubmobjectsOneByOne', 'ShowIncreasingSubsets', 'ShowPartial',
  'ShowPassingFlash', 'ShowPassingFlashWithThinningStrokeWidth',
  'Blink',
  // animations – fade
  'FadeIn', 'FadeOut', 'FadeToColor',
  'FadeTransform', 'FadeTransformPieces',
  // animations – grow/shrink
  'GrowFromCenter', 'GrowFromEdge', 'GrowFromPoint', 'GrowArrow',
  'ShrinkToCenter', 'SpinInFromNothing', 'SpiralIn',
  // animations – transform
  'Transform', 'ReplacementTransform', 'TransformFromCopy',
  'TransformMatchingShapes', 'TransformMatchingTex', 'TransformAnimations',
  'ClockwiseTransform', 'CounterclockwiseTransform',
  'CyclicReplace', 'Swap',
  'Restore', 'MoveToTarget',
  'Scale', 'ScaleInPlace',
  'Rotate', 'Rotating',
  'Shift', 'MoveAlongPath', 'MoveToTargetPosition',
  'ApplyMethod', 'ApplyFunction',
  'ApplyMatrix', 'ApplyComplexFunction',
  'ApplyPointwiseFunction', 'ApplyPointwiseFunctionToCenter',
  'ApplyWave',
  'Homotopy', 'ComplexHomotopy', 'SmoothedVectorizedHomotopy',
  // animations – update
  'UpdateFromFunc', 'UpdateFromAlphaFunc',
  'ChangeDecimalToValue', 'ChangeSpeed',
  // animations – highlighting
  'Indicate', 'Circumscribe', 'Flash',
  'FocusOn', 'Broadcast', 'Pulse',
  'Wiggle', 'WiggleOutThenIn',
  // animations – grouping
  'AnimationGroup', 'LaggedStart', 'LaggedStartMap', 'Succession',
  'Wait',
  // rate functions – basic
  'smooth', 'linear', 'doubleSmooth',
  'thereAndBack', 'thereAndBackWithPause',
  'rushFrom', 'rushInto', 'slowInto',
  'exponentialDecay', 'lingering', 'runningStart', 'reverse',
  // rate functions – ease in
  'easeIn', 'easeInSine', 'easeInQuad', 'easeInCubic',
  'easeInQuart', 'easeInQuint', 'easeInExpo',
  'easeInCirc', 'easeInBack', 'easeInBounce', 'easeInElastic',
  // rate functions – ease out
  'easeOut', 'easeOutSine', 'easeOutQuad', 'easeOutCubic',
  'easeOutQuart', 'easeOutQuint', 'easeOutExpo',
  'easeOutCirc', 'easeOutBack', 'easeOutBounce', 'easeOutElastic',
  // rate functions – ease in-out
  'easeInOut', 'easeInOutSine', 'easeInOutQuad', 'easeInOutCubic',
  'easeInOutQuart', 'easeInOutQuint', 'easeInOutExpo',
  'easeInOutCirc', 'easeInOutBack', 'easeInOutBounce', 'easeInOutElastic',
  // direction constants
  'UP', 'DOWN', 'LEFT', 'RIGHT',
  'UL', 'UR', 'DL', 'DR',
  'IN', 'OUT', 'ORIGIN',
  // colors – base
  'RED', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'PINK',
  'WHITE', 'BLACK', 'GRAY', 'LIGHT_GRAY', 'DARK_GRAY',
  'ORANGE', 'TEAL', 'GOLD', 'MAROON',
  'DARK_BLUE', 'DARK_BROWN', 'LIGHT_BROWN', 'LIGHT_PINK',
  'LIGHTER_GRAY', 'DARKER_GRAY',
  'PURE_RED', 'PURE_GREEN', 'PURE_BLUE',
  // colors – variants (A–E)
  'RED_A', 'RED_B', 'RED_C', 'RED_D', 'RED_E',
  'GREEN_A', 'GREEN_B', 'GREEN_C', 'GREEN_D', 'GREEN_E',
  'BLUE_A', 'BLUE_B', 'BLUE_C', 'BLUE_D', 'BLUE_E',
  'YELLOW_A', 'YELLOW_B', 'YELLOW_C', 'YELLOW_D', 'YELLOW_E',
  'PURPLE_A', 'PURPLE_B', 'PURPLE_C', 'PURPLE_D', 'PURPLE_E',
  'TEAL_A', 'TEAL_B', 'TEAL_C', 'TEAL_D', 'TEAL_E',
  'GOLD_A', 'GOLD_B', 'GOLD_C', 'GOLD_D', 'GOLD_E',
  'MAROON_A', 'MAROON_B', 'MAROON_C', 'MAROON_D', 'MAROON_E',
  'GRAY_A', 'GRAY_B', 'GRAY_C', 'GRAY_D', 'GRAY_E',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Player UI ─────────────────────────────────────────────────────────────────

function buildPlayerBar(wrapper, width) {
  const bar = document.createElement('div');
  bar.style.cssText = `
    width: ${width}px;
    background: #111;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    box-sizing: border-box;
    border-radius: 0 0 6px 6px;
    font-family: monospace;
    font-size: 12px;
    color: #ccc;
    user-select: none;
  `;
  wrapper.appendChild(bar);

  function mkBtn(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = `
      background: none;
      border: none;
      color: #ccc;
      font-size: 15px;
      cursor: pointer;
      padding: 0 2px;
      line-height: 1;
      display: flex;
      align-items: center;
    `;
    btn.addEventListener('mouseenter', () => { btn.style.color = '#fff'; });
    btn.addEventListener('mouseleave', () => { btn.style.color = '#ccc'; });
    return btn;
  }

  const restartBtn = mkBtn('⟳');
  restartBtn.title = 'Restart animation';
  bar.appendChild(restartBtn);

  const playBtn = mkBtn('⏸');
  playBtn.title = 'Play / Pause';
  bar.appendChild(playBtn);

  const timeEl = document.createElement('span');
  timeEl.textContent = '0:00';
  timeEl.style.minWidth = '30px';
  bar.appendChild(timeEl);

  const track = document.createElement('div');
  track.style.cssText = `
    flex: 1;
    height: 5px;
    background: #333;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  `;
  bar.appendChild(track);

  // Hover hit area (larger click target)
  track.addEventListener('mouseenter', () => { track.style.height = '7px'; });
  track.addEventListener('mouseleave', () => { track.style.height = '5px'; });

  const fill = document.createElement('div');
  fill.style.cssText = `
    height: 100%;
    width: 0%;
    background: #4a9eff;
    border-radius: 3px;
    pointer-events: none;
    transition: width 0.1s linear;
  `;
  track.appendChild(fill);

  // Seek handle
  const handle = document.createElement('div');
  handle.style.cssText = `
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(-50%, -50%);
    width: 11px;
    height: 11px;
    background: #fff;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  `;
  track.appendChild(handle);
  track.addEventListener('mouseenter', () => { handle.style.opacity = '1'; });
  track.addEventListener('mouseleave', () => { handle.style.opacity = '0'; });

  const durationEl = document.createElement('span');
  durationEl.textContent = '0:00';
  durationEl.style.minWidth = '30px';
  bar.appendChild(durationEl);

  return { bar, restartBtn, playBtn, timeEl, durationEl, track, fill, handle };
}

// ── Widget export ─────────────────────────────────────────────────────────────

export default {
  async render({ model, el }) {
    const code = model.get('code');
    const width = model.get('width');
    const height = model.get('height');
    const backgroundColor = model.get('backgroundColor');
    const sceneType = model.get('sceneType') ?? 'Scene';
    const showPlayer = model.get('showPlayer') ?? false;

    // ── Wrapper ───────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: inline-flex; flex-direction: column;';
    el.appendChild(wrapper);

    // ── Canvas container ──────────────────────────────────────────────────────
    const container = document.createElement('div');
    container.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      display: inline-block;
      overflow: hidden;
      border-radius: ${showPlayer ? '6px 6px 0 0' : '6px'};
    `;
    wrapper.appendChild(container);

    // ── Player bar ────────────────────────────────────────────────────────────
    let playerUI = null;
    if (showPlayer) {
      playerUI = buildPlayerBar(wrapper, width);
    }

    // ── Load manim-web eagerly (independent of visibility) ────────────────────
    const manimWebPromise = import(MANIM_CDN).catch(err => ({ __error: err }));

    // ── Playback state ────────────────────────────────────────────────────────
    let paused = false;
    let resumeCallbacks = [];
    let currentScene = null;
    let abortController = null;

    // Timeline tracking (updated on each run, used for seeking on subsequent runs)
    let knownTotalTime = 0;     // total duration of last completed run (seconds)
    let currentElapsed = 0;     // time elapsed in current run (seconds)

    function waitIfPaused() {
      if (!paused) return Promise.resolve();
      return new Promise(resolve => resumeCallbacks.push(resolve));
    }

    function setPaused(value) {
      paused = value;
      if (playerUI) {
        playerUI.playBtn.textContent = paused ? '▶' : '⏸';
      }
      if (!paused) {
        const cbs = resumeCallbacks.splice(0);
        for (const cb of cbs) cb();
      }
    }

    function updateProgressUI(elapsed, total) {
      if (!playerUI) return;
      const pct = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
      playerUI.fill.style.width = pct + '%';
      playerUI.handle.style.left = pct + '%';
      playerUI.timeEl.textContent = formatTime(elapsed);
      if (total > 0) playerUI.durationEl.textContent = formatTime(total);
    }

    // ── Core animation runner ─────────────────────────────────────────────────
    async function startAnimation(seekToTime = 0) {
      // Abort and clean up any running animation
      abortController?.abort();
      abortController = new AbortController();
      const signal = abortController.signal;

      currentScene?.dispose?.();
      container.innerHTML = '';
      currentElapsed = 0;
      updateProgressUI(0, knownTotalTime);

      const ManimWeb = await manimWebPromise;
      if (ManimWeb.__error) {
        showError(container, `Failed to load manim-web from CDN.\n${ManimWeb.__error.message}`);
        return;
      }

      // Boot scene
      const SceneClass = ManimWeb[sceneType] ?? ManimWeb.Scene;
      currentScene = new SceneClass(container, { width, height, backgroundColor });

      // Destructure exports for user code
      const scope = {};
      for (const name of MANIM_EXPORTS) {
        if (name in ManimWeb) scope[name] = ManimWeb[name];
      }

      // ── Instrument scene.play / scene.wait for player control ─────────────
      if (showPlayer) {
        const origPlay = currentScene.play.bind(currentScene);
        const origWait = currentScene.wait != null
          ? currentScene.wait.bind(currentScene)
          : null;

        // Shared wrapper logic for any timed call
        async function timedCall(origFn, args, estimatedDuration) {
          if (signal.aborted) return;

          const isSeeking = currentElapsed < seekToTime - 0.05;

          if (isSeeking) {
            // Fast-forward: attempt to set runTime = 0 on the animation object
            const anim = args[0];
            if (anim && typeof anim === 'object') {
              anim.runTime = 0;
              anim.duration = 0;
            }
            await origFn(...args);
            currentElapsed += estimatedDuration;
          } else {
            // Normal play: check pause, then play
            await waitIfPaused();
            if (signal.aborted) return;

            const t0 = performance.now();
            await origFn(...args);
            const actual = (performance.now() - t0) / 1000;

            currentElapsed += actual;
            if (currentElapsed > knownTotalTime) knownTotalTime = currentElapsed;
          }

          updateProgressUI(currentElapsed, knownTotalTime);
        }

        currentScene.play = async (...args) => {
          // Guess duration from animation object; fall back to 1 s
          const dur = args[0]?.runTime ?? args[0]?.duration ?? 1;
          return timedCall(origPlay, args, dur);
        };

        if (origWait) {
          currentScene.wait = async (...args) => {
            const dur = typeof args[0] === 'number' ? args[0] : 1;
            return timedCall(origWait, args, dur);
          };
        }
      }

      // Run user animation
      try {
        const fn = new Function(
          'scene',
          ...Object.keys(scope),
          `"use strict"; return (async () => { ${code} })();`
        );
        await fn(currentScene, ...Object.values(scope));
      } catch (err) {
        if (!signal.aborted) {
          console.error('[manim-web]', err);
          showError(container, err.message);
        }
        return;
      }

      // Animation finished: ensure progress bar is full
      if (!signal.aborted) {
        knownTotalTime = currentElapsed;
        updateProgressUI(currentElapsed, knownTotalTime);
      }
    }

    // ── Player event wiring ───────────────────────────────────────────────────
    if (playerUI) {
      playerUI.playBtn.addEventListener('click', () => {
        setPaused(!paused);
      });

      playerUI.restartBtn.addEventListener('click', () => {
        setPaused(false);
        startAnimation(0);
      });

      // Seek on progress bar click
      playerUI.track.addEventListener('click', e => {
        const rect = playerUI.track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const target = p * knownTotalTime;
        setPaused(false);
        startAnimation(target);
      });

      // Drag-to-seek
      let dragging = false;
      playerUI.track.addEventListener('mousedown', e => {
        dragging = true;
        setPaused(true);
        e.preventDefault();
      });
      document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const rect = playerUI.track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        // Live preview of position while dragging
        playerUI.fill.style.width = (p * 100) + '%';
        playerUI.handle.style.left = (p * 100) + '%';
        playerUI.timeEl.textContent = formatTime(p * knownTotalTime);
      });
      document.addEventListener('mouseup', e => {
        if (!dragging) return;
        dragging = false;
        const rect = playerUI.track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const target = p * knownTotalTime;
        setPaused(false);
        startAnimation(target);
      });
    }

    // ── Intersection Observer — start only when visible ───────────────────────
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          startAnimation(0);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      observer.disconnect();
      abortController?.abort();
      currentScene?.dispose?.();
      wrapper.remove();
    };
  },
};
