
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Laptop, Moon, Sun } from "lucide-react";

export function PortfolioHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20 rounded-xl pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between p-6 glass-card border border-primary/10 rounded-xl">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse-slow" />
            <h1 className="text-2xl font-bold text-white">Quantum Portfolio Simulator</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-muted/30 text-white">
              Advanced Stochastic Models
            </Badge>
            <Badge variant="outline" className="bg-muted/30 text-white">
              Risk Analysis
            </Badge>
            <Badge variant="outline" className="bg-muted/30 text-white">
              Monte Carlo Simulations
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center glass-input px-4 py-2 rounded-md">
            <span className="text-muted-foreground mr-2">
              {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-primary font-mono">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
