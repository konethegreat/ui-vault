// Original: Animated Hero by Tommy Jepsen (https://21st.dev/@tommyjepsen/components/animated-hero), MIT.
// The MIT notice is in LICENSE.md.
// Changes in this repository: "framer-motion" is imported from "motion/react"; the shadcn Button
// import points at this repository's Button; the outline button uses the local ghost variant;
// "text-spektr-cyan-50" is now "text-foreground"; the rotation stops under prefers-reduced-motion
// and inactive titles are hidden from assistive technology. The layout and copy are unchanged.

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "./Button";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setTitleNumber(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles, reduced]);

  return (
    <div className="w-full">
      <div className="container mx-auto px-5">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4 whitespace-nowrap">
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-foreground">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                {reduced ? (
                  <span className="font-semibold">{titles[0]}</span>
                ) : (
                  <>
                    &nbsp;
                    {titles.map((title, index) => (
                      <motion.span
                        key={index}
                        aria-hidden={titleNumber !== index}
                        className="absolute font-semibold"
                        initial={{ opacity: 0, y: "-100" }}
                        transition={{ type: "spring", stiffness: 50 }}
                        animate={
                          titleNumber === index
                            ? {
                                y: 0,
                                opacity: 1,
                              }
                            : {
                                y: titleNumber > index ? -150 : 150,
                                opacity: 0,
                              }
                        }
                      >
                        {title}
                      </motion.span>
                    ))}
                  </>
                )}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-4 whitespace-nowrap" variant="ghost">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 whitespace-nowrap">
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
