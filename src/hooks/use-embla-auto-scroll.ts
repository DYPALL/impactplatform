import { useMemo } from "react";
import AutoScroll from "embla-carousel-auto-scroll";

type AutoScrollPlugin = ReturnType<typeof AutoScroll>;

/**
 * Embla's auto-scroll plugin keeps its own reference to the carousel instance and
 * throws when play()/stop() run before it has been attached, or after that instance
 * is gone. Wrapping it keeps those calls inert outside the window where they are valid.
 */
export function useEmblaAutoScroll(speed = 0.8) {
  return useMemo(() => {
    const raw = AutoScroll({ speed, startDelay: 800, playOnInit: false, stopOnInteraction: false });
    let attached = false;
    const init: AutoScrollPlugin["init"] = (emblaApi, optionsHandler) => {
      raw.init(emblaApi, optionsHandler);
      attached = true;
    };
    const destroy = () => {
      attached = false;
      raw.destroy();
    };
    const guard = (run: () => void) => () => {
      if (!attached) return;
      try {
        run();
      } catch {
        attached = false;
      }
    };
    return {
      plugin: { ...raw, init, destroy } as AutoScrollPlugin,
      play: guard(() => raw.play()),
      stop: guard(() => raw.stop()),
    };
    // The plugin is created once per mounted carousel; speed never changes at runtime.
  }, [speed]);
}
