import MotionBlurDefs from './components/MotionBlurDefs.jsx';
import DesktopLayout from './components/DesktopLayout.jsx';
import MobileLayout from './components/MobileLayout.jsx';
import { useSlotEngine } from './hooks/useSlotEngine.js';

// Both layouts are always in the DOM; /desktop.css toggles between them by media query
// (<=820px or portrait -> mobile), exactly as in the original static build.
export default function App() {
  useSlotEngine();

  return (
    <>
      <MotionBlurDefs />
      <DesktopLayout />
      <MobileLayout />
    </>
  );
}
