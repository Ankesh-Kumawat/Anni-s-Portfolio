import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
    animation: "fold" | "unfold";
    digit: string;
}

function AnimatedCard({ animation, digit }: AnimatedCardProps) {
    return (
        <div className={cn(
            "flipCard",
            animation === "fold" ? "fold" : "unfold"
        )}>
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
    const currentDigitStr = currentDigit < 10 ? `0${currentDigit}` : `${currentDigit}`;
    const previousDigitStr = previousDigit < 10 ? `0${previousDigit}` : `${previousDigit}`;

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

        const timerID = setInterval(updateTime, 50);
        return () => clearInterval(timerID);
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Droid+Sans+Mono');

                .flipClock {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .flipUnitContainer {
                    display: block;
                    position: relative;
                    width: 100px;
                    height: 90px;
                    perspective-origin: 50% 50%;
                    perspective: 300px;
                    background-color: #1a1510;
                    border-radius: 6px;
                    box-shadow: 0px 10px 20px -10px rgba(255, 107, 53, 0.3), 0 0 30px rgba(255, 140, 66, 0.1);
                }

                .upperCard, .lowerCard {
                    display: flex;
                    position: relative;
                    justify-content: center;
                    width: 100%;
                    height: 50%;
                    overflow: hidden;
                    border: 1px solid #2a2a2a;
                }

                .upperCard span, .lowerCard span {
                    font-size: 3.5rem;
                    font-family: 'Droid Sans Mono', monospace;
                    font-weight: lighter;
                    background: linear-gradient(to bottom, #ff6b35 0%, #ff8c42 50%, #ffa600 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.6)) drop-shadow(0 0 15px rgba(255, 140, 66, 0.4));
                }

                .upperCard {
                    align-items: flex-end;
                    border-bottom: 0.5px solid #3a2a1a;
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    background: linear-gradient(to bottom, #2a1f1a 0%, #1f1a15 100%);
                }

                .upperCard span {
                    transform: translateY(50%);
                }

                .lowerCard {
                    align-items: flex-start;
                    border-top: 0.5px solid #3a2a1a;
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                    background: linear-gradient(to bottom, #1a1510 0%, #0f0a08 100%);
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
                    font-family: 'Droid Sans Mono', monospace;
                    font-size: 3.5rem;
                    font-weight: lighter;
                    background: linear-gradient(to bottom, #ff6b35 0%, #ff8c42 50%, #ffa600 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.6)) drop-shadow(0 0 15px rgba(255, 140, 66, 0.4));
                }

                .flipCard.unfold {
                    top: 50%;
                    align-items: flex-start;
                    transform-origin: 50% 0%;
                    transform: rotateX(180deg);
                    background: linear-gradient(to bottom, #1a1510 0%, #0f0a08 100%);
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                    border: 0.5px solid #3a2a1a;
                    border-top: 0.5px solid #3a2a1a;
                }

                .flipCard.unfold span {
                    transform: translateY(-50%);
                }

                .flipCard.fold {
                    top: 0%;
                    align-items: flex-end;
                    transform-origin: 50% 100%;
                    transform: rotateX(0deg);
                    background: linear-gradient(to bottom, #2a1f1a 0%, #1f1a15 100%);
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    border: 0.5px solid #3a2a1a;
                    border-bottom: 0.5px solid #3a2a1a;
                }

                .flipCard.fold span {
                    transform: translateY(50%);
                }

                .fold {
                    animation: fold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
                    transform-style: preserve-3d;
                }

                .unfold {
                    animation: unfold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
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

            <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-2xl p-5 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-xs font-medium uppercase tracking-wider"
                            style={{
                                background: 'linear-gradient(to right, #ff6b35, #ff8c42, #ffa600)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 4px rgba(255, 107, 53, 0.5))'
                            }}>
                            Clock By Anni
                        </span>
                    </div>
                </div>

                {/* Flip Clock */}
                <div className="flipClock mb-4">
                    <div className="flex flex-col items-center gap-1.5">
                        <FlipUnitContainer unit="hours" digit={hours} shuffle={hoursShuffle} />
                        <span className="text-[10px] uppercase tracking-wide font-medium"
                            style={{
                                background: 'linear-gradient(to right, #ff6b35, #ffa600)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 3px rgba(255, 107, 53, 0.4))'
                            }}>Hours</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 h-[90px] mb-[22px]">
                        <div className="w-2 h-2 rounded-full bg-orange-500/70" style={{ boxShadow: '0 0 6px rgba(255, 107, 53, 0.6)' }} />
                        <div className="w-2 h-2 rounded-full bg-orange-500/70" style={{ boxShadow: '0 0 6px rgba(255, 107, 53, 0.6)' }} />
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <FlipUnitContainer unit="minutes" digit={minutes} shuffle={minutesShuffle} />
                        <span className="text-[10px] uppercase tracking-wide font-medium"
                            style={{
                                background: 'linear-gradient(to right, #ff6b35, #ffa600)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 3px rgba(255, 107, 53, 0.4))'
                            }}>Minutes</span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3 h-[90px] mb-[22px]">
                        <div className="w-2 h-2 rounded-full bg-orange-500/70" style={{ boxShadow: '0 0 6px rgba(255, 107, 53, 0.6)' }} />
                        <div className="w-2 h-2 rounded-full bg-orange-500/70" style={{ boxShadow: '0 0 6px rgba(255, 107, 53, 0.6)' }} />
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <FlipUnitContainer unit="seconds" digit={seconds} shuffle={secondsShuffle} />
                        <span className="text-[10px] uppercase tracking-wide font-medium"
                            style={{
                                background: 'linear-gradient(to right, #ff6b35, #ffa600)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 3px rgba(255, 107, 53, 0.4))'
                            }}>Seconds</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-orange-900/30 flex items-center justify-between text-xs">
                    <span style={{
                        background: 'linear-gradient(to right, #ff6b35, #ffa600)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 3px rgba(255, 107, 53, 0.4))'
                    }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-mono" style={{
                        background: 'linear-gradient(to right, #ff6b35, #ffa600)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 3px rgba(255, 107, 53, 0.4))'
                    }}>
                        {new Date().getHours() >= 12 ? 'PM' : 'AM'}
                    </span>
                </div>
            </div>
        </>
    );
}
