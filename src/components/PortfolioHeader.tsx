
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Laptop, Moon, Sun } from "lucide-react";

interface PortfolioHeaderProps {
  onRun: () => void;
  isLoading: boolean;
}

export function PortfolioHeader({ onRun, isLoading }: PortfolioHeaderProps) {
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
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center glass-input px-4 py-2 rounded-md">
            <span className="text-muted-foreground mr-2">
              {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-primary font-mono">
              {formatTime(currentTime)}
            </span>
          </div>
          
          <Button 
            onClick={onRun} 
            disabled={isLoading}
            className="relative overflow-hidden group bg-primary hover:bg-primary/90 text-white"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-50 transition-opacity" />
            <span className="relative flex items-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simulating...
                </>
              ) : (
                <>
                  Run Simulation
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
