/* pyrunner.js — loads Pyodide (CPython -> WASM) once per session and
   exposes a clean API used by the Code Lab, tutorials and exercises:

     TechQuestPy.run(code, onStatus)  -> Promise<{ ok, out, err }>
     TechQuestPy.preload(onStatus)    -> Promise   (warm the engine)
     TechQuestPy.state()              -> "idle" | "loading" | "ready" | "failed"

   Each run executes in a fresh namespace, so state does not leak between
   runs. stdout / stderr are captured and returned as strings. */
window.TechQuestPy = (function () {
  "use strict";

  // Bump this version to update the Python engine.
  var PYODIDE_VERSION = "v0.26.2";
  var CDN = "https://cdn.jsdelivr.net/pyodide/" + PYODIDE_VERSION + "/full/";

  var _py = null;        // loaded pyodide instance
  var _loading = null;   // in-flight load promise
  var _state = "idle";

  function state() { return _state; }

  function injectLoader() {
    return new Promise(function (resolve, reject) {
      if (window.loadPyodide) return resolve();
      var s = document.createElement("script");
      s.src = CDN + "pyodide.js";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Could not download the Python engine.")); };
      document.head.appendChild(s);
    });
  }

  function ensure(onStatus) {
    if (_py) return Promise.resolve(_py);
    if (_loading) return _loading;
    _state = "loading";
    if (onStatus) onStatus("Starting engine…");
    _loading = injectLoader()
      .then(function () {
        return window.loadPyodide({ indexURL: CDN });
      })
      .then(function (py) {
        _py = py;
        _state = "ready";
        if (onStatus) onStatus("Engine ready");
        return py;
      })
      .catch(function (err) {
        _state = "failed";
        _loading = null;
        throw err;
      });
    return _loading;
  }

  function preload(onStatus) {
    return ensure(onStatus).catch(function () { /* swallow — UI shows failed */ });
  }

  function run(code, onStatus) {
    return ensure(onStatus).then(function (py) {
      // Redirect stdout/stderr into buffers (module-level state).
      py.runPython(
        "import sys, io\n" +
        "sys.stdout = io.StringIO()\n" +
        "sys.stderr = io.StringIO()\n"
      );

      var ok = true, traceback = "";
      // Fresh namespace per run so variables don't leak between runs.
      var ns = py.globals.get("dict")();
      return Promise.resolve()
        .then(function () { return py.runPythonAsync(code, { globals: ns }); })
        .catch(function (e) {
          ok = false;
          traceback = (e && e.message) ? e.message : String(e);
        })
        .then(function () {
          var out = "", err = "";
          try { out = py.runPython("sys.stdout.getvalue()"); } catch (_) {}
          try { err = py.runPython("sys.stderr.getvalue()"); } catch (_) {}
          if (traceback) err = (err ? err + "\n" : "") + traceback;
          // Restore real streams; free the namespace.
          try { py.runPython("sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__"); } catch (_) {}
          if (ns && ns.destroy) ns.destroy();
          return { ok: ok, out: out, err: err };
        });
    });
  }

  return { run: run, preload: preload, state: state };
})();
