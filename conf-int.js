const k = new ValueTracker(1);
function phi(x) { return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI); }

const Z = 1.96; // z_{0.025}  for α = 0.05
let varZ = Z*k.getValue();
//
    // ── axes ──────────────────────────────────────────────────────────────────
const axes = new Axes({
    xRange: [-4.5, 4.5, 1],
    yRange: [0, 0.45, 0.1],
    xLength: 9,
    yLength: 5,
    color: WHITE,
});
await scene.play(new Create(axes, { duration: 0.8 }));
const controls = new Controls(scene);
controls.addSlider({
    label: 'k',
    min: 0.1,
    max: 5,
    value: 1,
    step: 0.1,
    onChange: (val) => k.setValue(val),  // <-- this is how you read from slider
});

//── bell curve ───────────────────────────────────────────────────────────
const curve = new FunctionGraph({
    func: phi,
    xRange: [-4, 4],
    color: BLUE_C,
    strokeWidth: 3,
    axes: axes,
});
await scene.play(new Create(curve, { duration: 1.4 }));

// ── acceptance region — filled area under the curve ──────────────────────
// Parametric path: bell curve from -Z to Z, then baseline back from Z to -Z.
    // This closes the region so the fill renders correctly.
    const region1 = new ParametricFunction({
        func: (t) => {
            if (t <= 1) {
                const x = -Z + t * (Z + Z);
                return [x, phi(x)];
            } else {
                const x = Z - (t - 1) * 2 * Z;
                return [x, 0];
            }
        },
        tRange: [0, 2],
        numSamples: 120,
        axes: axes,
        color: BLUE_C,
        strokeWidth: 0,
    });
region1.fillOpacity = 0.25;

const region1b = new ParametricFunction({
    func: (t) => {
        if (t <= 1) {
            const x = -4.5 + t * (4.5 - Z);
            return [x, phi(x)];
        } else {
            const x = -Z - (t - 1) * (Z - 4.5);
            return [x, 0];
        }
    },
    tRange: [0, 2],
    numSamples: 120,
    axes: axes,
    color: BLUE_C,
    strokeWidth: 0,
});
region1b.fillOpacity = 0.25;
var a1 = new FadeIn(region1, { duration: 0.6 });
let a2 = new FadeIn(region1b, { duration: 0.6 });
await scene.play(a1, a2);

//text
const lblLeft = new MathTex({ latex: "q_{\\frac{\\alpha}{2}}", fontSize: 28, color: RED_C });
lblLeft.moveTo(axes.coordsToPoint(-Z, -0.05));

const lblRight = new MathTex({ latex: "q_{1 - \\frac{\\alpha}{2}}", fontSize: 28, color: RED_C });
lblRight.moveTo(axes.coordsToPoint( Z, -0.05));
await scene.play(
    new Write(lblLeft,  { duration: 0.7 }),
    new Write(lblRight, { duration: 0.7 }),
);

//brace for the region

const spanLine1 = new Line({
    start: axes.coordsToPoint(-4.5, -0.05),
    end:   axes.coordsToPoint( Z, -0.05),
    strokeWidth: 0,
});
const brace1 = new Brace(spanLine1, { direction: DOWN });
await scene.play(new GrowFromCenter(brace1, { duration: 0.7 }));

const brace1Text = new MathTex({
    latex: "P(X \\leq q_{1 - \\frac{\\alpha}{2}})",
    fontSize: 26,
    color: WHITE,
});
const braceBot1 = axes.coordsToPoint((-4.5 + Z)/2, -0.06);
brace1Text.moveTo([braceBot1[0], braceBot1[1] - 0.55, 0]);
await scene.play(new FadeIn(brace1Text, { duration: 0.6 }));

// from -Z to -4.5 (-inf)
const region2 = new ParametricFunction({
    func: (t) => {
        if (t <= 1) {
            const x = -4.5 + t * (4.5 - Z);
            return [x, phi(x)];
        } else {
            const x = -Z - (t - 1) * (Z - 4.5);
            return [x, 0];
        }
    },
    tRange: [0, 2],
    numSamples: 120,
    axes: axes,
    color: RED_C,
    strokeWidth: 0,
});
region2.fillOpacity = 0.25;
await scene.play(new FadeIn(region2, { duration: 0.6 }));

//brace for second quantile
const spanLine2 = new Line({
    start: axes.coordsToPoint(-4.5, 0.00),
    end:   axes.coordsToPoint( -Z, 0.00),
    strokeWidth: 0,
});
const brace2 = new Brace(spanLine2, { direction: DOWN });
await scene.play(new GrowFromCenter(brace2, { duration: 0.7 }));

