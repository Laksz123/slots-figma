import { results } from './data.js';

// Stand-in for the FastAPI `/spin` endpoint (ТЗ §8). The client only ever consumes a
// JSON payload of this shape, so swapping this for a real `fetch()` later requires no
// change to the animation engine — just make `requestSpin` async and await the network.
//
// payload = {
//   matrix,          // [reel][row] final symbols the reels land on
//   win,             // total win for the spin (payline + collect); backend math, TODO
//   featureTrigger,  // Hold & Win trigger flag; backend, TODO — used by the mascot later
//   bet,             // bet echoed back
// }

let spinIndex = 1;

export function requestSpin(bet = 0.6) {
  const matrix = results[spinIndex % results.length];
  spinIndex += 1;
  return {
    matrix,
    win: 0,
    featureTrigger: false,
    bet,
  };
}
