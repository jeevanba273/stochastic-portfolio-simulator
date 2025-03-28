
// Geometric Brownian Motion model
// dS = μS dt + σS dW

export const simulateGBM = (
  S0: number,
  mu: number,
  sigma: number,
  T: number,
  N: number,
  paths: number
): number[][] => {
  const dt = T / N;
  const sqrtDt = Math.sqrt(dt);
  
  // Initialize array for storing paths
  const simulations: number[][] = Array(paths)
    .fill(0)
    .map(() => Array(N + 1).fill(0));
  
  // Set initial price for each path
  for (let i = 0; i < paths; i++) {
    simulations[i][0] = S0;
  }
  
  // Simulate paths
  for (let i = 0; i < paths; i++) {
    for (let j = 1; j <= N; j++) {
      // Generate random standard normal variable
      const z = normalRandom();
      
      // Calculate price movement
      const drift = (mu - 0.5 * sigma * sigma) * dt;
      const diffusion = sigma * sqrtDt * z;
      const S_prev = simulations[i][j - 1];
      
      // Update price
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
