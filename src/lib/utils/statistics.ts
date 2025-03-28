
export interface StatisticsSummary {
  initialValue: number;
  meanTerminalValue: number;
  standardDeviation: number;
  minValue: number;
  maxValue: number;
  meanReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  valueAtRisk: number;
}

export const calculateStatistics = (
  simulations: number[][],
  riskFreeRate: number = 0.02  // Default risk-free rate for Sharpe Ratio
): StatisticsSummary => {
  const numPaths = simulations.length;
  const numSteps = simulations[0].length - 1;
  
  // Extract initial and terminal values
  const initialValues = simulations.map(path => path[0]);
  const terminalValues = simulations.map(path => path[numSteps]);
  
  // Calculate returns
  const returns = initialValues.map((initial, i) => 
    (terminalValues[i] - initial) / initial
  );
  
  // Calculate daily returns for each path
  const dailyReturns: number[][] = [];
  for (let i = 0; i < numPaths; i++) {
    const pathReturns = [];
    for (let j = 1; j <= numSteps; j++) {
      pathReturns.push((simulations[i][j] - simulations[i][j-1]) / simulations[i][j-1]);
    }
    dailyReturns.push(pathReturns);
  }
  
  // Calculate average daily returns across all paths
  const avgDailyReturns = dailyReturns.reduce((acc, path) => {
    path.forEach((ret, idx) => {
      if (!acc[idx]) acc[idx] = 0;
      acc[idx] += ret / numPaths;
    });
    return acc;
  }, [] as number[]);
  
  // Calculate daily return volatility
  const dailyVolatility = Math.sqrt(
    avgDailyReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / avgDailyReturns.length
  );
  
  // Calculate Sharpe Ratio (annualized)
  const annualFactor = 252; // Trading days in a year
  const annualizedReturn = avgDailyReturns.reduce((sum, ret) => sum + ret, 0) * annualFactor;
  const annualizedVolatility = dailyVolatility * Math.sqrt(annualFactor);
  const sharpeRatio = (annualizedReturn - riskFreeRate) / annualizedVolatility;
  
  // Calculate maximum drawdowns for each path
  const drawdowns = simulations.map(path => {
    let maxDrawdown = 0;
    let peakValue = path[0];
    
    for (let j = 1; j <= numSteps; j++) {
      peakValue = Math.max(peakValue, path[j]);
      const currentDrawdown = (peakValue - path[j]) / peakValue;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
    }
    
    return maxDrawdown;
  });
  
  // Calculate VaR (Value at Risk) at 5% level
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const varIndex = Math.floor(numPaths * 0.05);
  const valueAtRisk = Math.abs(sortedReturns[varIndex]);
  
  return {
    initialValue: initialValues[0],
    meanTerminalValue: mean(terminalValues),
    standardDeviation: standardDeviation(terminalValues),
    minValue: Math.min(...terminalValues),
    maxValue: Math.max(...terminalValues),
    meanReturn: mean(returns),
    sharpeRatio: sharpeRatio,
    maxDrawdown: mean(drawdowns),
    valueAtRisk: valueAtRisk
  };
};

// Helper functions
function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}
