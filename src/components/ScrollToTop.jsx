// components/ScrollToTop.jsx
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Smooth scrolling
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    
    // OR instant scrolling (faster):
    // window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;