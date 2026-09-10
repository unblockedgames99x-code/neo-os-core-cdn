(function () {
  "use strict";

  window.NEO_EXTRA_APPS = Object.assign({}, window.NEO_EXTRA_APPS || {}, {
    stream: {
      id: "stream",
      title: "NEO Music",
      subtitle: "Search, stream, queue, and organize your music",
      icon: "stream",
      template: "browser-template",
      browserTarget: window.NEO_LOCAL_CONFIG ? window.NEO_LOCAL_CONFIG.music : "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-music-two-cdn@main/music-v2/launch.svg",
      browserDirect: true,
      browserChrome: false,
      browserTheme: "stream-music",
      keepAlive: true,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: true,
      category: "Media",
      aliases: ["neo music", "music", "stream", "songs", "albums", "artists", "radio", "playlists", "audio player"]
    },
    cinehd: {
      id: "cinehd",
      title: "NEO Stream",
      subtitle: "Profiles, movies, series, anime, manga, and My List",
      icon: "zstream",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-chat-tv-cdn@904053dcd694828f7b2261eb2e7af95bad81c964/neo-tv/launch.svg?v=20260910-profile-pictures-v1",
      keepAlive: false,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Media",
      aliases: ["neo stream", "neo tv", "movies", "series", "anime", "manga", "television", "tv", "streaming", "netflix"]
    },
    anime: {
      id: "anime",
      title: "Anime",
      subtitle: "Anime from your NEO Stream profiles",
      icon: "zstream",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-chat-tv-cdn@904053dcd694828f7b2261eb2e7af95bad81c964/neo-tv/launch.svg?view=anime&v=20260910-profile-pictures-v1",
      keepAlive: false,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Media",
      aliases: ["anime", "animation", "series", "neo stream"]
    },
    manga: {
      id: "manga",
      title: "Manga",
      subtitle: "Read manga from your NEO Stream profiles",
      icon: "file",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-chat-tv-cdn@904053dcd694828f7b2261eb2e7af95bad81c964/neo-tv/launch.svg?view=manga&v=20260910-profile-pictures-v1",
      keepAlive: false,
      width: 1080,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Reading",
      aliases: ["manga", "comics", "reader", "books", "neo stream"]
    },
    discord: {
      id: "discord",
      title: "Discord",
      subtitle: "Messages, calls, and communities",
      icon: "discord",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ff33ab104954d9332fb3a4b5ec7b9a64475b4e26/NEO-BROWSER/index.html?neo-app-mode=1&neo-app-target=https%3A%2F%2Fdiscord.com%2Fapp",
      keepAlive: false,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Social",
      aliases: ["discord", "servers", "communities", "voice", "calls", "friends"]
    },
    "youtube-app": {
      id: "youtube-app",
      title: "YouTube",
      subtitle: "Videos, channels, and subscriptions",
      icon: "youtube",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ff33ab104954d9332fb3a4b5ec7b9a64475b4e26/NEO-BROWSER/index.html?neo-app-mode=1&neo-app-target=https%3A%2F%2Fwww.youtube.com%2F&neo-youtube-mode=1",
      keepAlive: false,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Media",
      aliases: ["youtube", "videos", "channels", "subscriptions", "shorts"]
    },
    "geometry-dash": {
      id: "geometry-dash",
      title: "Geometry Dash (MORE LEVELS)",
      subtitle: "Web Dashers rhythm platformer",
      icon: "geometry-dash",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-core-cdn@main/games/web-dashers.html",
      width: 1180,
      height: 760,
      launcher: true,
      pinned: true,
      category: "Games",
      aliases: ["geometry dash", "geometry", "dash", "rhythm", "platformer"]
    },
    "neo-cloud": {
      id: "neo-cloud",
      title: "NEO Cloud",
      subtitle: "Cloud gaming",
      icon: "neo-cloud",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-chat-tv-cdn@main/neo-cloud/index.html?v=20260907-online-runtime-v1",
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      core: true,
      category: "Games",
      aliases: ["neo cloud", "cloud gaming", "stream games", "remote play", "cloud games"]
    },
    "pc-remote": {
      id: "pc-remote",
      title: "PC Remote",
      subtitle: "Access or share a computer from another device",
      icon: "monitor",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ee94138b22fb0eeb64162f0d8d5e2975dd5abeab/neo-remote/index.html?v=20260910-pc-remote-v1",
      keepAlive: false,
      width: 1060,
      height: 720,
      launcher: true,
      pinned: false,
      core: true,
      category: "Utilities",
      aliases: ["pc remote", "remote desktop", "remote pc", "pc emulator", "screen share", "chrome remote desktop", "rustdesk"]
    },
    nowgg: {
      id: "nowgg",
      title: "nowgg.fun",
      subtitle: "Cloud games through the NEO relay",
      icon: "gamepad",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@ff33ab104954d9332fb3a4b5ec7b9a64475b4e26/NEO-BROWSER/index.html?neo-app-mode=1&neo-custom-app=1&neo-app-target=https%3A%2F%2Fnowgg.fun%2F",
      keepAlive: false,
      width: 1180,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Games",
      aliases: ["nowgg", "now gg", "nowgg.fun", "cloud games", "android games"]
    },
    "neo-ai": {
      id: "neo-ai",
      title: "NEO AI",
      subtitle: "Chat, images, web search, and study tools",
      icon: "chatgpt",
      route: "https://fastly.jsdelivr.net/gh/unblockedgames99x-code/neo-os-browser-cdn@78e5c9d561749dd1821874883a3152be09c66150/neo-ai/index.html?v=20260910-ai-runtime-v4",
      keepAlive: true,
      width: 1120,
      height: 760,
      launcher: true,
      pinned: false,
      category: "Productivity",
      aliases: ["neo ai", "ai", "assistant", "chatgpt", "chat gpt", "study", "web search", "image ai"]
    },
    notes: {
      id: "notes",
      title: "Notes",
      subtitle: "Quick local notes",
      icon: "file",
      lazy: true,
      width: 760,
      height: 600,
      launcher: true,
      pinned: false,
      core: true,
      category: "Productivity",
      aliases: ["notes", "notepad", "text", "write"]
    },
    "app-installer": {
      id: "app-installer",
      title: "App Installer",
      subtitle: "Install a site with its name and icon",
      icon: "apps",
      lazy: true,
      width: 880,
      height: 680,
      launcher: true,
      pinned: false,
      core: true,
      category: "System",
      aliases: ["app installer", "install app", "add app", "web app", "url app", "pwa"]
    },
    calculator: {
      id: "calculator",
      title: "Calculator",
      subtitle: "Fast local calculations",
      icon: "calculator",
      lazy: true,
      width: 390,
      height: 570,
      launcher: true,
      pinned: false,
      core: true,
      category: "Utilities",
      aliases: ["calculator", "math", "numbers"]
    },
    paint: {
      id: "paint",
      title: "Paint",
      subtitle: "Sketch and export locally",
      icon: "brush",
      lazy: true,
      width: 980,
      height: 700,
      launcher: true,
      pinned: false,
      core: true,
      category: "Creativity",
      aliases: ["paint", "draw", "canvas", "sketch"]
    },
    clock: {
      id: "clock",
      title: "Clock",
      subtitle: "Clock and stopwatch",
      icon: "monitor",
      lazy: true,
      width: 560,
      height: 520,
      launcher: true,
      pinned: false,
      core: true,
      category: "Utilities",
      aliases: ["clock", "time", "stopwatch", "timer"]
    }
  });

  window.NEORenderActiveApp = function (app, artwork, iconClass) {
    var icon = document.querySelector("[data-active-app-icon]");
    var title = document.getElementById("widget-active-title");
    var action = icon && icon.closest(".widget-action");
    title.textContent = app.hideName ? "" : app.title;
    title.hidden = app.hideName === true;
    document.getElementById("widget-active-copy").textContent = app.subtitle || "Active now";
    if (action) action.setAttribute("aria-label", "Open " + (app.accessibleName || app.title || "application"));
    icon.parentElement.dataset.app = app.id;
    icon.className = "widget-app-icon app-icon-shape " + iconClass;
    icon.innerHTML = artwork;
  };

  try {
    var searchMigrationKey = "neo_os_unpin_search_v1";
    if (localStorage.getItem(searchMigrationKey) !== "1") {
      var existingPins = JSON.parse(localStorage.getItem("neo_os_pinned_apps_v1") || "null");
      if (Array.isArray(existingPins) && existingPins.indexOf("search") !== -1) {
        localStorage.setItem("neo_os_pinned_apps_v1", JSON.stringify(existingPins.filter(function (id) { return id !== "search"; })));
      }
      localStorage.setItem(searchMigrationKey, "1");
    }

    var streamMigrationKey = "neo_os_stream_music_v1";
    if (localStorage.getItem(streamMigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (!Array.isArray(ids)) return;
        var hadLegacyApp = ids.indexOf("monochrome") !== -1;
        ids = ids.filter(function (id) { return id !== "monochrome"; });
        if (hadLegacyApp && ids.indexOf("stream") === -1) ids.push("stream");
        localStorage.setItem(key, JSON.stringify(ids));
      });
      localStorage.setItem(streamMigrationKey, "1");
    }

    var retiredMusicMigrationKey = "neo_os_remove_youtube_music_v1";
    if (localStorage.getItem(retiredMusicMigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (Array.isArray(ids) && ids.indexOf("youtube-music") !== -1) {
          localStorage.setItem(key, JSON.stringify(ids.filter(function (id) { return id !== "youtube-music"; })));
        }
      });
      localStorage.setItem(retiredMusicMigrationKey, "1");
    }

    var retiredVideoMigrationKey = "neo_os_remove_youtube_app_v1";
    if (localStorage.getItem(retiredVideoMigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (Array.isArray(ids) && ids.indexOf("youtube") !== -1) {
          localStorage.setItem(key, JSON.stringify(ids.filter(function (id) { return id !== "youtube"; })));
        }
      });
      localStorage.setItem(retiredVideoMigrationKey, "1");
    }

    var youtubeAppMigrationKey = "neo_os_add_youtube_app_v2";
    if (localStorage.getItem(youtubeAppMigrationKey) !== "1") {
      var installedVideoApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(installedVideoApps) && installedVideoApps.indexOf("youtube-app") === -1) {
        installedVideoApps.push("youtube-app");
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(installedVideoApps));
      }
      localStorage.setItem(youtubeAppMigrationKey, "1");
    }

    var mergedMp3MigrationKey = "neo_os_merge_mp3_into_music_v1";
    if (localStorage.getItem(mergedMp3MigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (!Array.isArray(ids)) return;
        var hadMp3 = ids.indexOf("music") !== -1;
        ids = ids.filter(function (id) { return id !== "music"; });
        if (hadMp3 && ids.indexOf("stream") === -1) ids.push("stream");
        localStorage.setItem(key, JSON.stringify(ids));
      });
      localStorage.setItem(mergedMp3MigrationKey, "1");
    }

    var retiredStoreMigrationKey = "neo_os_remove_app_store_v1";
    if (localStorage.getItem(retiredStoreMigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (Array.isArray(ids) && ids.indexOf("store") !== -1) {
          localStorage.setItem(key, JSON.stringify(ids.filter(function (id) { return id !== "store"; })));
        }
      });
      localStorage.setItem(retiredStoreMigrationKey, "1");
    }

    var filesMigrationKey = "neo_os_files_app_v1";
    if (localStorage.getItem(filesMigrationKey) !== "1") {
      var filesPins = JSON.parse(localStorage.getItem("neo_os_pinned_apps_v1") || "null");
      if (Array.isArray(filesPins) && filesPins.length && filesPins.indexOf("files") === -1) {
        var browserIndex = filesPins.indexOf("browser");
        filesPins.splice(browserIndex === -1 ? 0 : browserIndex + 1, 0, "files");
        localStorage.setItem("neo_os_pinned_apps_v1", JSON.stringify(filesPins));
      }
      localStorage.setItem(filesMigrationKey, "1");
    }

    var geometryDashMigrationKey = "neo_os_geometry_dash_app_v1";
    if (localStorage.getItem(geometryDashMigrationKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (!Array.isArray(ids) || ids.indexOf("geometry-dash") !== -1) return;
        var zonesIndex = ids.indexOf("zones");
        ids.splice(zonesIndex === -1 ? ids.length : zonesIndex + 1, 0, "geometry-dash");
        localStorage.setItem(key, JSON.stringify(ids));
      });
      localStorage.setItem(geometryDashMigrationKey, "1");
    }

    var neoCloudMigrationKey = "neo_os_add_neo_cloud_v2";
    if (localStorage.getItem(neoCloudMigrationKey) !== "1") {
      var cloudApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(cloudApps) && cloudApps.indexOf("neo-cloud") === -1) {
        cloudApps.push("neo-cloud");
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(cloudApps));
      }
      localStorage.setItem(neoCloudMigrationKey, "1");
    }

    var cineHdMigrationKey = "neo_os_cinehd_app_v1";
    if (localStorage.getItem(cineHdMigrationKey) !== "1") {
      var installedApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(installedApps) && installedApps.indexOf("cinehd") === -1) {
        installedApps.push("cinehd");
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(installedApps));
      }
      localStorage.setItem(cineHdMigrationKey, "1");
    }

    var discordMigrationKey = "neo_os_discord_app_v1";
    if (localStorage.getItem(discordMigrationKey) !== "1") {
      var discordApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(discordApps) && discordApps.indexOf("discord") === -1) {
        discordApps.push("discord");
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(discordApps));
      }
      localStorage.setItem(discordMigrationKey, "1");
    }

    var mediaSectionsMigrationKey = "neo_os_media_sections_apps_v1";
    if (localStorage.getItem(mediaSectionsMigrationKey) !== "1") {
      var mediaApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(mediaApps)) {
        ["anime", "manga"].forEach(function (id) { if (mediaApps.indexOf(id) === -1) mediaApps.push(id); });
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(mediaApps));
      }
      localStorage.setItem(mediaSectionsMigrationKey, "1");
    }

    var remoteAppsMigrationKey = "neo_os_remote_and_nowgg_apps_v1";
    if (localStorage.getItem(remoteAppsMigrationKey) !== "1") {
      var remoteApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(remoteApps)) {
        ["pc-remote", "nowgg"].forEach(function (id) { if (remoteApps.indexOf(id) === -1) remoteApps.push(id); });
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(remoteApps));
      }
      localStorage.setItem(remoteAppsMigrationKey, "1");
    }

    var neoAiMigrationKey = "neo_os_add_neo_ai_v1";
    if (localStorage.getItem(neoAiMigrationKey) !== "1") {
      var aiApps = JSON.parse(localStorage.getItem("neo_os_installed_apps_v1") || "null");
      if (Array.isArray(aiApps) && aiApps.indexOf("neo-ai") === -1) {
        aiApps.push("neo-ai");
        localStorage.setItem("neo_os_installed_apps_v1", JSON.stringify(aiApps));
      }
      localStorage.setItem(neoAiMigrationKey, "1");
    }

    var retiredOptionalAppsKey = "neo_os_remove_duplicate_and_retired_apps_v3";
    if (localStorage.getItem(retiredOptionalAppsKey) !== "1") {
      ["neo_os_pinned_apps_v1", "neo_os_installed_apps_v1"].forEach(function (key) {
        var ids = JSON.parse(localStorage.getItem(key) || "null");
        if (!Array.isArray(ids)) return;
        localStorage.setItem(key, JSON.stringify(ids.filter(function (id) {
          return id !== "apps" && id !== "audiobooks" && id !== "photos" && id !== "search";
        })));
      });
      localStorage.setItem(retiredOptionalAppsKey, "1");
    }
  } catch (error) {}
})();
