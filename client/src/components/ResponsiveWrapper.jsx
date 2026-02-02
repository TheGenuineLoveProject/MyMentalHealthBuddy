import { createContext, useContext, useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280
};

const ResponsiveContext = createContext({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenWidth: 1280,
  screenHeight: 800,
  orientation: "landscape",
  breakpoint: "desktop",
  prefersReducedMotion: false,
  touchDevice: false
});

export function useResponsive() {
  return useContext(ResponsiveContext);
}

export default function ResponsiveWrapper({ children }) {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1280,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    orientation: "landscape",
    breakpoint: "desktop",
    prefersReducedMotion: false,
    touchDevice: false
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
      const isDesktop = width >= BREAKPOINTS.tablet;
      
      let breakpoint = "desktop";
      if (isMobile) breakpoint = "mobile";
      else if (isTablet) breakpoint = "tablet";

      const orientation = width > height ? "landscape" : "portrait";
      
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        breakpoint,
        prefersReducedMotion,
        touchDevice
      });
    };

    updateState();

    window.addEventListener("resize", updateState);
    window.addEventListener("orientationchange", updateState);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", updateState);

    return () => {
      window.removeEventListener("resize", updateState);
      window.removeEventListener("orientationchange", updateState);
      motionQuery.removeEventListener("change", updateState);
    };
  }, []);

  const responsiveClasses = [
    state.isMobile && "responsive--mobile",
    state.isTablet && "responsive--tablet",
    state.isDesktop && "responsive--desktop",
    state.touchDevice && "responsive--touch",
    state.prefersReducedMotion && "responsive--reduced-motion"
  ].filter(Boolean).join(" ");

  return (
    <ResponsiveContext.Provider value={state}>
      <div 
        className={responsiveClasses}
        data-breakpoint={state.breakpoint}
        data-orientation={state.orientation}
      >
        {children}
      </div>
    </ResponsiveContext.Provider>
  );
}

export function MobileOnly({ children }) {
  const { isMobile } = useResponsive();
  return isMobile ? children : null;
}

export function TabletOnly({ children }) {
  const { isTablet } = useResponsive();
  return isTablet ? children : null;
}

export function DesktopOnly({ children }) {
  const { isDesktop } = useResponsive();
  return isDesktop ? children : null;
}

export function MobileAndTablet({ children }) {
  const { isMobile, isTablet } = useResponsive();
  return isMobile || isTablet ? children : null;
}

export function TabletAndDesktop({ children }) {
  const { isTablet, isDesktop } = useResponsive();
  return isTablet || isDesktop ? children : null;
}
