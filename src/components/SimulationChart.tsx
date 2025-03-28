
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Area, 
  AreaChart, 
  ComposedChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  TooltipProps 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ZoomIn } from "lucide-react";
import { StatisticsSummary } from "@/lib/utils/statistics";
import { useIsMobile } from "@/hooks/use-mobile";

interface SimulationChartProps {
  simulations: number[][];
  timeHorizon: number;
  isLoading: boolean;
  statistics: StatisticsSummary | null;
  onExport: () => void;
  onRefresh: () => void;
}

// Define a proper type for our histogram bin
interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  binCenter: number;
  percentage: number;
}

export function SimulationChart({
  simulations,
  timeHorizon,
  isLoading,
  statistics,
  onExport,
  onRefresh
}: SimulationChartProps) {
  const [activePathIndex, setActivePathIndex] = useState<number | null>(null);
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [histogramData, setHistogramData] = useState<HistogramBin[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  // Prepare line chart data
  useEffect(() => {
    if (!simulations.length) return;
    
    const data: any[] = [];
    const numSteps = simulations[0].length - 1;
    const numPaths = simulations.length;
    
    for (let step = 0; step <= numSteps; step++) {
      const timePoint = (step / numSteps) * timeHorizon;
      const dataPoint: any = {
        time: parseFloat(timePoint.toFixed(2)),
      };
      
      // Add data for all paths
      for (let path = 0; path < numPaths; path++) {
        // Only include a subset of paths to avoid overloading the chart
        if (path < 15 || path === activePathIndex) {
          dataPoint[`path${path}`] = simulations[path][step];
        }
      }
      
      // Add mean and min/max
      const stepValues = simulations.map(path => path[step]);
      dataPoint.mean = stepValues.reduce((sum, val) => sum + val, 0) / numPaths;
      dataPoint.min = Math.min(...stepValues);
      dataPoint.max = Math.max(...stepValues);
      
      data.push(dataPoint);
    }
    
    setLineChartData(data);
    
    // Prepare histogram data
    const terminalValues = simulations.map(path => path[numSteps]);
    const min = Math.min(...terminalValues);
    const max = Math.max(...terminalValues);
    const range = max - min;
    const numBins = 20;
    const binWidth = range / numBins;
    
    const bins: HistogramBin[] = Array(numBins).fill(0).map((_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      count: 0,
      binCenter: min + (i + 0.5) * binWidth,
      percentage: 0 // Initialize with 0
    }));
    
    terminalValues.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - min) / binWidth),
        numBins - 1
      );
      bins[binIndex].count++;
    });
    
    // Convert to percentage
    bins.forEach(bin => {
      bin.percentage = (bin.count / terminalValues.length) * 100;
    });
    
    setHistogramData(bins);
  }, [simulations, timeHorizon, activePathIndex]);
  
  // Custom tooltip for the histogram
  const CustomHistogramTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const bin = payload[0].payload as HistogramBin;
      return (
        <div className="glass-card p-2 text-sm">
          <p>{`Range: $${bin.binStart.toFixed(2)} - $${bin.binEnd.toFixed(2)}`}</p>
          <p className="font-bold text-primary">{`Frequency: ${bin.percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 bg-background/95 backdrop-blur-lg overflow-auto p-6 rounded-xl' : ''}`}>
      <Card className={`glass-card border-primary/20 ${isExpanded ? 'h-full' : ''}`}>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-white">Portfolio Simulation</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="glass-input">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onRefresh} className="glass-input" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={onExport} className="glass-input">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className={`pt-0 ${isExpanded ? 'grid md:grid-cols-2 gap-6 h-[calc(100%-70px)]' : ''}`}>
          <div className={`space-y-4 ${isExpanded ? 'h-full flex flex-col' : ''}`}>
            <h3 className="text-sm font-medium text-muted-foreground">Price Paths Evolution</h3>
            
            <div className={`w-full ${isExpanded ? 'flex-grow' : 'h-[300px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={lineChartData}
                  margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    label={isMobile ? {} : { value: 'Years', position: 'insideBottomRight', offset: -5 }}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickMargin={isMobile ? 2 : 5}
                  />
                  <YAxis 
                    label={isMobile ? {} : { value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickMargin={isMobile ? 2 : 5}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="glass-card p-2 text-sm">
                          <p className="font-bold">{`Time: ${label} years`}</p>
                          <p className="text-primary">{`Mean: $${dataPoint.mean.toFixed(2)}`}</p>
                          <p>{`Min: $${dataPoint.min.toFixed(2)}`}</p>
                          <p>{`Max: $${dataPoint.max.toFixed(2)}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="max" 
                    stroke="rgba(0,0,0,0)" 
                    fill="rgba(124, 58, 237, 0.1)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="min" 
                    stroke="rgba(0,0,0,0)" 
                    fill="rgba(124, 58, 237, 0.05)"
                    activeDot={false}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="mean" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  
                  {/* Render a subset of paths */}
                  {lineChartData.length > 0 && Object.keys(lineChartData[0])
                    .filter(key => key.startsWith("path") && key !== `path${activePathIndex}`)
                    .map((path, i) => (
                      <Line
                        key={path}
                        type="monotone"
                        dataKey={path}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={1}
                        dot={false}
                        activeDot={false}
                        onMouseEnter={() => setActivePathIndex(parseInt(path.replace('path', '')))}
                        onMouseLeave={() => setActivePathIndex(null)}
                      />
                    ))
                  }
                  
                  {/* Highlight active path */}
                  {activePathIndex !== null && (
                    <Line
                      type="monotone"
                      dataKey={`path${activePathIndex}`}
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={`mt-8 space-y-4 ${isExpanded ? 'h-full flex flex-col mt-0' : ''}`}>
            <h3 className="text-sm font-medium text-muted-foreground">Terminal Value Distribution</h3>
            
            <div className={`w-full ${isExpanded ? 'flex-grow' : 'h-[300px]'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={histogramData}
                  margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="binCenter" 
                    label={isMobile ? {} : { value: 'Terminal Price ($)', position: 'insideBottomRight', offset: -5 }}
                    stroke="rgba(255,255,255,0.5)"
                    tickFormatter={(value) => value.toFixed(0)}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickMargin={isMobile ? 2 : 5}
                  />
                  <YAxis 
                    label={isMobile ? {} : { value: 'Frequency (%)', angle: -90, position: 'insideLeft' }}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickMargin={isMobile ? 2 : 5}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip content={CustomHistogramTooltip} />
                  <Bar 
                    dataKey="percentage" 
                    fill="hsl(var(--primary))" 
                    opacity={0.8}
                    minPointSize={2}
                    barSize={isMobile ? 8 : 15}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {statistics && (
              <div className={`mt-4 ${isExpanded ? 'bg-background/50 p-4 rounded-lg' : ''}`}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    title="Expected Return" 
                    value={`${(statistics.meanReturn * 100).toFixed(2)}%`}
                    isPositive={statistics.meanReturn > 0}
                  />
                  <StatCard 
                    title="Sharpe Ratio" 
                    value={statistics.sharpeRatio.toFixed(2)}
                    isPositive={statistics.sharpeRatio > 1}
                  />
                  <StatCard 
                    title="Max Drawdown" 
                    value={`${(statistics.maxDrawdown * 100).toFixed(2)}%`}
                    isPositive={false}
                    inverse={true}
                  />
                  <StatCard 
                    title="Value at Risk (95%)" 
                    value={`${(statistics.valueAtRisk * 100).toFixed(2)}%`}
                    isPositive={false}
                    inverse={true}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  isPositive: boolean;
  inverse?: boolean;
}

function StatCard({ title, value, isPositive, inverse = false }: StatCardProps) {
  const color = inverse 
    ? (!isPositive ? "text-green-400" : "text-red-400")
    : (isPositive ? "text-green-400" : "text-red-400");
    
  return (
    <div className="glass-card border-primary/10 p-3 rounded-lg">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}
