import Reel from './Reel.jsx';

// Desktop layout — Frame 1 / Figma node 1:24, 1440x1024. DOM/classes match the original
// static markup exactly so /desktop.css lays it out pixel-for-pixel.
export default function DesktopLayout() {
  return (
    <div className="viewport desktop-root">
      <div className="frame" data-node-id="1:24">
        {/* Background — exact Figma placement (node 1:25) */}
        <div className="bg">
          <div className="bg-img" />
          <div className="bg-grad" />
        </div>

        {/* Settings + Music buttons */}
        <div className="top-btn" style={{ left: '1276px', top: '26px' }}>
          <img src="assets/ic_music.svg" alt="music" />
        </div>
        <div className="top-btn" style={{ left: '1350px', top: '26px' }}>
          <img src="assets/ic_settings.svg" alt="settings" />
        </div>

        {/* Slot machine */}
        <div className="slot-outer" />
        <div className="slot-inner">
          <div className="sym-grid">
            <Reel index={0} />
            <Reel index={1} />
            <Reel index={2} />
            <Reel index={3} />
            <Reel index={4} />
          </div>
          <div className="grid-lines">
            <span className="v-line" style={{ left: '156px', width: '3px' }} />
            <span className="v-line" style={{ left: '315px', width: '2px' }} />
            <span className="v-line" style={{ left: '473px', width: '2px' }} />
            <span className="v-line" style={{ left: '631px', width: '2px' }} />
            <span className="h-line" style={{ top: '155px', height: '3px' }} />
            <span className="h-line" style={{ top: '314px', height: '2px' }} />
          </div>
        </div>

        {/* Left card: BONUS BUY */}
        <div className="side-card left-card">
          <div className="lc-buy">
            <img src="assets/buy_desktop.svg" alt="" />
          </div>
          <p className="lc-text">text text</p>
          <div className="lc-btn">BONUS BUY</div>
        </div>

        {/* Right card: EXTRA CHANCE */}
        <div className="side-card right-card">
          <p className="rc-title">
            EXtra
            <br />
            CHANCE
          </p>
          <div className="rc-star">
            <img src="assets/star.svg" alt="" />
          </div>
          <p className="rc-bet">BET: $0.6</p>
          <div className="rc-bar">
            <div className="rc-bar-fill" />
          </div>
        </div>

        {/* Ready to spin */}
        <div className="ready">
          <span className="ready-dot">
            <img src="assets/greendot.svg" alt="" />
          </span>
          <span className="ready-text">Ready to spin</span>
        </div>

        {/* Bottom control bar */}
        <div className="bar">
          <div className="box box-balance">
            <p className="lbl">Balance</p>
            <p className="val">$1 000 000</p>
          </div>

          <div className="lastwin">
            <p className="lbl gold">LAST WIN</p>
            <p className="val gold">$1000</p>
          </div>

          <div className="box box-bet">
            <p className="lbl gold bet-lbl">Bet</p>
            <div className="bet-row">
              <img className="bet-minus" src="assets/minus.svg" alt="" />
              <p className="bet-val">$0.6</p>
              <img className="bet-plus" src="assets/plus.svg" alt="" />
            </div>
          </div>

          <div className="spin">
            <p className="spin-title">SPIN</p>
            <p className="spin-sub">READY</p>
          </div>

          <div className="box box-turbo">
            <img className="turbo-ic" src="assets/turbo.svg" alt="" />
            <p className="ctrl-lbl turbo-lbl">Turbo</p>
          </div>

          <div className="box box-auto">
            <img className="auto-ic" src="assets/auto.svg" alt="" />
            <p className="ctrl-lbl auto-lbl">AUTO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
