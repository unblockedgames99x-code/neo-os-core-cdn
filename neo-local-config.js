(function () {
  "use strict";
  // Local-first entry points. The main Browser intentionally uses NextNode's complete
  // hosted proxy build; installed app shortcuts keep the bundled NEO wrapper below.
  // Edit this relative path or absolute asset origin; routes and resolve() both use it.
  var configuredAssetBase = "./";
  var base = new URL(configuredAssetBase, document.currentScript.src);
  var previewBase = new URL("http://127.0.0.1:3092/neo-os/");
  var isCdnRunner = Boolean(document.querySelector('meta[name=\"neo-runner\"]'));
  window.NEO_LOCAL_CONFIG = Object.freeze({
    enabled: !isCdnRunner,
    externalIntegrations: isCdnRunner,
    onlineApps: Object.freeze(["chat", "neo-cloud", "nowgg", "neo-ai", "discord", "youtube-app", "games", "movies", "geometry-dash"]),
    assetBase: base.href,
    music: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-music-two-cdn@b2b39e1300eece1c84bf6f96673d4a629c2d6c52/music-v2/launch.svg?v=20260912-repeat-controls-v2" : new URL("music-v2/index.html?v=20260912-repeat-controls-v2&theme=system-v1&widgets=live-v1", base).href,
    browser: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@7a5494f5948a9b11bb4c8f78483921a4d6d2bdaa/nextnode-browser/index.html?v=20260913-nextnode-live-v3" : new URL("nextnode-browser/index.html?v=20260913-nextnode-live-v3", base).href,
    browserWarmAssets: Object.freeze([
      "study/sf-engine.js",
      "study/sf-ctl.js",
      "study/sf-utils.js",
      "study/libcurl.js",
      "study/sf-engine.wasm"
    ].map(function (asset) { return isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@7a5494f5948a9b11bb4c8f78483921a4d6d2bdaa/nextnode-browser/" + asset : new URL("nextnode-browser/" + asset, base).href; })),
    browserWisp: "wss://nextnode9124.b-cdn.net/w/",
    appProxy: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@7a5494f5948a9b11bb4c8f78483921a4d6d2bdaa/NEO-BROWSER/index.html?v=20260910-fast-browser-v2" : new URL("NEO-BROWSER/index.html?v=20260910-fast-browser-v2", base).href,
    gamesCatalog: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/index.json" : new URL("../games/index.json", base).href,
    gamesCovers: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/covers.json" : new URL("../games/covers.json", base).href,
    preview: previewBase.href,
    previewMusic: new URL("music-v2/", previewBase).href,
    previewBrowser: new URL("NEO-BROWSER/", previewBase).href,
    support: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@7a5494f5948a9b11bb4c8f78483921a4d6d2bdaa/local-browser/support.html" : new URL("local-browser/support.html", base).href,
    unavailable: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@7a5494f5948a9b11bb4c8f78483921a4d6d2bdaa/local-browser/unavailable.html" : new URL("local-browser/unavailable.html", base).href,
    playableGames: Object.freeze(["grandmaster-chess", "quantum-clicker", "tetris"]),
    resolve: function (path) { return new URL(path, base).href; }
  });
  if (!isCdnRunner) document.documentElement.dataset.localPreview = "true";
})();
