"""IPython cell magic: %%manim

Registers a %%manim cell magic so Jupyter / Colab users can write:

    %%manim
    const circle = new Circle();
    await scene.play(Create(circle));

or with options:

    %%manim --width 800 --height 450 --background-color '#1e1e2e' --scene ThreeDScene --show-player
    const c = new Circle();
    await scene.play(Create(c));
"""

import argparse
from IPython.core.magic import register_cell_magic
from IPython.display import display

from .widget import ManimWidget  # returns IPython.display.HTML


_parser = argparse.ArgumentParser(prog="%%manim", add_help=False)
_parser.add_argument("--width",            type=int,   default=800)
_parser.add_argument("--height",           type=int,   default=450)
_parser.add_argument("--background-color", type=str,   default="#000000")
_parser.add_argument("--scene",            type=str,   default="Scene")
_parser.add_argument("--show-player",      action="store_true", default=False)


def _manim_magic(line, cell):
    try:
        args = _parser.parse_args(line.split())
    except SystemExit:
        return

    widget = ManimWidget(
        code=cell,
        width=args.width,
        height=args.height,
        backgroundColor=args.background_color,
        sceneType=args.scene,
        showPlayer=args.show_player,
    )
    display(widget)


def register():
    """Register the %%manim cell magic with the running IPython kernel."""
    register_cell_magic("manim")(_manim_magic)
