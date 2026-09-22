// Per-reel vertical motion-blur filters. The engine drives each filter's stdDeviation
// (y-axis only) from the reel's live velocity, so fast mid-spin streaks and slow settle
// sharpening come for free. One filter per reel (#mb0..#mb4).
export default function MotionBlurDefs() {
  return (
    <svg className="mb-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <filter
            key={i}
            id={`mb${i}`}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0 0" edgeMode="duplicate" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
