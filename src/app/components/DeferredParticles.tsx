import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentProps } from "react";

const FloatingParticles = lazy(() =>
  import("./FloatingParticles").then((m) => ({ default: m.FloatingParticles }))
);

type Props = ComponentProps<typeof FloatingParticles> & {
  delayMs?: number;
};

/** Delays decorative particles until after first paint */
export function DeferredParticles({ delayMs = 400, ...props }: Props) {
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
