import { useRef, useEffect } from "react";

function SnapNoteBrand({ scrollParallax = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let scrollY = window.scrollY;
    let rafId = null;

    const apply = () => {
      const { innerWidth, innerHeight } = window;
      const rx = -((mouseY / innerHeight) - 0.5) * 12;
      const ry = ((mouseX / innerWidth) - 0.5) * 12;
      const ty = scrollParallax ? scrollY * -0.45 : 0;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ty}px) translateZ(12px)`;
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("mousemove", onMouseMove);
    if (scrollParallax) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (scrollParallax) window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [scrollParallax]);

  return (
    <h1 ref={ref} className="snapnote-brand">
      SnapNote
    </h1>
  );
}

export default SnapNoteBrand;
