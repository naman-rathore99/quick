"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Briefcase, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../../context/auth-context";

// Mock data to make the dashboard look complete quickly
const STATS = [
  { label: "Today's Earnings", value: "₹2,450", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Completed Jobs", value: "14", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Rating", value: "4.8", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Hours Online", value: "6.5", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const UPCOMING_JOBS = [
  { id: "1", customer: "Priya S.", service: "House Cleaning", time: "Today, 2:00 PM", location: "Koramangala, BLR", price: "₹800", status: "confirmed" },
  { id: "2", customer: "Rahul M.", service: "Plumbing Repair", time: "Tomorrow, 10:00 AM", location: "Indiranagar, BLR", price: "₹1,200", status: "confirmed" },
];

const NEW_REQUESTS = [
  { id: "3", customer: "Neha K.", service: "Deep Cleaning", time: "Today, 5:00 PM", location: "HSR Layout, BLR", price: "₹1,500" },
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Hello, {user?.name?.split(' ')[0] || 'Partner'}!
            </h1>
            <p className="text-muted-foreground mt-1">Here is what's happening with your business today.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-card border border-border/60 p-2 pl-4 rounded-full shadow-sm w-fit">
            <span className="text-sm font-medium">Status: {isOnline ? 'Online' : 'Offline'}</span>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOnline ? 'bg-emerald-500' : 'bg-muted-foreground'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm flex items-center gap-4"
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content: New Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">New Job Requests</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">1 New</span>
            </div>
            
            <div className="space-y-4">
              {NEW_REQUESTS.map(req => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={req.id} 
                  className="bg-card border-2 border-primary/20 p-6 rounded-2xl shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    HOT
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{req.service}</h3>
                      <p className="text-muted-foreground">{req.customer} • {req.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-500">{req.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80 mb-6 bg-muted p-2 rounded-lg inline-flex">
                    <Clock className="w-4 h-4 text-primary" />
                    {req.time}
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2 shadow-sm">
                      <CheckCircle className="w-5 h-5" /> Accept Job
                    </button>
                    <button className="px-6 bg-destructive/10 text-destructive font-semibold py-2.5 rounded-xl hover:bg-destructive/20 transition flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" /> Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar: Upcoming Jobs */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Upcoming Schedule</h2>
            
            <div className="space-y-4">
              {UPCOMING_JOBS.map(job => (
                <div key={job.id} className="bg-card border border-border/60 p-5 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{job.service}</h4>
                    <span className="text-emerald-500 font-semibold">{job.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.customer}</p>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{job.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium hover:underline cursor-pointer">
                      View details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
