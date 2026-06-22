import anywidget
import traitlets

WIDGET_CDN = (
    "https://cdn.jsdelivr.net/gh/DobbiKov/myst-manim-plugin@main/manim-widget.mjs"
)


class ManimWidget(anywidget.AnyWidget):
    """anywidget that runs a manim-web animation in Jupyter or the browser."""

    _esm = WIDGET_CDN

    code = traitlets.Unicode("").tag(sync=True)
    width = traitlets.Int(800).tag(sync=True)
    height = traitlets.Int(450).tag(sync=True)
    backgroundColor = traitlets.Unicode("#000000").tag(sync=True)
    sceneType = traitlets.Unicode("Scene").tag(sync=True)
    showPlayer = traitlets.Bool(False).tag(sync=True)
