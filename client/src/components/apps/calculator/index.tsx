import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Calculator() {
    const [display, setDisplay] = useState("0");
    const [equation, setEquation] = useState("");
    const [isNewNumber, setIsNewNumber] = useState(true);

    const handleNumber = (num: string) => {
        if (isNewNumber) {
            setDisplay(num);
            setIsNewNumber(false);
        } else {
            setDisplay(display === "0" ? num : display + num);
        }
    };

    const handleOperator = (op: string) => {
        setEquation(display + " " + op + " ");
        setIsNewNumber(true);
    };

    const handleEqual = () => {
        try {
            const result = eval(equation + display);
            setDisplay(String(result));
            setEquation("");
            setIsNewNumber(true);
        } catch (e) {
            setDisplay("Error");
        }
    };

    const handleClear = () => {
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
    };

    const buttons = [
        { label: "C", onClick: handleClear, className: "bg-muted text-foreground" },
        { label: "±", onClick: () => setDisplay(String(-parseFloat(display))), className: "bg-muted text-foreground" },
        { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), className: "bg-muted text-foreground" },
        { label: "÷", onClick: () => handleOperator("/"), className: "bg-orange-500 text-white hover:bg-orange-600" },
        { label: "7", onClick: () => handleNumber("7") },
        { label: "8", onClick: () => handleNumber("8") },
        { label: "9", onClick: () => handleNumber("9") },
        { label: "×", onClick: () => handleOperator("*"), className: "bg-orange-500 text-white hover:bg-orange-600" },
        { label: "4", onClick: () => handleNumber("4") },
        { label: "5", onClick: () => handleNumber("5") },
        { label: "6", onClick: () => handleNumber("6") },
        { label: "-", onClick: () => handleOperator("-"), className: "bg-orange-500 text-white hover:bg-orange-600" },
        { label: "1", onClick: () => handleNumber("1") },
        { label: "2", onClick: () => handleNumber("2") },
        { label: "3", onClick: () => handleNumber("3") },
        { label: "+", onClick: () => handleOperator("+"), className: "bg-orange-500 text-white hover:bg-orange-600" },
        { label: "0", onClick: () => handleNumber("0"), className: "col-span-2" },
        { label: ".", onClick: () => handleNumber(".") },
        { label: "=", onClick: handleEqual, className: "bg-orange-500 text-white hover:bg-orange-600" },
    ];

    return (
        <div className="flex flex-col h-full bg-background p-4">
            <div className="flex-1 flex flex-col justify-end items-end p-4 mb-4 bg-muted/20 rounded-xl">
                <div className="text-muted-foreground text-sm h-6">{equation}</div>
                <div className="text-4xl font-light tabular-nums tracking-tight">{display}</div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {buttons.map((btn) => (
                    <Button
                        key={btn.label}
                        onClick={btn.onClick}
                        variant="secondary"
                        className={cn(
                            "h-14 text-xl font-medium rounded-full shadow-sm active:scale-95 transition-transform",
                            btn.className
                        )}
                    >
                        {btn.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
