declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    spread?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    angle?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    colors?: string[];
    ticks?: number;
    shapes?: ('circle' | 'square' | 'triangle')[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    useWorker?: boolean;
    resize?: boolean;
  }

  export interface GlobalOptions {
    resize?: boolean;
    useWorker?: boolean;
    disableForReducedMotion?: boolean;
  }

  export default function confetti(options?: Options): Promise<void> | void;
  export function confetti(options: Options): Promise<void> | void;
}
