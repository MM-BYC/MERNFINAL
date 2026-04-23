import { useState, useEffect, useCallback } from "react";
import "./Tutorial.css";

const STEPS = [
  {
    query: () => document.querySelector(".theme-toggle"),
    title: "Theme",
    text: "Click to cycle the theme: Light → System → Dark",
  },
  {
    query: () => document.querySelector(".new-note-btn"),
    title: "New Card",
    text: "Click here to add a new Card to your dashboard",
  },
  {
    query: () => document.querySelector(".check-box"),
    title: "Check & Delete",
    text: "Click the box to mark an item with X, then click the Delete button on that card to remove it",
    fallback: "Create a card with items first to try checking and deleting",
  },
  {
    query: () => document.querySelector(".add-body-btn"),
    title: "Add Item",
    text: "Click to add a new item to this card",
    fallback: "Create a card first to use the Add Item feature",
  },
  {
    query: () => document.querySelector(".drag-handle"),
    title: "Drag & Drop",
    text: "Click and hold the ⠿ handle, then drag the item and drop it onto any other card",
    fallback: "Create cards with items to try drag and drop",
  },
];

const BUBBLE_W = 230;
const BUBBLE_H = 148;
const GAP = 5;
const PAD = 12;

function getPlacement(r) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cy = r.top + r.height / 2;
  const cx = r.left + r.width / 2;
  let top, left, arrow;

  if (r.right + GAP + BUBBLE_W + PAD < vw) {
    left = r.right + GAP;
    top = Math.min(Math.max(cy - BUBBLE_H / 2, PAD), vh - BUBBLE_H - PAD);
    arrow = "left";
  } else if (r.left - GAP - BUBBLE_W > PAD) {
    left = r.left - GAP - BUBBLE_W;
    top = Math.min(Math.max(cy - BUBBLE_H / 2, PAD), vh - BUBBLE_H - PAD);
    arrow = "right";
  } else if (r.bottom + GAP + BUBBLE_H + PAD < vh) {
    top = r.bottom + GAP;
    left = Math.min(Math.max(cx - BUBBLE_W / 2, PAD), vw - BUBBLE_W - PAD);
    arrow = "top";
  } else {
    top = r.top - GAP - BUBBLE_H;
    left = Math.min(Math.max(cx - BUBBLE_W / 2, PAD), vw - BUBBLE_W - PAD);
    arrow = "bottom";
  }

  return { top, left, arrow };
}

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const recalc = useCallback(() => {
    const el = current.query();
    if (!el) {
      setPos(null);
      setIsFallback(true);
      return;
    }
    setIsFallback(false);
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      const { top, left, arrow } = getPlacement(r);
      setPos({
        spot: {
          top: r.top - 8,
          left: r.left - 8,
          width: r.width + 16,
          height: r.height + 16,
        },
        bubble: { top, left },
        arrow,
      });
    }, 300);
  }, [step]);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleNext = () => (isLast ? onClose() : setStep((s) => s + 1));

  const text = isFallback && current.fallback ? current.fallback : current.text;

  return (
    <div className="tut-root">
      {pos && (
        <div
          className="tut-spotlight"
          style={{
            top: pos.spot.top,
            left: pos.spot.left,
            width: pos.spot.width,
            height: pos.spot.height,
          }}
        />
      )}

      <div
        className={`tut-bubble${pos ? ` tut-arrow-${pos.arrow}` : " tut-center"}`}
        style={pos ? { top: pos.bubble.top, left: pos.bubble.left } : {}}
      >
        <div className="tut-count">
          Step {step + 1} of {STEPS.length}
        </div>
        <div className="tut-title">{current.title}</div>
        <p className="tut-text">{text}</p>
        <div className="tut-actions">
          <button className="tut-skip" onClick={onClose}>
            Skip
          </button>
          <button className="tut-next" onClick={handleNext}>
            {isLast ? "Finish ✓" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
