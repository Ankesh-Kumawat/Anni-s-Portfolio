"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    className?: string;
    placeholder?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "Pick month & year"
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [year, setYear] = React.useState<number>(date ? date.getFullYear() : new Date().getFullYear())

  React.useEffect(() => {
    if (date) setYear(date.getFullYear());
  }, [date]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/5 hover:text-foreground transition-all duration-200",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? format(date, "MMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3 bg-background/95 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-xl animate-in zoom-in-95 data-[state=closed]:zoom-out-95 duration-200" 
        align="start"
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); setYear(y => y - 1); }} 
            className="h-8 w-8 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-bold tracking-wider">{year}</div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.preventDefault(); setYear(y => y + 1); }} 
            className="h-8 w-8 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5">
          {MONTHS.map((month, index) => {
            const isSelected = !!date && date.getMonth() === index && date.getFullYear() === year;
            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "h-9 text-xs font-semibold transition-all rounded-lg",
                  !isSelected && "hover:bg-primary/20 hover:text-primary text-muted-foreground",
                  isSelected && "shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const newDate = new Date();
                  newDate.setFullYear(year, index, 1);
                  setDate(newDate);
                  setOpen(false);
                }}
              >
                {month}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
