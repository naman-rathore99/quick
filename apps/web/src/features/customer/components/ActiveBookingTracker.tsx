"use client";

import { CheckCircle2, Circle, Clock, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingStatus = "pending" | "accepted" | "en_route" | "in_progress" | "completed" | "cancelled";

interface ActiveBookingTrackerProps {
  status: BookingStatus;
  estimatedWindow: string; // e.g., "15-20 mins"
  providerName?: string;
  serviceName: string;
}

export function ActiveBookingTracker({ status, estimatedWindow, providerName, serviceName }: ActiveBookingTrackerProps) {
  
  // Define the stages
  const stages = [
    { id: "pending", label: "Searching for Didi" },
    { id: "accepted", label: "Didi Assigned" },
    { id: "en_route", label: "On the Way" },
    { id: "in_progress", label: "Service in Progress" },
    { id: "completed", label: "Completed" },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === status);

  return (
    <div className="bg-card rounded-3xl border border-border/40 overflow-hidden shadow-sm">
      
      {/* Header Info */}
      <div className="p-6 md:p-8 border-b border-border/40 bg-muted/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-3">
              Active Booking
            </span>
            <h3 className="text-2xl font-extrabold text-foreground">{serviceName}</h3>
            
            <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-500/10 px-4 py-2 rounded-xl w-fit">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Estimated Arrival: {estimatedWindow}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm">
              * Note: Arrival times are estimates. Your Didi may be wrapping up a previous booking or navigating traffic.
            </p>
          </div>
          
          {providerName && status !== "pending" && (
            <div className="bg-card border border-border/40 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{providerName.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Professional</p>
                <p className="font-bold text-foreground">{providerName}</p>
              </div>
              <button className="h-10 w-10 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center ml-2 hover:bg-green-500/20 transition-colors">
                <Phone className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Pipeline */}
      <div className="p-6 md:p-8">
        <h4 className="font-bold text-foreground mb-6">Live Status</h4>
        
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border/40 z-0" />
          
          <div className="space-y-6 relative z-10">
            {stages.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isFuture = index > currentStageIndex;

              return (
                <div key={stage.id} className="flex items-start gap-4">
                  <div className={cn(
                    "mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-4 border-card transition-colors duration-300",
                    isCompleted ? "bg-primary text-primary-foreground" : 
                    isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : 
                    "bg-muted border-border/40 text-muted-foreground"
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-2 w-2 fill-current" />}
                  </div>
                  
                  <div className={cn(
                    "pt-1",
                    isCurrent ? "text-foreground font-bold" : 
                    isCompleted ? "text-foreground font-medium" : 
                    "text-muted-foreground font-medium"
                  )}>
                    <p>{stage.label}</p>
                    {isCurrent && stage.id === "en_route" && (
                      <p className="text-sm text-primary flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="h-3 w-3" /> Didi is on the way to your location
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
