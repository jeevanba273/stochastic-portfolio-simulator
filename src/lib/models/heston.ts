
// Heston model with stochastic volatility
// dS = μS dt + √v S dW₁
// dv = κ(θ - v) dt + ξ√v dW₂
// where dW₁ and dW₂ have correlation ρ

export const simulateHeston = (
  S0: number,
  mu: number,
  T: number,
  N: number,
  paths: number,
  kappa: number,   // Mean reversion speed
  theta: number,   // Long-run variance
  xi: number,      // Volatility of volatility
  rho: number,     // Correlation between processes
  v0: number       // Initial variance
): number[][] => {
  const dt = T / N;
  const sqrtDt = Math.sqrt(dt);
  
  // Initialize arrays for storing paths
  const simulations: number[][] = Array(paths)
    .fill(0)
    .map(() => Array(N + 1).fill(0));
  
  const variances: number[][] = Array(paths)
    .fill(0)
    .map(() => Array(N + 1).fill(0));
  
  // Set initial values for each path
  for (let i = 0; i < paths; i++) {
    simulations[i][0] = S0;
    variances[i][0] = v0;
  }
  
  // Simulate paths
  for (let i = 0; i < paths; i++) {
    for (let j = 1; j <= N; j++) {
      // Generate correlated random normal variables
      const z1 = normalRandom();
      const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * normalRandom();
      
      // Previous values
      const S_prev = simulations[i][j - 1];
      const v_prev = Math.max(0, variances[i][j - 1]); // Ensure non-negative
      
      // Update variance (with truncation to prevent negative values)
      const vDrift = kappa * (theta - v_prev) * dt;
      const vDiffusion = xi * Math.sqrt(v_prev) * sqrtDt * z2;
      variances[i][j] = Math.max(0, v_prev + vDrift + vDiffusion);
      
      // Update price
      const drift = mu * dt;
      const diffusion = Math.sqrt(v_prev) * sqrtDt * z1;
      simulations[i][j] = S_prev * Math.exp(drift + diffusion);
    }
  }
  
  return simulations;
};

// Standard normal random variable generator (Box-Muller transform)
function normalRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
