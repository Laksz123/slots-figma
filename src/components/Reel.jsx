// A single reel column: an empty .reel-strip that the engine fills with symbols and
// animates imperatively (React never re-renders these, so its DOM mutations persist).
export default function Reel({ index }) {
  return (
    <div className="reel" data-reel={index}>
      <div className="reel-strip" />
    </div>
  );
}
