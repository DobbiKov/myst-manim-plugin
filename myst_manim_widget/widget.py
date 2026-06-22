"""Pure HTML renderer for manim-web animations.

Outputs a self-contained HTML block that loads manim-widget.mjs from CDN
and calls its render() function directly — no anywidget dependency needed.
"""

import json
import uuid
from IPython.display import HTML

WIDGET_CDN = (
    "https://cdn.jsdelivr.net/gh/DobbiKov/myst-manim-plugin@main/manim-widget.mjs"
)

_TEMPLATE = """
<div id="manim-{uid}"></div>
<script type="module">
  import widget from '{cdn}';
  const model = {{
    _data: {model_json},
    get(key) {{ return this._data[key]; }}
  }};
  const el = document.getElementById('manim-{uid}');
  widget.render({{ model, el }});
</script>
"""


def ManimWidget(
    code="",
    width=800,
    height=450,
    backgroundColor="#000000",
    sceneType="Scene",
    showPlayer=False,
):
    """Return an IPython HTML object that renders a manim-web animation."""
    model = {
        "code": code,
        "width": width,
        "height": height,
        "backgroundColor": backgroundColor,
        "sceneType": sceneType,
        "showPlayer": showPlayer,
    }
    html = _TEMPLATE.format(
        uid=uuid.uuid4().hex,
        cdn=WIDGET_CDN,
        model_json=json.dumps(model),
    )
    return HTML(html)
