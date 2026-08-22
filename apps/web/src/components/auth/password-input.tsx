"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showStrength?: boolean;
}

export function PasswordInput({ id, value, onChange, placeholder = "••••••••", showStrength = false }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) return score;
    if (password.length > 7) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 5
  };

  const score = calculateStrength(value);

  const getStrengthLabel = () => {
    if (value.length === 0) return "";
    if (score <= 2) return "Weak";
    if (score === 3) return "Fair";
    if (score === 4) return "Good";
    return "Strong";
  };

  const getStrengthColor = (index: number) => {
    if (value.length === 0) return "bg-border/60";
    if (score <= 2) return index < 2 ? "bg-red-500" : "bg-border/60";
    if (score === 3) return index < 3 ? "bg-yellow-500" : "bg-border/60";
    if (score === 4) return index < 4 ? "bg-blue-500" : "bg-border/60";
    return "bg-green-500";
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          className="block w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex gap-1.5 h-1.5">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-colors duration-300 ${getStrengthColor(index)}`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Password strength</span>
            <span className={`font-medium ${score <= 2 ? "text-red-500" : score === 3 ? "text-yellow-500" : score === 4 ? "text-blue-500" : "text-green-500"}`}>
              {getStrengthLabel()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
