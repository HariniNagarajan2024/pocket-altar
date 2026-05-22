import { lazy, Suspense, useEffect, useState, memo } from "react";
import type { ComponentProps } from "react";

const FloatingParticles = lazy(() =>
  import("./FloatingParticles").then((m) => ({ default: m.FloatingParticles }))
);

type Props = ComponentProps<typeof FloatingParticles> & {
  delayMs?: number;
};

/** Delays decorative particles until after first paint */
function DeferredParticlesInner({ delayMs = 400, ...props }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setTimeout(() => setShow(true), delayMs);
    });
    return () => cancelAnimationFrame(t);
  }, [delayMs]);

  if (!show) return null;

  return (
    <Suspense fallback={null}>
      <FloatingParticles {...props} />
    </Suspense>
  );
}

export const DeferredParticles = memo(DeferredParticlesInner);
