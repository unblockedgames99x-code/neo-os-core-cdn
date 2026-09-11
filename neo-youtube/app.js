(() => {
  'use strict';

  const API_BASES = [
    'https://pipedapi.ducks.party',
    'https://api.piped.private.coffee'
  ];
  const SEARCH_CACHE_MS = 10 * 60 * 1000;
  const HISTORY_KEY = 'neo_youtube_history_v2';
  const CACHE_PREFIX = 'neo_youtube_search_v2:';
  const FALLBACK_ITEMS = [
    ['dYCLldrYMu4', 'OpenView featured video', 'OpenView', 0],
    ['aqz-KE-bpKQ', 'Big Buck Bunny — short film', 'Blender Foundation', 596],
    ['ScMzIvxBSi4', 'Creative Commons animation showcase', 'Blender Foundation', 76],
    ['M7lc1UVf-VE', 'YouTube player demonstration', 'Google Developers', 284],
    ['jNQXAC9IVRw', 'Me at the zoo', 'jawed', 19],
    ['LXb3EKWsInQ', 'Costa Rica in 4K', 'Jacob + Katie Schwarz', 314]
  ].map(([id, title, uploaderName, duration]) => ({
    id,
    title,
    uploaderName,
    duration,
    views: '',
    uploadedDate: 'Featured',
    description: '',
    isShort: duration > 0 && duration <= 60,
    thumbnail: thumbnailUrl(id)
  }));

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dom = {
    body: document.body,
    content: $('[data-content]'),
    home: $('[data-home-view]'),
    results: $('[data-results-view]'),
    resultsList: $('[data-results-list]'),
    resultStatus: $('[data-result-status]'),
    watch: $('[data-watch-view]'),
    player: $('[data-player-shell]'),
    watchTitle: $('[data-watch-title]'),
    watchChannel: $('[data-watch-channel]'),
    watchMeta: $('[data-watch-meta]'),
    watchAvatar: $('[data-watch-avatar]'),
    watchDescription: $('[data-watch-description]'),
    upNext: $('[data-up-next]'),
    openYouTube: $('[data-open-youtube]'),
    shorts: $('[data-shorts-view]'),
    shortCard: $('[data-short-card]'),
    shortPlayer: $('[data-short-player]'),
    shortPlay: $('[data-short-play]'),
    shortTitle: $('[data-short-title]'),
    shortChannel: $('[data-short-channel]'),
    shortStatus: $('[data-short-status]'),
    popout: $('[data-video-popout]'),
    popoutStage: $('[data-popout-stage]'),
    popoutTitle: $('[data-popout-title]'),
    popoutRestore: $('[data-popout-restore]'),
    popoutClose: $('[data-popout-close]'),
    searchForm: $('[data-search-form]'),
    searchInput: $('[data-search-input]'),
    searchClear: $('[data-search-clear]'),
    toast: $('[data-toast-region]'),
    sidebar: $('[data-sidebar]')
  };

  const state = {
    view: 'home',
    query: '',
    filter: 'all',
    items: [],
    provider: '',
    request: null,
    current: null,
    playerFrame: null,
    shortsItems: [],
    shortIndex: 0,
    shortPlaying: false,
    popoutActive: false,
    popoutMode: '',
    popoutOrigin: null,
    toastTimer: 0
  };

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[char]);
  }

  function icon(name) {
    return `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function thumbnailUrl(id, quality = 'hq720') {
    return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${quality}.jpg`;
  }

  function videoIdFrom(raw = '') {
    const value = String(raw).trim();
    if (/^[\w-]{11}$/.test(value)) return value;
    const relativeMatch = value.match(/(?:[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})/);
    if (relativeMatch) return relativeMatch[1];
    try {
      const url = new URL(value);
      if (/youtu\.be$/i.test(url.hostname)) return (url.pathname.split('/')[1] || '').slice(0, 11);
      const queryId = url.searchParams.get('v');
      if (/^[\w-]{11}$/.test(queryId || '')) return queryId;
      const match = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
      return match?.[1] || '';
    } catch {
      return '';
    }
  }

  function normalize(item = {}) {
    const id = videoIdFrom(item.id || item.url || item.videoId || '');
    if (!id) return null;
    const duration = Number(item.duration || 0);
    return {
      id,
      title: String(item.title || 'YouTube video'),
      uploaderName: String(item.uploaderName || item.author || item.uploader || 'YouTube'),
      uploaderAvatar: /^https:\/\//i.test(item.uploaderAvatar || '') ? item.uploaderAvatar : '',
      views: item.views ?? item.viewCount ?? '',
      uploadedDate: String(item.uploadedDate || item.publishedText || item.uploaded || ''),
      duration,
      description: String(item.shortDescription || item.description || ''),
      thumbnail: thumbnailUrl(id),
      isShort: Boolean(item.isShort) || (duration > 0 && duration <= 60)
    };
  }

  function compactViews(value) {
    if (value === '' || value == null) return '';
    if (typeof value === 'string' && !/^\d+$/.test(value)) return value;
    const count = Number(value);
    if (!Number.isFinite(count)) return '';
    return `${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count)} views`;
  }

  function formatDuration(value) {
    const seconds = Math.max(0, Math.floor(Number(value) || 0));
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return hours
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
      : `${minutes}:${String(remainder).padStart(2, '0')}`;
  }

  function metaLine(item) {
    return [compactViews(item.views), item.uploadedDate].filter(Boolean).join(' • ');
  }

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function postShell(message) {
    try { window.parent.postMessage(message, '*'); } catch {}
  }

  function announceMedia(active, playing = false, item = state.current) {
    postShell({
      type: 'neo-shell:media-state',
      active: Boolean(active),
      playing: Boolean(playing),
      title: item?.title || 'YouTube',
      artist: item?.uploaderName || 'YouTube',
      cover: item?.thumbnail || ''
    });
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    state.toastTimer = window.setTimeout(() => { dom.toast.hidden = true; }, 2200);
  }

  function setActiveNav(view) {
    $$('[data-view]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.view === view);
    });
  }

  function pauseFrame(frame = state.playerFrame) {
    if (!frame?.contentWindow) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
    } catch {}
    announceMedia(Boolean(frame), false);
  }

  function destroyPlayer() {
    const popoutOrigin = state.popoutOrigin;
    const popoutMode = state.popoutMode;
    if (state.playerFrame) pauseFrame(state.playerFrame);
    state.popoutActive = false;
    state.popoutMode = '';
    state.popoutOrigin = null;
    dom.popout.hidden = true;
    dom.popout.removeAttribute('data-mode');
    dom.popoutStage.replaceChildren();
    dom.popout.style.removeProperty('left');
    dom.popout.style.removeProperty('top');
    dom.popout.style.removeProperty('right');
    dom.popout.style.removeProperty('bottom');
    dom.body.classList.remove('has-video-popout');
    $$('[data-popout-video], [data-popout-short]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    if (state.playerFrame) {
      state.playerFrame.remove();
      state.playerFrame = null;
    }
    if (popoutMode === 'watch' && popoutOrigin === dom.player) {
      dom.player.innerHTML = `<div class="player-placeholder"><svg><use href="#i-play"></use></svg></div>`;
    } else if (popoutMode === 'shorts' && popoutOrigin === dom.shortPlayer) {
      dom.shortPlayer.replaceChildren(dom.shortPlay);
      dom.shortPlay.hidden = false;
    }
    state.shortPlaying = false;
    dom.shortCard?.classList.remove('is-playing');
    announceMedia(false, false);
  }

  function showView(view) {
    if (state.view !== view && (state.view === 'watch' || state.view === 'shorts') && !state.popoutActive) destroyPlayer();
    state.view = view;
    dom.home.hidden = view !== 'home';
    dom.results.hidden = view !== 'results';
    dom.watch.hidden = view !== 'watch';
    dom.shorts.hidden = view !== 'shorts';
    dom.content.classList.toggle('shorts-mode', view === 'shorts');
    setActiveNav(view === 'results' || view === 'watch' ? '' : view);
    dom.content.scrollTop = 0;
  }

  function historyUrl(params = {}) {
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return `${url.pathname}${url.search}`;
  }

  function navigate(params, replace = false) {
    const method = replace ? 'replaceState' : 'pushState';
    history[method](params, '', historyUrl(params));
  }

  function remember(item) {
    const historyItems = readStorage(HISTORY_KEY, []).map(normalize).filter(Boolean);
    const next = [item, ...historyItems.filter(entry => entry.id !== item.id)].slice(0, 60);
    writeStorage(HISTORY_KEY, next);
  }

  function cacheGet(query) {
    try {
      const entry = JSON.parse(sessionStorage.getItem(CACHE_PREFIX + query.toLowerCase()));
      if (!entry || Date.now() - entry.time > SEARCH_CACHE_MS) return null;
      return entry.items.map(normalize).filter(Boolean);
    } catch {
      return null;
    }
  }

  function cacheSet(query, items) {
    try {
      sessionStorage.setItem(CACHE_PREFIX + query.toLowerCase(), JSON.stringify({ time: Date.now(), items }));
    } catch {}
  }

  async function fetchJson(base, path, parentSignal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    parentSignal?.addEventListener('abort', abort, { once: true });
    const timer = window.setTimeout(() => controller.abort(), 7500);
    try {
      const response = await fetch(base + path, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        cache: 'default'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
      parentSignal?.removeEventListener('abort', abort);
    }
  }

  async function firstWorking(path, signal) {
    let lastError = new Error('Catalogue unavailable');
    for (const base of API_BASES) {
      try {
        const data = await fetchJson(base, path, signal);
        state.provider = new URL(base).hostname;
        return data;
      } catch (error) {
        if (signal?.aborted) throw error;
        lastError = error;
      }
    }
    throw lastError;
  }

  function attachImageFallbacks(root = document) {
    $$('img[data-video-id]', root).forEach(image => {
      image.addEventListener('error', () => {
        if (image.dataset.fallbackApplied) {
          image.hidden = true;
          return;
        }
        image.dataset.fallbackApplied = '1';
        image.src = thumbnailUrl(image.dataset.videoId, 'mqdefault');
      }, { once: false });
    });
    $$('img[data-avatar]', root).forEach(image => {
      image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    });
  }

  function skeletons() {
    return Array.from({ length: 5 }, () => `
      <article class="video-result skeleton-result" aria-hidden="true">
        <div class="result-thumb"></div>
        <div class="result-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-circle"></div>
        </div>
      </article>`).join('');
  }

  function resultCard(item) {
    const duration = formatDuration(item.duration);
    const avatar = item.uploaderAvatar
      ? `<img data-avatar src="${escapeHtml(item.uploaderAvatar)}" alt="">`
      : escapeHtml(item.uploaderName.slice(0, 1).toUpperCase());
    return `
      <article class="video-result" tabindex="0" data-video-id="${item.id}">
        <div class="result-thumb">
          <img data-video-id="${item.id}" src="${item.thumbnail}" alt="" loading="lazy" decoding="async">
          ${duration ? `<span class="duration-badge">${duration}</span>` : ''}
        </div>
        <div class="result-info">
          <h2 class="result-title">${escapeHtml(item.title)}</h2>
          <div class="result-meta">${escapeHtml(metaLine(item))}</div>
          <div class="result-channel"><span class="result-avatar">${avatar}</span><span>${escapeHtml(item.uploaderName)}</span></div>
          <div class="result-description">${escapeHtml(item.description)}</div>
        </div>
        <button class="result-more" type="button" aria-label="More actions" data-toast="More actions are available on YouTube.">${icon('more')}</button>
      </article>`;
  }

  function bindResultCards(root = dom.resultsList) {
    attachImageFallbacks(root);
    $$('.video-result[data-video-id]', root).forEach(card => {
      const open = event => {
        if (event?.target?.closest('[data-toast]')) return;
        const item = state.items.find(entry => entry.id === card.dataset.videoId)
          || state.shortsItems.find(entry => entry.id === card.dataset.videoId)
          || readStorage(HISTORY_KEY, []).map(normalize).find(entry => entry?.id === card.dataset.videoId);
        if (!item) return;
        if (state.filter === 'shorts' || item.isShort && state.view === 'shorts') openShorts(item.id);
        else openVideo(item);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(event);
        }
      });
    });
  }

  function filteredItems() {
    switch (state.filter) {
      case 'shorts': return state.items.filter(item => item.isShort || (item.duration > 0 && item.duration <= 90));
      case 'videos': return state.items.filter(item => !item.isShort);
      case 'recent': return state.items.filter(item => /minute|hour|day|week|today|yesterday/i.test(item.uploadedDate));
      case 'live': return state.items.filter(item => item.duration === 0 || /live/i.test(item.uploadedDate));
      default: return state.items;
    }
  }

  function renderResults(status) {
    const items = filteredItems().slice(0, 36);
    dom.resultStatus.textContent = status || `${items.length} results${state.provider ? ` • Catalogue: ${state.provider}` : ''}`;
    if (!items.length) {
      dom.resultsList.innerHTML = `
        <div class="empty-state"><div><h2>No matching videos</h2><p>Try another filter or a different search.</p></div></div>`;
      return;
    }
    dom.resultsList.innerHTML = items.map(resultCard).join('');
    bindResultCards();
  }

  async function search(query, options = {}) {
    const q = String(query || '').trim();
    if (!q) return;
    const directId = videoIdFrom(q);
    if (directId) {
      const existing = [...state.items, ...FALLBACK_ITEMS].find(item => item.id === directId)
        || normalize({ id: directId, title: 'YouTube video', uploaderName: 'YouTube' });
      openVideo(existing, options.replace);
      return;
    }

    state.request?.abort();
    state.request = new AbortController();
    state.query = q;
    state.filter = options.filter || 'all';
    dom.searchInput.value = q;
    dom.searchClear.hidden = false;
    showView('results');
    updateFilterButtons();
    dom.resultStatus.textContent = `Searching for “${q}”…`;
    dom.resultsList.innerHTML = skeletons();
    if (!options.fromRoute) navigate({ q }, options.replace);

    const cached = cacheGet(q);
    if (cached?.length) {
      state.items = cached;
      renderResults(`${cached.length} results • Cached catalogue`);
      return;
    }

    try {
      const data = await firstWorking(`/search?q=${encodeURIComponent(q)}&filter=videos`, state.request.signal);
      const items = (Array.isArray(data) ? data : data.items || [])
        .filter(item => !item.type || item.type === 'stream')
        .map(normalize)
        .filter(Boolean);
      if (!items.length) throw new Error('No results');
      state.items = items;
      cacheSet(q, items);
      renderResults();
    } catch (error) {
      if (state.request.signal.aborted) return;
      state.items = [];
      const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
      dom.resultStatus.textContent = '';
      dom.resultsList.innerHTML = `
        <div class="empty-state"><div>
          <h2>The catalogue did not respond</h2>
          <p>Paste a YouTube link to play it here, retry the search, or open the same search on YouTube.</p>
          <button type="button" data-retry-search>Retry</button>
          <a href="${youtubeSearch}" target="_blank" rel="noopener noreferrer">Open YouTube</a>
        </div></div>`;
      $('[data-retry-search]')?.addEventListener('click', () => search(q, { replace: true }));
    }
  }

  function updateFilterButtons() {
    $$('[data-filter]').forEach(button => {
      const active = button.dataset.filter === state.filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  function createPlayer(item, autoplay = true, shorts = false) {
    destroyPlayer();
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      playsinline: '1',
      rel: '0',
      enablejsapi: '1'
    });
    if (shorts) {
      params.set('loop', '1');
      params.set('playlist', item.id);
    }
    if (location.origin && location.origin !== 'null') params.set('origin', location.origin);
    iframe.src = `https://www.youtube-nocookie.com/embed/${item.id}?${params}`;
    iframe.title = item.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.loading = 'eager';
    state.playerFrame = iframe;
    announceMedia(true, autoplay, item);
    return iframe;
  }

  function popoutPlaceholder(mode) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'popout-placeholder';
    button.innerHTML = `${icon('popout')}<span>Playing in pop-out</span>`;
    button.addEventListener('click', restorePopout);
    if (mode === 'shorts') dom.shortPlayer.replaceChildren(button);
    else dom.player.replaceChildren(button);
  }

  function openPopout(mode = state.view) {
    if (!state.playerFrame && mode === 'shorts') playCurrentShort();
    const frame = state.playerFrame;
    if (!frame) {
      showToast('Start a video first.');
      return;
    }
    if (state.popoutActive) {
      restorePopout();
      return;
    }
    state.popoutActive = true;
    state.popoutMode = mode === 'shorts' ? 'shorts' : 'watch';
    state.popoutOrigin = frame.parentElement;
    dom.popoutTitle.textContent = state.current?.title || 'YouTube video';
    dom.popout.style.removeProperty('left');
    dom.popout.style.removeProperty('top');
    dom.popout.style.removeProperty('right');
    dom.popout.style.removeProperty('bottom');
    dom.popout.dataset.mode = state.popoutMode;
    dom.popoutStage.replaceChildren(frame);
    dom.popout.hidden = false;
    dom.body.classList.add('has-video-popout');
    popoutPlaceholder(state.popoutMode);
    const selector = state.popoutMode === 'shorts' ? '[data-popout-short]' : '[data-popout-video]';
    $(selector)?.setAttribute('aria-pressed', 'true');
    showToast('Video popped out');
  }

  function restorePopout() {
    if (!state.popoutActive || !state.playerFrame) return;
    const mode = state.popoutMode;
    const origin = state.popoutOrigin;
    if (state.view !== mode) {
      showView(mode);
      if (mode === 'shorts') navigate({ shorts: state.current?.id || 'feed' }, true);
      else navigate({ v: state.current?.id || '' }, true);
    }
    state.popoutActive = false;
    state.popoutMode = '';
    state.popoutOrigin = null;
    dom.popout.hidden = true;
    dom.popout.removeAttribute('data-mode');
    dom.popout.style.removeProperty('left');
    dom.popout.style.removeProperty('top');
    dom.popout.style.removeProperty('right');
    dom.popout.style.removeProperty('bottom');
    dom.body.classList.remove('has-video-popout');
    $$('[data-popout-video], [data-popout-short]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    origin.replaceChildren(state.playerFrame);
    if (mode === 'shorts') {
      dom.shortCard.classList.add('is-playing');
      state.shortPlaying = true;
    }
  }

  function closePopout() {
    if (!state.popoutActive) return;
    destroyPlayer();
    showToast('Video closed');
  }

  function beginPopoutDrag(event) {
    if (!state.popoutActive || event.button !== 0 || event.target.closest('button')) return;
    const rect = dom.popout.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture?.(pointerId);
    event.preventDefault();
    const move = moveEvent => {
      if (moveEvent.pointerId !== pointerId) return;
      const left = Math.max(8, Math.min(innerWidth - rect.width - 8, moveEvent.clientX - offsetX));
      const top = Math.max(8, Math.min(innerHeight - rect.height - 8, moveEvent.clientY - offsetY));
      dom.popout.style.left = `${left}px`;
      dom.popout.style.top = `${top}px`;
      dom.popout.style.right = 'auto';
      dom.popout.style.bottom = 'auto';
    };
    const end = endEvent => {
      if (endEvent.pointerId !== pointerId) return;
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', end);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', end);
  }

  function avatarMarkup(item) {
    return item.uploaderAvatar
      ? `<img data-avatar src="${escapeHtml(item.uploaderAvatar)}" alt="">`
      : escapeHtml(item.uploaderName.slice(0, 1).toUpperCase());
  }

  function renderUpNext(current) {
    const items = (state.items.length ? state.items : FALLBACK_ITEMS)
      .filter(item => item.id !== current.id)
      .slice(0, 12);
    dom.upNext.innerHTML = items.map(item => `
      <article class="next-item" tabindex="0" data-video-id="${item.id}">
        <div class="result-thumb">
          <img data-video-id="${item.id}" src="${item.thumbnail}" alt="" loading="lazy" decoding="async">
          ${formatDuration(item.duration) ? `<span class="duration-badge">${formatDuration(item.duration)}</span>` : ''}
        </div>
        <div class="next-copy"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.uploaderName)}</p><p>${escapeHtml(metaLine(item))}</p></div>
      </article>`).join('');
    attachImageFallbacks(dom.upNext);
    $$('.next-item', dom.upNext).forEach(card => {
      const open = () => {
        const item = [...state.items, ...FALLBACK_ITEMS].find(entry => entry.id === card.dataset.videoId);
        if (item) openVideo(item);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter') open();
      });
    });
  }

  function openVideo(rawItem, replace = false) {
    const item = normalize(rawItem);
    if (!item) return;
    showView('watch');
    state.current = item;
    remember(item);
    dom.watchTitle.textContent = item.title;
    dom.watchChannel.textContent = item.uploaderName;
    dom.watchMeta.textContent = metaLine(item);
    dom.watchAvatar.innerHTML = avatarMarkup(item);
    dom.watchDescription.textContent = item.description || 'Playback uses YouTube’s privacy-enhanced official player. Video availability is controlled by the uploader and YouTube.';
    dom.openYouTube.href = `https://www.youtube.com/watch?v=${item.id}`;
    dom.player.replaceChildren(createPlayer(item, true, false));
    attachImageFallbacks(dom.watchAvatar);
    renderUpNext(item);
    navigate({ v: item.id }, replace);
    postShell({ type: 'neo-shell:video-route', active: true });
  }

  function renderShort(autoplay = false) {
    const item = state.shortsItems[state.shortIndex];
    if (!item) return;
    state.current = item;
    remember(item);
    destroyPlayer();
    dom.shortPlayer.style.backgroundImage = `url("${thumbnailUrl(item.id)}")`;
    dom.shortPlayer.replaceChildren(dom.shortPlay);
    dom.shortPlay.hidden = false;
    dom.shortTitle.textContent = item.title;
    dom.shortChannel.textContent = item.uploaderName;
    dom.shortStatus.textContent = `${state.shortIndex + 1} of ${state.shortsItems.length}`;
    state.shortPlaying = false;
    if (autoplay) playCurrentShort();
    navigate({ shorts: item.id }, true);
  }

  function playCurrentShort() {
    const item = state.shortsItems[state.shortIndex];
    if (!item) return;
    dom.shortPlayer.replaceChildren(createPlayer(item, true, true));
    dom.shortCard.classList.add('is-playing');
    state.shortPlaying = true;
    postShell({ type: 'neo-shell:video-route', active: true });
  }

  async function openShorts(startId = '', options = {}) {
    showView('shorts');
    setActiveNav('shorts');
    dom.shortStatus.textContent = 'Loading Shorts…';
    if (!options.fromRoute) navigate({ shorts: startId || 'feed' }, options.replace);

    const existing = state.items.filter(item => item.isShort || (item.duration > 0 && item.duration <= 90));
    if (existing.length >= 4) state.shortsItems = existing;
    if (startId && !state.shortsItems.some(item => item.id === startId)) {
      const start = [...state.items, ...FALLBACK_ITEMS].find(item => item.id === startId)
        || normalize({ id: startId, title: 'YouTube Short', uploaderName: 'YouTube', isShort: true });
      if (start) state.shortsItems.unshift(start);
    }

    if (state.shortsItems.length < 4) {
      try {
        const controller = new AbortController();
        const data = await firstWorking('/search?q=popular%20shorts&filter=videos', controller.signal);
        const found = (Array.isArray(data) ? data : data.items || [])
          .filter(item => !item.type || item.type === 'stream')
          .map(normalize)
          .filter(Boolean)
          .filter(item => item.isShort || (item.duration > 0 && item.duration <= 90));
        const merged = [...state.shortsItems, ...found];
        state.shortsItems = merged.filter((item, index) => merged.findIndex(other => other.id === item.id) === index);
      } catch {}
    }

    if (!state.shortsItems.length) {
      state.shortsItems = FALLBACK_ITEMS.filter(item => item.duration > 0 && item.duration <= 90);
    }
    state.shortIndex = Math.max(0, state.shortsItems.findIndex(item => item.id === startId));
    renderShort(Boolean(options.autoplay));
  }

  function moveShort(direction) {
    if (!state.shortsItems.length) return;
    state.shortIndex = (state.shortIndex + direction + state.shortsItems.length) % state.shortsItems.length;
    renderShort(true);
  }

  function showLibrary(view) {
    const historyItems = readStorage(HISTORY_KEY, []).map(normalize).filter(Boolean);
    state.items = historyItems;
    state.query = '';
    state.filter = 'all';
    showView('results');
    setActiveNav(view);
    updateFilterButtons();
    if (view === 'history' || view === 'you') {
      dom.resultStatus.textContent = view === 'history' ? 'Watch history on this device' : 'Your local library';
      if (historyItems.length) {
        dom.resultsList.innerHTML = historyItems.map(resultCard).join('');
        bindResultCards();
      } else {
        dom.resultsList.innerHTML = '<div class="empty-state"><div><h2>No watch history</h2><p>Videos you play here will appear on this device.</p></div></div>';
      }
    } else {
      dom.resultStatus.textContent = '';
      dom.resultsList.innerHTML = '<div class="empty-state"><div><h2>Sign in to see subscriptions</h2><p>Your YouTube subscriptions stay with your Google account.</p><a href="https://accounts.google.com/ServiceLogin?service=youtube" target="_blank" rel="noopener noreferrer">Sign in</a></div></div>';
    }
    navigate({ view }, false);
  }

  function goHome(replace = false) {
    showView('home');
    state.query = '';
    dom.searchInput.value = '';
    dom.searchClear.hidden = true;
    setActiveNav('home');
    navigate({}, replace);
  }

  async function share(item) {
    if (!item) return;
    const url = `https://youtu.be/${item.id}`;
    try {
      if (navigator.share) await navigator.share({ title: item.title, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast('Video link copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showToast(url);
    }
  }

  function routeFromLocation() {
    const params = new URLSearchParams(location.search);
    const hashMatch = location.hash.match(/^#watch=([\w-]{11})$/);
    const videoId = params.get('v') || hashMatch?.[1];
    const shortId = params.get('shorts');
    const query = params.get('q');
    const view = params.get('view');
    if (videoId) {
      const item = [...state.items, ...FALLBACK_ITEMS].find(entry => entry.id === videoId)
        || normalize({ id: videoId, title: 'YouTube video', uploaderName: 'YouTube' });
      openVideo(item, true);
    } else if (shortId) {
      openShorts(shortId === 'feed' ? '' : shortId, { replace: true, fromRoute: true });
    } else if (query) {
      search(query, { replace: true, fromRoute: true });
    } else if (view) {
      showLibrary(view);
    } else {
      goHome(true);
    }
  }

  dom.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    search(dom.searchInput.value);
  });
  dom.searchInput.addEventListener('input', () => {
    dom.searchClear.hidden = !dom.searchInput.value;
  });
  dom.searchClear.addEventListener('click', () => {
    dom.searchInput.value = '';
    dom.searchClear.hidden = true;
    dom.searchInput.focus();
  });

  $$('[data-view]').forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    if (view === 'home') goHome();
    else if (view === 'shorts') openShorts();
    else showLibrary(view);
  }));

  $$('[data-search-preset]').forEach(button => button.addEventListener('click', () => {
    search(button.dataset.searchPreset);
  }));

  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    updateFilterButtons();
    if (state.filter === 'shorts') {
      const first = state.items.find(item => item.isShort || (item.duration > 0 && item.duration <= 90));
      if (first) openShorts(first.id);
      else renderResults();
    } else {
      renderResults();
    }
  }));

  $('[data-watch-back]').addEventListener('click', () => {
    if (state.query) search(state.query, { replace: true });
    else goHome(true);
  });
  $('[data-share-video]').addEventListener('click', () => share(state.current));
  $('[data-share-short]').addEventListener('click', () => share(state.current));
  $('[data-popout-video]').addEventListener('click', () => openPopout('watch'));
  $('[data-popout-short]').addEventListener('click', () => openPopout('shorts'));
  dom.popoutRestore.addEventListener('click', restorePopout);
  dom.popoutClose.addEventListener('click', closePopout);
  $('[data-popout-drag]').addEventListener('pointerdown', beginPopoutDrag);
  dom.shortPlay.addEventListener('click', playCurrentShort);
  $('[data-short-prev]').addEventListener('click', () => moveShort(-1));
  $('[data-short-next]').addEventListener('click', () => moveShort(1));

  $('[data-guide-toggle]').addEventListener('click', () => {
    dom.sidebar.classList.toggle('is-open');
  });

  $('[data-voice-search]').addEventListener('click', () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      showToast('Voice search is not available in this browser.');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
      const query = event.results?.[0]?.[0]?.transcript || '';
      dom.searchInput.value = query;
      search(query);
    };
    recognition.onerror = () => showToast('Voice search could not start.');
    recognition.start();
  });

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-toast]');
    if (target) {
      event.stopPropagation();
      showToast(target.dataset.toast);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) {
      event.preventDefault();
      dom.searchInput.focus();
    }
    if (event.key === 'Escape' && state.popoutActive) {
      restorePopout();
      return;
    }
    if (event.key === 'Escape' && (state.view === 'watch' || state.view === 'shorts')) {
      if (state.query) search(state.query, { replace: true });
      else goHome(true);
    }
    if (state.view === 'shorts' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) {
      if (event.key === 'ArrowDown') { event.preventDefault(); moveShort(1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); moveShort(-1); }
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseFrame();
  });

  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'neo-shell:visibility' && data.visible === false) pauseFrame();
  });

  window.addEventListener('popstate', routeFromLocation);

  function keepPageStylesLast() {
    const stylesheet = $('#neo-youtube-styles');
    if (stylesheet && stylesheet !== document.head.lastElementChild) document.head.append(stylesheet);
  }
  window.setTimeout(keepPageStylesLast, 0);
  window.addEventListener('neo-interface-style-change', keepPageStylesLast);

  routeFromLocation();
})();
