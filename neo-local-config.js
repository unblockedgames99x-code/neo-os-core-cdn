(function () {
  "use strict";
  // Local-first entry points. A later CDN migration changes configuredAssetBase / these routes,
  // then deliberately updates the preview server CSP allowlist. No URL substitution
  // or proxy is hidden inside the UI.
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
    music: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-music-two-cdn@885927eb5543f0d8a12fac50deda3b79f0c89c92/music-v2/launch.svg?v=20260912-proxy-music-v2" : new URL("music-v2/index.html?v=20260912-proxy-music-v2&theme=system-v1&widgets=live-v1", base).href,
    browser: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@8fc487d0f13e7b1251804fcaa86dcfdf53f1dcdf/NEO-BROWSER/index.html?v=20260910-fast-browser-v2" : new URL("NEO-BROWSER/index.html?v=20260910-fast-browser-v2", base).href,
    gamesCatalog: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@fd554ab6aa1869225efba25405d78825ae24ed66/index.json" : new URL("../games/index.json", base).href,
    gamesCovers: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@fd554ab6aa1869225efba25405d78825ae24ed66/covers.json" : new URL("../games/covers.json", base).href,
    preview: previewBase.href,
    previewMusic: new URL("music-v2/", previewBase).href,
    previewBrowser: new URL("NEO-BROWSER/", previewBase).href,
    support: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@8fc487d0f13e7b1251804fcaa86dcfdf53f1dcdf/local-browser/support.html" : new URL("local-browser/support.html", base).href,
    unavailable: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@8fc487d0f13e7b1251804fcaa86dcfdf53f1dcdf/local-browser/unavailable.html" : new URL("local-browser/unavailable.html", base).href,
    playableGames: Object.freeze(["grandmaster-chess", "quantum-clicker", "tetris"]),
    resolve: function (path) { return new URL(path, base).href; }
  });
  if (!isCdnRunner) document.documentElement.dataset.localPreview = "true";
  // Old proxy workers must not intercept local routes when revisiting this origin.
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then(function (items) {
    return Promise.all(items.filter(function (item) {
      var workerUrl = (item.active || item.waiting || item.installing || {}).scriptURL || "";
      try {
        var path = new URL(workerUrl).pathname;
        return /\/(?:neo-os\/)?(?:browser-sw|service-worker)\.js$/.test(path);
      } catch (error) {
        return false;
      }
    }).map(function (item) { return item.unregister(); }));
  }).catch(function () {});
})();