const brace2Text = new MathTex({
    latex: "P(X \\leq q_{\\frac{\\alpha}{2}})",
    fontSize: 26,
    color: WHITE,
});
const braceBot2 = axes.coordsToPoint((-4.5 - Z)/2, -0.01);
brace2Text.moveTo([braceBot2[0], braceBot2[1] - 0.55, 0]);
await scene.play(new FadeIn(brace2Text, { duration: 0.6 }));

//remove and leave only center zone
await scene.wait(1);
await scene.play(new FadeOut(region1b, {duration: 0.6}), new FadeOut(region2, {duration: 0.6}), new FadeOut(brace2, {duration: 0.7}), new FadeOut(brace2Text, {duration: 0.7}));

//central brace
const spanLine = new Line({
    start: axes.coordsToPoint(-Z, 0.0),
    end:   axes.coordsToPoint( Z, 0.0),
    strokeWidth: 0,
});
const brace = new Brace(spanLine, { direction: DOWN });

const braceText = new MathTex({
    latex: "P(q_{\\frac{\\alpha}{2}} \\leq X \\leq q_{1 - \\frac{\\alpha}{2}})",
    fontSize: 26,
    color: WHITE,
});
const braceBot = axes.coordsToPoint(0, -0.01);
braceText.moveTo([braceBot[0], braceBot[1] - 0.55, 0]);

await scene.play(new Transform(brace1, brace), new FadeOut(brace1Text), new FadeIn(braceText));


// ── critical-value dashed lines ───────────────────────────────────────────
let leftLine = new DashedLine({
    start: axes.coordsToPoint(-Z, 0),
    end:   axes.coordsToPoint(-Z, phi(-Z)),
    color: RED_C,
    strokeWidth: 2,
});
let rightLine = new DashedLine({
    start: axes.coordsToPoint( Z, 0),
    end:   axes.coordsToPoint( Z, phi( Z)),
    color: RED_C,
    strokeWidth: 2,
});
await scene.play(
    new Create(leftLine,  { duration: 0.7 }),
    new Create(rightLine, { duration: 0.7 }),
);

// await scene.play(new FadeOut(rightLine, {duration: 0.0}))
// await scene.play(new FadeOut(leftLine, {duration: 0.0}))
// scene.add(leftLine);
// scene.add(rightLine);
region1.addUpdater(async () => {
    if(varZ == Z*k.getValue()){
        return;
    }

    varZ = Z*k.getValue();
    let new_reg_1 = new ParametricFunction({
        func: (t) => {
            if (t <= 1) {
                const x = -varZ + t * (varZ + varZ);
                return [x, phi(x)];
            } else {
                const x = varZ - (t - 1) * 2 * varZ;
                return [x, 0];
            }
        },
        tRange: [0, 2],
        numSamples: 120,
        axes: axes,
        color: BLUE_C,
        strokeWidth: 0,
    });
    new_reg_1.fillOpacity = 0.25;
    region1.become(
        new_reg_1
    )
    const newspanLine = new Line({
        start: axes.coordsToPoint(-varZ, 0.0),
        end:   axes.coordsToPoint( varZ, 0.0),
        strokeWidth: 0,
    });
    const newbrace = new Brace(newspanLine, { direction: DOWN });
    brace1.become(newbrace)

    leftLine.setStart(axes.coordsToPoint(-varZ, 0));
    leftLine.setEnd(axes.coordsToPoint(-varZ, phi(-varZ)));

    rightLine.setStart(axes.coordsToPoint(varZ, 0));
    rightLine.setEnd(axes.coordsToPoint(varZ, phi(varZ)));


    lblLeft.moveTo(axes.coordsToPoint(-varZ, -0.05));
    lblRight.moveTo(axes.coordsToPoint( varZ, -0.05));
});
// ── text labels ───────────────────────────────────────────────────────────
// const lblLeft = new Text({ text: "-1.96", fontSize: 28, color: RED_C });
// lblLeft.moveTo(axes.coordsToPoint(-Z, -0.05));

const lbl95 = new Text({ text: "95 %", fontSize: 36, color: BLUE_C });
lbl95.moveTo(axes.coordsToPoint(0, 0.25));

await scene.play(new Write(lbl95, { duration: 0.7 }));

// ── brace + margin-of-error label ────────────────────────────────────────
// Span a Line at y=0 from -Z to Z as the brace anchor (flat bottom edge).


    // updater



await scene.wait(Infinity);
