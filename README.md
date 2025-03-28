# Stochastic Portfolio Simulator (Advanced Version)

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

Welcome to the **Stochastic Portfolio Simulator** – an interactive Streamlit web application that simulates asset price evolution using advanced stochastic models. Explore dynamic simulations, analyze risk metrics, and export your data with ease!

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Models](#models)
- [Live Demo](#live-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Features](#advanced-features)


---

## Overview

This project simulates asset price trajectories using three popular stochastic models in quantitative finance:

- **Geometric Brownian Motion (GBM)**
- **Jump-Diffusion**
- **Heston Model**

Utilizing **stochastic calculus**, **Monte Carlo methods**, and key portfolio risk metrics, the app visualizes simulated price paths, terminal value distributions, and detailed statistics such as **Sharpe Ratio**, **Max Drawdown**, and **Value at Risk (VaR)**.

---

## Features

- **Interactive Simulation:** Adjust parameters and switch between different stochastic models.
- **Real-time Visualizations:** Dynamic, interactive plots of simulated price paths and distributions.
- **Comprehensive Risk Metrics:** View expected returns, standard deviation, Sharpe Ratio, Max Drawdown, and VaR.
- **Data Export:** Easily download your simulation data as a CSV file.
- **Responsive Design:** Built with Streamlit for a clean and user-friendly interface.

---

## Models

| **Model**       | **Description**                                                                                                                                          |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **GBM**         | The classic model for asset prices, featuring a log-normal distribution and constant volatility.                                                       |
| **Jump-Diffusion**  | Enhances GBM by incorporating rare, significant jumps to better simulate market shocks.                                                                  |
| **Heston**      | Introduces stochastic volatility, providing a closer representation of real market behavior.                                                              |

---

## Live Demo

Experience the cutting-edge **Stochastic Portfolio Simulator** in action! Hosted on [**Netlify**](https://your-netlify-link.netlify.app), our live demo brings advanced stochastic models and interactive risk analytics right to your browser.

> Dive into dynamic simulations, explore real-time visualizations, and unlock insightful portfolio analytics with just one click!

[**Launch the Demo Now!**](https://your-netlify-link.netlify.app)


---

## Installation

To run the project locally, ensure you have **Python 3.8+** installed, then follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/jeevanba273/stochastic-portfolio-simulator.git
   cd stochastic-portfolio-simulator

2. **Create and Activate a Virtual Environment:**
    ```bash
    python -m venv venv 
    source venv/bin/activate  # On Windows use: venv\Scripts\activate

3. **Install the Dependencies:**
    ```bash
    pip install -r requirements.txt

---

## Usage

1. **Launch the simulator with the following command:**
    ```bash
    streamlit run app.py

Once the server starts, open your browser to the provided local URL and explore the simulations!

---

## Advanced Features

- **📊 Sharpe Ratio Calculation:**  
  *Measure risk-adjusted returns by calculating the Sharpe Ratio based on daily returns.*

- **📉 Max Drawdown Analysis:**  
  *Evaluate the worst peak-to-trough decline to understand downside risk.*

- **📥 CSV Export:**  
  *Download detailed simulation data for offline analysis in CSV format.*

- **📈 Interactive Statistics:**  
  *Access an in-depth view of key simulation metrics with dynamic, interactive displays.*

- **🚀 Upcoming Enhancements:**  
  *Stay tuned for correlation matrices and multi-asset simulations, adding even more depth to your analysis!*
