"""Sphinx / myst-nb extension entry point.

Add to conf.py::

    extensions = [
        "myst_nb",
        "myst_manim_widget.extension",
        ...
    ]
"""

from .directive import ManimDirective


def setup(app):
    app.add_directive("manim", ManimDirective)
    return {"version": "0.1.0", "parallel_read_safe": True}
