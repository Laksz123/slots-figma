import { useEffect, useRef } from 'react';
import { createSlotEngine } from '../game/slotEngine.js';

// Mounts the imperative reel engine once the markup is in the DOM, cleans it up on
// unmount, and exposes a ref so React UI (buttons, etc.) can trigger a spin if needed.
export function useSlotEngine() {
  const engineRef = useRef(null);

  useEffect(() => {
    const engine = createSlotEngine();
    engineRef.current = engine;
    engine.start();

    let autoTimer = null;
    if (new URLSearchParams(window.location.search).has('autospin')) {
      autoTimer = setTimeout(() => engine.spin(), 500);
    }

    return () => {
      if (autoTimer) clearTimeout(autoTimer);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return engineRef;
}
