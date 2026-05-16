import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";

export default function AnimatedPageTransition({ children }) {
  const [location] = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("visible");
  const exitTimerRef = useRef(null);
  const enterTimerRef = useRef(null);

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage("exiting");
      
      exitTimerRef.current = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("entering");
        
        enterTimerRef.current = setTimeout(() => {
          setTransitionStage("visible");
        }, 50);
      }, 200);
      
      return () => {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      };
    }
  }, [children, displayChildren, location]);

  const getTransitionStyles = () => {
    switch (transitionStage) {
      case "exiting":
        return {
          opacity: 0,
          transform: "translateY(-8px)",
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out"
        };
      case "entering":
        return {
          opacity: 0,
          transform: "translateY(8px)",
          transition: "none"
        };
      case "visible":
      default:
        return {
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out"
        };
    }
  };

  return (
    <div 
      className="page-transition-wrapper"
      style={getTransitionStyles()}
      data-testid="page-transition"
    >
      {displayChildren}
    </div>
  );
}

export function PageFadeIn({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export function StaggeredList({ children, staggerDelay = 80, className = "" }) {
  return (
    <div className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <PageFadeIn key={index} delay={index * staggerDelay}>
          {child}
        </PageFadeIn>
      )) : children}
    </div>
  );
}
