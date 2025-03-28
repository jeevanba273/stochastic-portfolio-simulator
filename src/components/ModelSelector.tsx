
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { ArrowUpRight, BarChart, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ModelType = "gbm" | "jumpDiffusion" | "heston";

interface ModelInfo {
  id: ModelType;
  name: string;
  description: string;
  icon: React.ReactNode;
  strengths: string[];
}

interface ModelSelectorProps {
  selectedModel: ModelType;
  onChange: (model: ModelType) => void;
}

const models: ModelInfo[] = [
  {
    id: "gbm",
    name: "Geometric Brownian Motion",
    description: "The classic model for asset prices with log-normal distribution and constant volatility.",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    strengths: ["Simple & well-studied", "Captures market uptrends", "Foundation for option pricing"]
  },
  {
    id: "jumpDiffusion",
    name: "Jump Diffusion (Merton)",
    description: "Adds rare, large jumps (shocks) to prices for more realistic market simulations.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    strengths: ["Models market crashes", "Handles fat tails", "Captures unexpected events"]
  },
  {
    id: "heston",
    name: "Heston Model",
    description: "Introduces stochastic volatility for closer approximation to real market behavior.",
    icon: <BarChart className="h-6 w-6 text-primary" />,
    strengths: ["Captures volatility clustering", "Realistic smile/skew", "Mean-reverting volatility"]
  }
];

export function ModelSelector({ selectedModel, onChange }: ModelSelectorProps) {
  return (
    <Tabs defaultValue={selectedModel} onValueChange={(value) => onChange(value as ModelType)} className="w-full">
      <TabsList className="grid grid-cols-3 h-auto mb-6">
        {models.map(model => (
          <TabsTrigger
            key={model.id}
            value={model.id}
            className={cn(
              "py-3 font-medium",
              selectedModel === model.id ? "bg-muted/30" : "bg-background/50"
            )}
          >
            <span className="flex items-center gap-2">
              {model.icon}
              <span className="hidden md:inline">{model.name.split(' ')[0]}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {models.map(model => (
        <TabsContent key={model.id} value={model.id} className="animate-fade-in">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {model.name}
                <span className="text-primary">
                  {model.icon}
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Key Strengths</h4>
              <ul className="grid gap-1">
                {model.strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
