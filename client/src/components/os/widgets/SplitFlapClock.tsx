import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface AnimatedCardProps {
  animation: "fold" | "unfold";
  digit: string;
}

function AnimatedCard({ animation, digit }: AnimatedCardProps) {
  return (
    <div
      className={cn("flipCard", animation === "fold" ? "fold" : "unfold")}
    >
      <span>{digit}</span>
    </div>
  );
}

interface StaticCardProps {
  position: "upperCard" | "lowerCard";
  digit: string;
}

function StaticCard({ position, digit }: StaticCardProps) {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
}

interface FlipUnitContainerProps {
  digit: number;
  shuffle: boolean;
  unit: "hours" | "minutes" | "seconds";
}

function FlipUnitContainer({ digit, shuffle, unit }: FlipUnitContainerProps) {
  let currentDigit = digit;
  let previousDigit = digit - 1;

  // Prevent negative value
  if (unit !== "hours") {
    previousDigit = previousDigit === -1 ? 59 : previousDigit;
  } else {
    previousDigit = previousDigit === 0 ? 12 : previousDigit;
  }

  // Add zero padding
  const currentDigitStr =
    currentDigit < 10 ? `0${currentDigit}` : `${currentDigit}`;
  const previousDigitStr =
    previousDigit < 10 ? `0${previousDigit}` : `${previousDigit}`;

  // Shuffle digits
  const digit1 = shuffle ? previousDigitStr : currentDigitStr;
  const digit2 = !shuffle ? previousDigitStr : currentDigitStr;

  // Shuffle animations
  const animation1 = shuffle ? "fold" : "unfold";
  const animation2 = !shuffle ? "fold" : "unfold";

  return (
    <div className="flipUnitContainer">
      <StaticCard position="upperCard" digit={currentDigitStr} />
      <StaticCard position="lowerCard" digit={previousDigitStr} />
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  );
}

export function SplitFlapClock() {
  const [hours, setHours] = useState(0);
  const [hoursShuffle, setHoursShuffle] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [minutesShuffle, setMinutesShuffle] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [secondsShuffle, setSecondsShuffle] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const time = new Date();
      let newHours = time.getHours();
      const newMinutes = time.getMinutes();
      const newSeconds = time.getSeconds();

      // Convert to 12-hour format
      newHours = newHours % 12 || 12;

      if (newHours !== hours) {
        setHours(newHours);
        setHoursShuffle(!hoursShuffle);
      }
      if (newMinutes !== minutes) {
        setMinutes(newMinutes);
        setMinutesShuffle(!minutesShuffle);
      }
      if (newSeconds !== seconds) {
        setSeconds(newSeconds);
        setSecondsShuffle(!secondsShuffle);
      }
    };

    const timerID = setInterval(updateTime, 100);
    return () => clearInterval(timerID);
  }, [hours, hoursShuffle, minutes, minutesShuffle, seconds, secondsShuffle]);

  const dateNow = new Date();
  const dateString = dateNow.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const isPM = dateNow.getHours() >= 12;

  return (
    <>
      <style>{`
        .flipClock {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: center;
        }

        .flipUnitContainer {
          display: block;
          position: relative;
          width: 82px;
          height: 48px;
          perspective-origin: 50% 50%;
          perspective: 320px;
          border-radius: 12px;
          box-shadow: 0px 8px 24px -6px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.1);
        }

        .upperCard, .lowerCard {
          display: flex;
          position: relative;
          justify-content: center;
          width: 100%;
          height: 50%;
          overflow: hidden;
        }

        .upperCard span, .lowerCard span {
          font-size: 2.3rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-weight: 800;
          background: linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
        }

        .upperCard {
          align-items: flex-end;
          border-bottom: 0.5px solid rgba(99, 102, 241, 0.3);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          background: linear-gradient(180deg, #18181b 0%, #111113 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 0.5px solid rgba(99, 102, 241, 0.4);
        }

        .upperCard span {
          transform: translateY(50%);
        }

        .lowerCard {
          align-items: flex-start;
          border-top: 0.5px solid rgba(99, 102, 241, 0.3);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          background: linear-gradient(180deg, #111113 0%, #09090b 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 0.5px solid rgba(99, 102, 241, 0.4);
        }

        .lowerCard span {
          transform: translateY(-50%);
        }

        .flipCard {
          display: flex;
          justify-content: center;
          position: absolute;
          left: 0;
          width: 100%;
          height: 50%;
          overflow: hidden;
          backface-visibility: hidden;
        }

        .flipCard span {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 2.3rem;
          font-weight: 800;
          background: linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
        }

        .flipCard.unfold {
          top: 50%;
          align-items: flex-start;
          transform-origin: 50% 0%;
          transform: rotateX(180deg);
          background: linear-gradient(180deg, #111113 0%, #09090b 100%);
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 0.5px solid rgba(99, 102, 241, 0.4);
        }

        .flipCard.unfold span {
          transform: translateY(-50%);
        }

        .flipCard.fold {
          top: 0%;
          align-items: flex-end;
          transform-origin: 50% 100%;
          transform: rotateX(0deg);
          background: linear-gradient(180deg, #18181b 0%, #111113 100%);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 0.5px solid rgba(99, 102, 241, 0.4);
        }

        .flipCard.fold span {
          transform: translateY(50%);
        }

        .fold {
          animation: fold 0.55s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
          transform-style: preserve-3d;
        }

        .unfold {
          animation: unfold 0.55s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
          transform-style: preserve-3d;
        }

        @keyframes fold {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-180deg);
          }
        }

        @keyframes unfold {
          0% {
            transform: rotateX(180deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>

      <div className="bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/90 dark:border-zinc-800/90 rounded-3xl p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 select-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-xs shadow-indigo-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Split-Flap Clock
            </span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {isPM ? "PM" : "AM"}
          </span>
        </div>

        {/* 3D Flip Clock Units */}
        <div className="flipClock my-2">
          <div className="flex flex-col items-center gap-1.5">
            <FlipUnitContainer
              unit="hours"
              digit={hours}
              shuffle={hoursShuffle}
            />
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
              Hours
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5 h-[48px] -mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/60" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <FlipUnitContainer
              unit="minutes"
              digit={minutes}
              shuffle={minutesShuffle}
            />
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
              Minutes
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5 h-[48px] -mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500/60" />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <FlipUnitContainer
              unit="seconds"
              digit={seconds}
              shuffle={secondsShuffle}
            />
            <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
              Seconds
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2.5 mt-2 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400 px-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-indigo-500" />
            <span>{dateString}</span>
          </div>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            12-HR SYSTEM
          </span>
        </div>
      </div>
    </>
  );
}
