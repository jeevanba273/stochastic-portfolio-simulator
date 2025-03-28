
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export type ModelParameters = {
  initialPrice: number;
  drift: number;
  volatility: number;
  timeHorizon: number;
  steps: number;
  paths: number;
  jumpIntensity?: number;
  meanJumpSize?: number;
  jumpVolatility?: number;
  kappa?: number;
  theta?: number;
  xi?: number;
  rho?: number;
  v0?: number;
};

interface ParameterControlsProps {
  modelType: "gbm" | "jumpDiffusion" | "heston";
  parameters: ModelParameters;
  onChange: (params: ModelParameters) => void;
}

export function ParameterControls({ 
  modelType, 
  parameters, 
  onChange 
}: ParameterControlsProps) {
  const updateParam = (key: keyof ModelParameters, value: number) => {
    onChange({ ...parameters, [key]: value });
  };

  const isJumpDiffusion = modelType === "jumpDiffusion";
  const isHeston = modelType === "heston";

  return (
    <div className="space-y-6">
      {/* Core parameters */}
      <div className="grid gap-4 md:grid-cols-2">
        <ParameterInput
          label="Initial Price"
          value={parameters.initialPrice}
          onChange={(val) => updateParam("initialPrice", val)}
          min={1}
          max={1000}
          step={1}
        />
        
        <ParameterInput
          label="Time Horizon (Years)"
          value={parameters.timeHorizon}
          onChange={(val) => updateParam("timeHorizon", val)}
          min={0.25}
          max={10}
          step={0.25}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ParameterInput
          label="Drift (μ)"
          value={parameters.drift}
          onChange={(val) => updateParam("drift", val)}
          min={-0.2}
          max={0.5}
          step={0.01}
          displayDecimals={2}
        />
        
        <ParameterInput
          label="Volatility (σ)"
          value={parameters.volatility}
          onChange={(val) => updateParam("volatility", val)}
          min={0.01}
          max={1}
          step={0.01}
          displayDecimals={2}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <ParameterInput
          label="Simulation Steps"
          value={parameters.steps}
          onChange={(val) => updateParam("steps", Math.round(val))}
          min={50}
          max={500}
          step={10}
          displayDecimals={0}
        />
        
        <ParameterInput
          label="Number of Paths"
          value={parameters.paths}
          onChange={(val) => updateParam("paths", Math.round(val))}
          min={10}
          max={1000}
          step={10}
          displayDecimals={0}
        />
      </div>

      {/* Jump Diffusion specific parameters */}
      {isJumpDiffusion && (
        <Card className="glass-card border-primary/20 animate-fade-in">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-primary">Jump Parameters</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <ParameterInput
                label="Jump Intensity (λ)"
                value={parameters.jumpIntensity || 0.5}
                onChange={(val) => updateParam("jumpIntensity", val)}
                min={0.1}
                max={5}
                step={0.1}
                displayDecimals={1}
              />
              
              <ParameterInput
                label="Mean Jump Size"
                value={parameters.meanJumpSize || 0}
                onChange={(val) => updateParam("meanJumpSize", val)}
                min={-0.5}
                max={0.5}
                step={0.01}
                displayDecimals={2}
              />
              
              <ParameterInput
                label="Jump Volatility"
                value={parameters.jumpVolatility || 0.1}
                onChange={(val) => updateParam("jumpVolatility", val)}
                min={0.01}
                max={0.5}
                step={0.01}
                displayDecimals={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heston model specific parameters */}
      {isHeston && (
        <Card className="glass-card border-primary/20 animate-fade-in">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-primary">Volatility Parameters</h3>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <ParameterInput
                label="Mean Reversion (κ)"
                value={parameters.kappa || 2}
                onChange={(val) => updateParam("kappa", val)}
                min={0.1}
                max={10}
                step={0.1}
                displayDecimals={1}
              />
              
              <ParameterInput
                label="Long-run Variance (θ)"
                value={parameters.theta || 0.04}
                onChange={(val) => updateParam("theta", val)}
                min={0.01}
                max={0.5}
                step={0.01}
                displayDecimals={2}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <ParameterInput
                label="Vol of Vol (ξ)"
                value={parameters.xi || 0.3}
                onChange={(val) => updateParam("xi", val)}
                min={0.01}
                max={1}
                step={0.01}
                displayDecimals={2}
              />
              
              <ParameterInput
                label="Correlation (ρ)"
                value={parameters.rho || -0.7}
                onChange={(val) => updateParam("rho", val)}
                min={-1}
                max={1}
                step={0.05}
                displayDecimals={2}
              />
              
              <ParameterInput
                label="Initial Variance"
                value={parameters.v0 || 0.04}
                onChange={(val) => updateParam("v0", val)}
                min={0.01}
                max={0.5}
                step={0.01}
                displayDecimals={2}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  displayDecimals?: number;
}

function ParameterInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayDecimals = 2
}: ParameterInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toFixed(displayDecimals));
  }, [value, displayDecimals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleSliderChange = (val: number[]) => {
    onChange(val[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={label}>{label}</Label>
        <Input
          id={label}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-20 h-8 glass-input text-center"
        />
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="cursor-pointer"
      />
    </div>
  );
}
