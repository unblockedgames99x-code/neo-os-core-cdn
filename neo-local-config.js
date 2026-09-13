(function () {
  "use strict";
  // Keep the Browser document and its service worker on the same host as NEO OS.
  // The browser transport still uses NextNode's live WISP server for web traffic.
  // Edit this relative path or absolute asset origin; routes and resolve() both use it.
  var configuredAssetBase = "./";
  var base = new URL(configuredAssetBase, document.currentScript.src);
  var previewBase = new URL("http://127.0.0.1:3092/neo-os/");
  var isCdnRunner = Boolean(document.querySelector('meta[name=\"neo-runner\"]'));
  var upstreamBrowserRoot = new URL("https://nextnode9124.b-cdn.net/");
  window.NEO_LOCAL_CONFIG = Object.freeze({
    enabled: !isCdnRunner,
    externalIntegrations: isCdnRunner,
    onlineApps: Object.freeze(["chat", "neo-cloud", "nowgg", "neo-ai", "discord", "youtube-app", "games", "movies", "geometry-dash"]),
    assetBase: base.href,
    music: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-music-two-cdn@7f54d57f14c1c8d2b72abe9ea2749da745bd5d28/music-v2/launch.svg?v=20260912-repeat-controls-v2" : new URL("music-v2/index.html?v=20260912-repeat-controls-v2&theme=system-v1&widgets=live-v1", base).href,
    browser: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ea3ad5e1e2a5bf823366868b3a18cb8d121755c6/nextnode-browser/launch.svg?v=20260913-nextnode-live-v4" : new URL("nextnode-browser/index.html?v=20260913-nextnode-live-v4", base).href,
    browserWarmAssets: Object.freeze([
      "study/sf-engine.js",
      "study/sf-ctl.js",
      "study/sf-utils.js",
      "study/libcurl.js",
      "study/sf-engine.wasm"
    ].map(function (asset) { return isCdnRunner ? new URL("nextnode-browser/" + asset, "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ea3ad5e1e2a5bf823366868b3a18cb8d121755c6/").href : new URL("nextnode-browser/" + asset, base).href; })),
    browserWisp: "wss://nextnode9124.b-cdn.net/w/",
    appProxy: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ea3ad5e1e2a5bf823366868b3a18cb8d121755c6/NEO-BROWSER/index.html?v=20260910-fast-browser-v2" : new URL("NEO-BROWSER/index.html?v=20260910-fast-browser-v2", base).href,
    gamesCatalog: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/index.json" : new URL("../games/index.json", base).href,
    gamesCovers: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/covers.json" : new URL("../games/covers.json", base).href,
    preview: previewBase.href,
    previewMusic: new URL("music-v2/", previewBase).href,
    previewBrowser: new URL("NEO-BROWSER/", previewBase).href,
    support: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ea3ad5e1e2a5bf823366868b3a18cb8d121755c6/local-browser/support.html" : new URL("local-browser/support.html", base).href,
    unavailable: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ea3ad5e1e2a5bf823366868b3a18cb8d121755c6/local-browser/unavailable.html" : new URL("local-browser/unavailable.html", base).href,
    playableGames: Object.freeze(["grandmaster-chess", "quantum-clicker", "tetris"]),
    resolve: function (path) { return new URL(path, base).href; }
  });
  if (!isCdnRunner) document.documentElement.dataset.localPreview = "true";
})();
