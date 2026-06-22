from .widget import ManimWidget

__all__ = ["ManimWidget"]

# Auto-register %%manim cell magic when running inside Jupyter / Colab
try:
    get_ipython  # noqa: F821 — defined by IPython, NameError outside it
    from .magic import register
    register()
except NameError:
    pass
