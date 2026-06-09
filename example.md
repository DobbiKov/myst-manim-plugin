---
title: manim-web Examples
---

# manim-web Examples
This document provides examples of manim animations and their syntax in myst documents.

## Basic shapes

:::{manim}
const circle = new Circle({ color: RED, fillOpacity: 0.3 });
scene.add(circle);
await scene.play(new Create(circle));
await scene.wait(0.5);
await scene.play(new FadeOut(circle));
:::

## Transform

:::{manim}
:background-color: #1e1e2e

const square = new Square({ sideLength: 2, color: BLUE, fillOpacity: 0.5 });
const circle = new Circle({ radius: 1.2, color: YELLOW, fillOpacity: 0.5 });

scene.add(square);
await scene.play(new Create(square));
await scene.play(new Transform(square, circle));
await scene.wait(1);
await scene.play(new FadeOut(circle));
:::

## LaTeX & Write animation

:::{manim}
:width: 900
:height: 300

const tex = new MathTex({latex: "E = mc^2"});
await tex.waitForRender?.();
await scene.play(new Write(tex, {duration: 0.5}));
await scene.wait(2);
:::

## Axes and a function plot

:::{manim}
:width: 900
:height: 500

const axes = new Axes({
  xRange: [-3, 3, 1],
  yRange: [-2, 2, 1],
});
scene.add(axes);
await scene.play(new Create(axes));

const graph = axes.plot((x) => Math.sin(x), { color: YELLOW });
await scene.play(new Create(graph));
await scene.wait(1);
:::
