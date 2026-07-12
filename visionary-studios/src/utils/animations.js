import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const fadeLeft = (element) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      x: -80,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    }
  );
};

export const fadeRight = (element) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      x: 80,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    }
  );
};

export const fadeUp = (element) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      y: 60,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    }
  );
};

export const staggerCards = (selector) => {
  const cards = gsap.utils.toArray(selector);

  if (!cards.length) return;

  gsap.fromTo(
    cards,
    {
      y: 40,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: cards[0],
        start: "top 90%",
        once: true,
      },
    }
  );
};