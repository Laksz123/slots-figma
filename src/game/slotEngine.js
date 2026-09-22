import { symbols, baseReels, reelPool } from './data.js';
import { requestSpin } from './mockServer.js';

// Tunables (feel of the spin). Ported 1:1 from the original static build.
export const DEFAULT_CONFIG = {
  spinDistanceLoops: 8, // rows of "junk" flown past before landing (bigger = faster/blurrier middle)
  spinDuration: 2100, // base spin length for reel 0 (ms)
  reelStagger: 150, // each reel to the right spins this much longer -> stops L->R
  spinStartDelay: 60, // near-instant release after the click (no dead hover)
  antiFrac: 0.15, // fraction of the roll spent on the anticipation pull-up
  backRows: 0.6, // how far the reel back-winds UP (in rows) before dropping
  accelFrac: 0.18, // fraction of the DROP spent ramping up from a standstill
  cruiseEndFrac: 0.72, // fraction of the DROP at which cruise ends and braking begins
  blurGain: 0.24, // px of vertical blur per px/frame of reel velocity
  blurCapFrac: 0.13, // max blur as a fraction of one row height (higher = streakier fast middle)
};

// The reel controller. It renders/animates directly on the DOM (Web Animations API +
// per-reel SVG motion-blur filters), exactly like the original inline script, so the
// look and feel are identical. React only supplies the static markup and mounts this.
export function createSlotEngine(options = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...(options.config || {}) };
  const server = options.server || { requestSpin };
  const bet = options.bet ?? 0.6;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let spinning = false;
  let currentReels = baseReels.map((reel) => reel.slice());
  let blurFilters = [];
  const listeners = [];

  function on(el, type, fn) {
    if (!el) return;
    el.addEventListener(type, fn);
    listeners.push({ el, type, fn });
  }

  function createSymbol(name, mode) {
    const item = document.createElement('div');
    item.className = 'reel-item';
    const img = document.createElement('img');
    img.className = 'sym ' + symbols[name][mode];
    img.src = symbols[name].src;
    img.alt = '';
    item.appendChild(img);
    return item;
  }

  function buildStrip(strip, reelIndex, startSet, finalSet, mode) {
    const fragment = document.createDocumentFragment();
    const pool = reelPool[reelIndex];
    const run = [];
    const runLength = cfg.spinDistanceLoops * pool.length;
    for (let i = 0; i < runLength; i += 1) {
      run.push(pool[(i + reelIndex + 1) % pool.length]);
    }
    // Top -> bottom order for a DOWNWARD spin (symbols fall in from the top):
    //   finalSet     = what lands in the window at rest (top of the strip)
    //   run          = junk symbols scrolled through
    //   startSet     = currently visible symbols (where the window sits at t=0)
    //   belowBuffer  = one extra symbol UNDER startSet, so the anticipation pull-up
    //                  never exposes a blank gap at the bottom edge of the reel
    const belowBuffer = pool[reelIndex % pool.length];
    const sequence = [...finalSet, ...run, ...startSet, belowBuffer];
    sequence.forEach((name) => fragment.appendChild(createSymbol(name, mode)));
    strip.replaceChildren(fragment);
    return sequence.length - 4; // rows from the start window (on startSet) down to rest (finalSet)
  }

  function buildStaticStrip(strip, visibleSet, mode) {
    const fragment = document.createDocumentFragment();
    visibleSet.forEach((name) => fragment.appendChild(createSymbol(name, mode)));
    strip.replaceChildren(fragment);
    strip.style.transform = 'translate3d(0, 0, 0)';
  }

  function setInitialReels() {
    document.querySelectorAll('.sym-grid .reel').forEach((reel, index) => {
      buildStaticStrip(reel.querySelector('.reel-strip'), currentReels[index], 'desktop');
    });
    document.querySelectorAll('.m-reel-grid .reel').forEach((reel, index) => {
      buildStaticStrip(reel.querySelector('.reel-strip'), currentReels[index], 'mobile');
    });
  }

  function waitFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function prepareReel(reel, reelIndex, startSet, finalSet, mode) {
    const strip = reel.querySelector('.reel-strip');
    const travelRows = buildStrip(strip, reelIndex, startSet, finalSet, mode);
    // Position by the REAL rendered cell height, not reel.clientHeight/3. The reel's
    // content box is a couple of px shorter than three full cells (its border), so
    // clientHeight/3 is ~2px off per row — over the whole strip that mismatch snaps the
    // symbols by ~50px the instant the spin starts (the "teleport"). Measuring the cell
    // makes the start position line up exactly with the resting symbols -> no jump.
    const firstItem = strip.querySelector('.reel-item');
    const rowHeight = firstItem ? parseFloat(getComputedStyle(firstItem).height) : reel.clientHeight / 3;
    const startY = -travelRows * rowHeight; // window sits on startSet; rest window is at 0

    strip.getAnimations().forEach((animation) => animation.cancel());
    // Show the current symbols with no visible jump before the fall begins.
    strip.style.transform = 'translate3d(0, ' + startY + 'px, 0)';
    return { strip, reelIndex, rowHeight, startY, prevY: startY };
  }

  // Build the reel motion as one smooth position curve so the velocity is continuous
  // end-to-end (no lurch/teleport, no snap):
  //   1. anticipation  -> ease UP from rest to the top of the back-wind (velocity 0 at the top),
  //   2. drop          -> trapezoid fall (accel from standstill, steady cruise, soft stop).
  // Because velocity is 0 at the top of the back-wind AND at the start of the drop, the
  // reversal from "pull up" to "fall down" is seamless — the reference's start feel.
  function buildFallKeyframes(startY, rowHeight) {
    const D = -startY; // downward travel from rest-start to rest (positive)
    const back = rowHeight * cfg.backRows; // how far it pulls UP first
    const tup = cfg.antiFrac; // portion of the roll spent on the pull-up
    const ta = cfg.accelFrac; // accel ends (fraction of the DROP)
    const tb = cfg.cruiseEndFrac; // cruise ends, braking begins (fraction of the DROP)
    const areaTotal = 0.5 * ta + (tb - ta) + 0.5 * (1 - tb);
    function posFrac(u) {
      let a;
      if (u <= ta) a = 0.5 * u * u / ta; // accelerating
      else if (u <= tb) a = 0.5 * ta + (u - ta); // constant cruise
      else {
        const w = u - tb;
        const W = 1 - tb; // braking
        a = 0.5 * ta + (tb - ta) + (w - 0.5 * w * w / W);
      }
      return a / areaTotal;
    }
    function smooth(x) {
      return x * x * (3 - 2 * x); // ease-in-out, zero velocity at both ends
    }
    const N = 48;
    const frames = [];
    for (let i = 0; i <= N; i += 1) {
      const u = i / N;
      let y;
      if (u <= tup) {
        // anticipation: rest -> top of the back-wind (up), coming to a stop at the top
        y = startY - back * smooth(u / tup);
      } else {
        // drop: top of the back-wind -> rest (0), travelling D + back
        const uf = (u - tup) / (1 - tup);
        y = (startY - back) + posFrac(uf) * (D + back);
      }
      frames.push({
        transform: 'translate3d(0, ' + y.toFixed(2) + 'px, 0)',
        offset: i / N,
        easing: 'linear',
      });
    }
    return frames;
  }

  function animatePreparedReel(prepared) {
    const { strip, reelIndex, rowHeight, startY } = prepared;
    // Reels fall DOWNWARD from startY (window on current symbols) to 0 (window on final symbols).
    if (reduceMotion.matches) {
      strip.style.transform = 'translate3d(0, 0, 0)';
      return Promise.resolve();
    }
    // Reels to the right spin a little longer, so the whole row settles left -> right.
    const duration = cfg.spinDuration + reelIndex * cfg.reelStagger;
    return strip
      .animate(buildFallKeyframes(startY, rowHeight), {
        duration,
        delay: 0,
        easing: 'linear',
        fill: 'forwards',
      })
      .finished.catch(() => {});
  }

  function readStripY(strip) {
    const t = getComputedStyle(strip).transform;
    if (!t || t === 'none') return 0;
    try {
      return new DOMMatrixReadOnly(t).m42;
    } catch (err) {
      return 0;
    }
  }

  // Vertical motion blur, driven each frame by how fast the reel is actually moving.
  // Blur peaks during the cruise and fades to zero as the reel brakes and settles.
  function runReelBlur(prepared) {
    let active = true;
    prepared.forEach((p) => {
      p.strip.style.filter = 'url(#mb' + p.reelIndex + ')';
      p.prevY = readStripY(p.strip);
    });

    function tick() {
      if (!active) return;
      prepared.forEach((p) => {
        const y = readStripY(p.strip);
        const velocity = Math.abs(y - p.prevY);
        p.prevY = y;
        const sigma = Math.min(velocity * cfg.blurGain, p.rowHeight * cfg.blurCapFrac);
        const f = blurFilters[p.reelIndex];
        if (f) f.setAttribute('stdDeviation', '0 ' + sigma.toFixed(2));
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    return function stopBlur() {
      active = false;
      prepared.forEach((p) => {
        p.strip.style.filter = '';
        const f = blurFilters[p.reelIndex];
        if (f) f.setAttribute('stdDeviation', '0 0');
      });
    };
  }

  // Visualise a server payload (ТЗ §8): spin the reels to payload.matrix and settle.
  // Returns the payload so callers (e.g. a future mascot / balance UI) can react to
  // payload.win / payload.featureTrigger.
  async function handleSpinResult(payload) {
    if (spinning) return payload;
    spinning = true;
    document.body.classList.add('is-spin-pending');
    const final = payload.matrix;
    const isMobile =
      window.matchMedia('(max-width: 820px)').matches ||
      window.matchMedia('(orientation: portrait)').matches;
    const selector = isMobile ? '.m-reel-grid .reel' : '.sym-grid .reel';
    const mode = isMobile ? 'mobile' : 'desktop';

    await delay(cfg.spinStartDelay);
    document.body.classList.remove('is-spin-pending');
    document.body.classList.add('is-spinning');
    const prepared = Array.from(document.querySelectorAll(selector)).map((reel, index) =>
      prepareReel(reel, index, currentReels[index], final[index], mode),
    );

    await waitFrame();
    const stopBlur = reduceMotion.matches ? function () {} : runReelBlur(prepared);
    const animations = prepared.map(animatePreparedReel);

    await Promise.all(animations);
    stopBlur();
    currentReels = final.map((reel) => reel.slice());
    document.querySelectorAll(selector).forEach((reel, index) => {
      const strip = reel.querySelector('.reel-strip');
      strip.getAnimations().forEach((animation) => animation.cancel());
      buildStaticStrip(strip, currentReels[index], mode);
    });
    document.body.classList.remove('is-spinning');
    spinning = false;
    return payload;
  }

  async function spin() {
    if (spinning) return undefined;
    const payload = server.requestSpin(bet);
    return handleSpinResult(payload);
  }

  function fit() {
    const isMobile =
      window.matchMedia('(max-width: 820px)').matches ||
      window.matchMedia('(orientation: portrait)').matches;
    if (isMobile) {
      const f = document.querySelector('.m-frame');
      if (f) f.style.transform = 'scale(' + Math.min(window.innerWidth / 390, window.innerHeight / 760) + ')';
    } else {
      const f = document.querySelector('.frame');
      if (f) f.style.transform = 'scale(' + Math.min(window.innerWidth / 1440, window.innerHeight / 1024) + ')';
    }
  }

  function start() {
    blurFilters = [0, 1, 2, 3, 4].map((i) => document.querySelector('#mb' + i + ' feGaussianBlur'));
    setInitialReels();
    fit();
    on(window, 'resize', fit);
    on(window, 'orientationchange', fit);
    document.querySelectorAll('.spin, .m-turbo-btn, .box-turbo').forEach((btn) => on(btn, 'click', spin));
  }

  function destroy() {
    listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
    listeners.length = 0;
  }

  return { start, spin, fit, destroy, get spinning() { return spinning; } };
}
