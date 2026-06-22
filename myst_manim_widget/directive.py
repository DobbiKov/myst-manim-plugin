from docutils import nodes
from docutils.parsers.rst import Directive, directives

from .widget import ManimWidget


class ManimDirective(Directive):
    """MyST/RST directive that renders a manim-web animation as a Jupyter widget.

    Usage in a notebook markdown cell (requires myst-nb)::

        :::{manim}
        :width: 800
        :height: 450
        :background-color: '#1e1e2e'
        :scene: Scene
        :show-player:

        const circle = new Circle();
        await scene.play(Create(circle));
        :::
    """

    has_content = True
    optional_arguments = 0
    required_arguments = 0

    option_spec = {
        "width": directives.positive_int,
        "height": directives.positive_int,
        "background-color": directives.unchanged,
        "scene": directives.unchanged,
        "show-player": directives.flag,
    }

    def run(self):
        code = "\n".join(self.content)

        widget = ManimWidget(
            code=code,
            width=self.options.get("width", 800),
            height=self.options.get("height", 450),
            backgroundColor=self.options.get("background-color", "#000000"),
            sceneType=self.options.get("scene", "Scene"),
            showPlayer="show-player" in self.options,
        )

        # Emit the widget as a raw HTML node so sphinx/myst-nb can embed it.
        # In a live Jupyter kernel context, display() also fires and shows the
        # widget inline in the output area.
        try:
            from IPython.display import display
            display(widget)
        except Exception:
            pass

        # Return an empty node list — the display() call handles output in
        # Jupyter; for static HTML builds this produces no output (the JS
        # plugin handles those via manim.mjs).
        return []
