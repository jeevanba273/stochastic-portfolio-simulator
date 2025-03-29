
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/ModelSelector";
import { ParameterControls, ModelParameters } from "@/components/ParameterControls";
import { SimulationChart } from "@/components/SimulationChart";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { simulateGBM } from "@/lib/models/gbm";
import { simulateJumpDiffusion } from "@/lib/models/jumpDiffusion";
import { simulateHeston } from "@/lib/models/heston";
import { calculateStatistics, StatisticsSummary } from "@/lib/utils/statistics";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin } from "lucide-react";

const Index = () => {
  // State for model selection and parameters
  const [modelType, setModelType] = useState<"gbm" | "jumpDiffusion" | "heston">("gbm");
  const [parameters, setParameters] = useState<ModelParameters>({
    initialPrice: 100,
    drift: 0.1,
    volatility: 0.2,
    timeHorizon: 3,
    steps: 252,
    paths: 100
  });
  
  // State for simulation results
  const [simulationResults, setSimulationResults] = useState<number[][]>([]);
  const [statistics, setStatistics] = useState<StatisticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get toast function for notifications
  const { toast } = useToast();
  
  // Run initial simulation on load
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle model change
  const handleModelChange = (model: "gbm" | "jumpDiffusion" | "heston") => {
    setModelType(model);
    // Add default parameters for specific models if needed
    if (model === "jumpDiffusion" && !parameters.jumpIntensity) {
      setParameters({
        ...parameters,
        jumpIntensity: 0.5,
        meanJumpSize: 0,
        jumpVolatility: 0.1
      });
    } else if (model === "heston" && !parameters.kappa) {
      setParameters({
        ...parameters,
        kappa: 2.0,
        theta: 0.04,
        xi: 0.3,
        rho: -0.7,
        v0: 0.04
      });
    }
  };
  
  // Run simulation with current parameters
  const runSimulation = async () => {
    setIsLoading(true);
    
    // Small delay to allow UI to update with loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      let results: number[][] = [];
      
      switch (modelType) {
        case "gbm":
          results = simulateGBM(
            parameters.initialPrice,
            parameters.drift,
            parameters.volatility,
            parameters.timeHorizon,
            parameters.steps,
            parameters.paths
          );
          break;
          
        case "jumpDiffusion":
          results = simulateJumpDiffusion(
            parameters.initialPrice,
            parameters.drift,
            parameters.volatility,
            parameters.timeHorizon,
            parameters.steps,
            parameters.paths,
            parameters.jumpIntensity || 0.5,
            parameters.meanJumpSize || 0,
            parameters.jumpVolatility || 0.1
          );
          break;
          
        case "heston":
          results = simulateHeston(
            parameters.initialPrice,
            parameters.drift,
            parameters.timeHorizon,
            parameters.steps,
            parameters.paths,
            parameters.kappa || 2.0,
            parameters.theta || 0.04,
            parameters.xi || 0.3,
            parameters.rho || -0.7,
            parameters.v0 || 0.04
          );
          break;
      }
      
      // Calculate statistics
      const stats = calculateStatistics(results);
      
      setSimulationResults(results);
      setStatistics(stats);
      
      toast({
        title: "Simulation Complete",
        description: `Generated ${parameters.paths} paths with the ${modelType} model.`,
      });
    } catch (error) {
      console.error("Simulation error:", error);
      toast({
        title: "Simulation Error",
        description: "An error occurred while running the simulation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export simulation data as CSV
  const exportSimulationData = () => {
    if (!simulationResults.length) return;
    
    // Transpose the data for CSV format (time steps as rows)
    const data = [];
    const numSteps = simulationResults[0].length;
    const numPaths = simulationResults.length;
    
    // Create header row
    const header = ["Time Point"];
    for (let i = 0; i < numPaths; i++) {
      header.push(`Path ${i + 1}`);
    }
    data.push(header.join(","));
    
    // Add data rows
    for (let step = 0; step < numSteps; step++) {
      const row = [(step / numSteps * parameters.timeHorizon).toFixed(2)];
      for (let path = 0; path < numPaths; path++) {
        row.push(simulationResults[path][step].toFixed(2));
      }
      data.push(row.join(","));
    }
    
    // Create and download the CSV file
    const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${modelType}-simulation-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Simulation data has been exported as CSV.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none -z-10" />
      
      {/* Main content */}
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <PortfolioHeader />
          
          {/* Main layout grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left sidebar with controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">Simulation Model</h2>
                  <ModelSelector selectedModel={modelType} onChange={handleModelChange} />
                </CardContent>
              </Card>
              
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-white">Model Parameters</h2>
                  <ParameterControls
                    modelType={modelType}
                    parameters={parameters}
                    onChange={setParameters}
                  />
                  
                  {/* Run Simulation Button - Moved here */}
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={runSimulation} 
                      disabled={isLoading}
                      className="relative overflow-hidden group bg-primary hover:bg-primary/90 text-white w-full"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-50 transition-opacity" />
                      <span className="relative flex items-center justify-center">
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
                </CardContent>
              </Card>
            </div>
            
            {/* Right side with charts */}
            <div className="lg:col-span-2">
              <SimulationChart
                simulations={simulationResults}
                timeHorizon={parameters.timeHorizon}
                isLoading={isLoading}
                statistics={statistics}
                onExport={exportSimulationData}
                onRefresh={runSimulation}
              />
            </div>
          </div>
          
          {/* Footer info */}
          <div className="text-center text-sm text-muted-foreground mt-12">
            <div className="flex justify-center items-center space-x-6 mb-4">
              <a 
                href="https://github.com/jeevanba273" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
                aria-label="GitHub Profile"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/jeevanba273/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p>Stochastic Portfolio Simulator uses advanced stochastic models to simulate financial asset price paths.</p>
            <p className="mt-1">Built with React, Tailwind CSS and Recharts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
