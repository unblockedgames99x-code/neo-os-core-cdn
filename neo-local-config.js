(function () {
  "use strict";
  // Keep the Browser document and its service worker on the same host as NEO OS.
  // Named Browser servers use their published YukiOS WISP endpoints.
  // Edit this relative path or absolute asset origin; routes and resolve() both use it.
  var configuredAssetBase = "./";
  var base = new URL(configuredAssetBase, document.currentScript.src);
  var previewBase = new URL("http://127.0.0.1:3092/neo-os/");
  var isCdnRunner = Boolean(document.querySelector('meta[name=\"neo-runner\"]'));
  var upstreamBrowserRoot = new URL("https://nextnode9124.b-cdn.net/");
  var runtimeHost = String(window.location && window.location.hostname || "").toLowerCase();
  var localRuntime = Boolean(
    window.location && window.location.protocol === "file:" ||
    runtimeHost === "localhost" ||
    runtimeHost === "127.0.0.1" ||
    runtimeHost === "0.0.0.0" ||
    runtimeHost === "::1"
  );
  window.NEO_LOCAL_CONFIG = Object.freeze({
    enabled: localRuntime,
    externalIntegrations: !localRuntime,
    onlineApps: Object.freeze(["chat", "games", "movies"]),
    assetBase: base.href,
    music: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-music-two-cdn@934b766f5cd33440650db83a3fac06cd70213747/music-v2/launch.svg?v=20260919-scholarnook-v1" : new URL("music-v2/index.html?v=20260919-scholarnook-v1&theme=system-v1&widgets=live-v1", base).href,
    browser: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@fca31bebf8b093d8ade211e9dce04bb8e9599856/nextnode-browser/launch.svg?v=20260919-auto-wisp-v1" : new URL("nextnode-browser/index.html?v=20260919-auto-wisp-v1", base).href,
    browserWarmAssets: Object.freeze([
      "study/sf-engine.js",
      "study/sf-ctl.js",
      "study/sf-utils.js",
      "study/libcurl.js",
      "study/sf-engine.wasm"
    ].map(function (asset) { return isCdnRunner ? new URL("nextnode-browser/" + asset, "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@fca31bebf8b093d8ade211e9dce04bb8e9599856/").href : new URL("nextnode-browser/" + asset, base).href; })),
    browserWisp: "wss://probuildingsupplies.com/w/",
    browserWispServers: Object.freeze([
      Object.freeze({ name: "NextNode Wisp", url: "wss://nextnode9124.b-cdn.net/w/" }),
      Object.freeze({ name: "Probuilding Wisp", url: "wss://probuildingsupplies.com/w/" }),
      Object.freeze({ name: "Mercury Wisp", url: "wss://wisp.mercurywork.shop/" }),
      Object.freeze({ name: "Reeyuki Wisp", url: "wss://hurt-agata-liventcord-api-7072e9a6.koyeb.app/" }),
      Object.freeze({ name: "Reeyuki Wisp 2", url: "wss://reeyukiwisp.onrender.com/" }),
      Object.freeze({ name: "Aether Relay 1", url: "wss://w2.qwq.sh/ws/" }),
      Object.freeze({ name: "Aether Relay 2", url: "wss://api.personalloanonline.net/ws/" }),
      Object.freeze({ name: "Aether Relay 3", url: "wss://www.goldenbasketballacademy.space/ws/" }),
      Object.freeze({ name: "Aether Relay 4", url: "wss://www.atlantaclassical.info/ws/" }),
      Object.freeze({ name: "Aether Relay 5", url: "wss://www.booksforschool.online/ws/" })
    ]),
    appProxy: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@fca31bebf8b093d8ade211e9dce04bb8e9599856/NEO-BROWSER/index.html?v=20260913-yukios-wisp-v1" : new URL("NEO-BROWSER/index.html?v=20260913-yukios-wisp-v1", base).href,
    gameDocumentRelay: "https://neo-stratus-api-w6nw.onrender.com/games/v1/document",
    gamesCatalog: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/index.json" : new URL("../games/index.json", base).href,
    gamesCovers: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-games-catalog-cdn@main/covers.json" : new URL("../games/covers.json", base).href,
    preview: previewBase.href,
    previewMusic: new URL("music-v2/", previewBase).href,
    previewBrowser: new URL("NEO-BROWSER/", previewBase).href,
    support: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@fca31bebf8b093d8ade211e9dce04bb8e9599856/local-browser/support.html" : new URL("local-browser/support.html", base).href,
    unavailable: isCdnRunner ? "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@fca31bebf8b093d8ade211e9dce04bb8e9599856/local-browser/unavailable.html" : new URL("local-browser/unavailable.html", base).href,
    playableGames: Object.freeze(["grandmaster-chess", "quantum-clicker", "tetris"]),
    resolve: function (path) { return new URL(path, base).href; }
  });
  if (localRuntime && !isCdnRunner) document.documentElement.dataset.localPreview = "true";
  else document.documentElement.dataset.deployment = "production";
})();
