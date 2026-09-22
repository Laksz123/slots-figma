import Reel from './Reel.jsx';

// Mobile layout — Figma node 66:290, 390x760. DOM/classes match the original static
// markup exactly so /desktop.css (its @media portrait block) lays it out pixel-for-pixel.
export default function MobileLayout() {
  return (
    <div className="viewport mobile-root">
      <div className="m-frame">
        {/* Background */}
        <div className="m-bg">
          <div className="m-bg-img" />
          <div className="m-bg-grad" />
        </div>

        {/* Logo + jackpots */}
        <div className="m-logo" />
        <p className="m-logo-text">SlotUNO</p>
        <div className="m-jack m-jack-minor">
          <span className="jk-t">MINOR</span>
          <span className="jk-v">100</span>
        </div>
        <div className="m-jack m-jack-mini">
          <span className="jk-t">MINi</span>
          <span className="jk-v">40</span>
        </div>
        <div className="m-jack m-jack-grand">
          <span className="jk-t">GRAND</span>
          <span className="jk-v">4.000</span>
        </div>
        <div className="m-jack m-jack-major">
          <span className="jk-t">MAJOR</span>
          <span className="jk-v">500</span>
        </div>

        {/* Slot */}
        <div className="m-slot-outer" />
        <div className="m-slot-inner">
          <div className="grid-lines">
            <span className="v-line" style={{ left: '66px', width: '1px' }} />
            <span className="v-line" style={{ left: '131px', width: '1px' }} />
            <span className="v-line" style={{ left: '196px', width: '1px' }} />
            <span className="v-line" style={{ left: '261px', width: '1px' }} />
            <span className="h-line" style={{ top: '64px', height: '1px' }} />
            <span className="h-line" style={{ top: '129px', height: '1px' }} />
          </div>
          <div className="m-reel-grid">
            <Reel index={0} />
            <Reel index={1} />
            <Reel index={2} />
            <Reel index={3} />
            <Reel index={4} />
          </div>
        </div>

        {/* Bonus buy */}
        <div className="m-bonusbuy">
          <img src="assets/m_buy.svg" alt="" className="m-bb-ic" />
          <span className="m-bb-text">BONUS BUY</span>
        </div>

        {/* Place your bet */}
        <div className="m-pyb-bar" />
        <p className="m-pyb-text">Place your bet</p>

        {/* Control bar */}
        <div className="m-ctrl">
          <div className="m-cbtn m-menu">
            <span className="m-ham" />
            <span className="m-ham" />
            <span className="m-ham" />
          </div>
          <div className="m-cbtn m-ff">
            <img src="assets/m_ff.svg" alt="" />
          </div>
          <div className="m-turbo-btn">
            <span>
              Hold for
              <br />
              turbo
            </span>
          </div>
          <div className="m-cbtn m-coins">
            <img src="assets/m_coins.svg" alt="" />
          </div>
          <div className="m-cbtn m-auto">
            <div className="m-auto-ic">
              <img className="m-auto-ellipse" src="assets/m_auto_ellipse.png" alt="" />
              <span className="m-auto-a">A</span>
              <img className="m-auto-arc" src="assets/m_auto_arc.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Bet / balance footer */}
        <p className="m-bet-foot">bet: $3</p>
        <p className="m-bal-foot">$ 1 000 000</p>
      </div>
    </div>
  );
}
