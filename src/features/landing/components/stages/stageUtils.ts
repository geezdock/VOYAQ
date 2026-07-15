import { MotionValue, useTransform } from "framer-motion";

export function useStageOpacity(
  scrollYProgress: MotionValue<number>,
  start: number,
  end: number,
  fade: number = 0.03
) {
  return useTransform(scrollYProgress, (v: number) => {
    if (v < start - fade) return 0;
    if (v < start) return (v - (start - fade)) / fade;
    if (v < end) return 1;
    if (v < end + fade) return 1 - (v - end) / fade;
    return 0;
  });
}
