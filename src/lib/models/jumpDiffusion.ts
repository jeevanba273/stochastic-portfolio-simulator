
// Jump Diffusion (Merton) model
// dS = μS dt + σS dW + J dN

export const simulateJumpDiffusion = (
  S0: number,
  mu: number,
  sigma: number,
  T: number,
  N: number,
  paths: number,
  lambda: number,  // Jump intensity
  muJ: number,     // Mean jump size
  sigmaJ: number   // Jump volatility
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
      // Generate random standard normal variables
      const z1 = normalRandom();
      
      // Calculate diffusion component
      const drift = (mu - 0.5 * sigma * sigma) * dt;
      const diffusion = sigma * sqrtDt * z1;
      
      // Calculate jump component
      const jumpCount = poissonRandom(lambda * dt);
      let jumpSize = 0;
      
      // If jumps occur, calculate their impact
      if (jumpCount > 0) {
        for (let k = 0; k < jumpCount; k++) {
          const z2 = normalRandom();
          jumpSize += muJ + sigmaJ * z2; // Individual jump size
        }
      }
      
      const S_prev = simulations[i][j - 1];
      
      // Update price with diffusion and jumps
      simulations[i][j] = S_prev * Math.exp(drift + diffusion + jumpSize);
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

// Poisson random number generator
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  
  return k - 1;
}
