"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Briefcase, Star, Clock, CheckCircle, XCircle, Plus, AlertCircle, TrendingUp } from "lucide-react";
import { useAuth } from "../../../../context/auth-context";

// Mock Data
const STATS = [
  { label: "Net Earnings", value: "₹2,150", subtext: "After ₹300 platform fees", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Completed Jobs", value: "14", subtext: "This month", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Rating", value: "4.8", subtext: "Based on 12 reviews", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

const NEW_REQUESTS = [
  { id: "3", customer: "Neha K.", service: "Deep Cleaning", time: "Today, 5:00 PM", location: "HSR Layout, BLR", price: "₹1,500" },
];

// Mocking the partner's service list
const MY_SERVICES = [
  { id: "s1", name: "House Cleaning (2BHK)", price: "₹800", status: "approved" },
  { id: "s2", name: "Plumbing Repair (Basic)", price: "₹500", status: "approved" },
  { id: "s3", name: "Premium AC Chemical Wash", price: "₹2,000", status: "pending" }, // Custom service under review
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

        {/* Stats Grid - Includes Gain amount and charges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm flex items-start gap-4 relative overflow-hidden"
            >
              <div className={`p-4 rounded-xl ${stat.bg} shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content: New Requests & Services */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* New Job Requests */}
            <section className="space-y-4">
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{req.service}</h3>
                        <p className="text-muted-foreground">{req.customer} • {req.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-500">{req.price}</p>
                        <p className="text-xs text-muted-foreground font-medium">-15% Platform fee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/80 mb-6 bg-muted p-2 rounded-lg w-fit">
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
            </section>

            {/* My Offered Services */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Services I Provide</h2>
                <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
              
              <div className="bg-card border border-border/60 rounded-2xl shadow-sm divide-y divide-border/60 overflow-hidden">
                {MY_SERVICES.map(service => (
                  <div key={service.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      {service.status === 'pending' ? (
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                      
                      <div className="group relative">
                        <p className={`font-medium ${service.status === 'pending' ? 'line-through text-red-500/70 decoration-red-500/50' : 'text-foreground'}`}>
                          {service.name}
                        </p>
                        
                        {/* Hover hint for pending services */}
                        {service.status === 'pending' && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-foreground text-background text-xs rounded shadow-lg z-10">
                            This custom service is under review by admins. It is not visible to customers yet.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{service.price}</span>
                      {service.status === 'pending' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-1 rounded">
                          <AlertCircle className="w-3 h-3" /> Under Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 px-2">
                * Note: Custom services you add manually must be approved by an admin before they appear to customers.
              </p>
            </section>
          </div>

          {/* Sidebar: Earnings Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Earnings Breakdown</h2>
            
            <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border/60">
                <span className="text-muted-foreground">Total Gross (This month)</span>
                <span className="font-medium">₹2,450</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border/60">
                <span className="text-muted-foreground">Platform Charges (-15%)</span>
                <span className="font-medium text-destructive">-₹300</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-foreground">Total Net Gain</span>
                <span className="font-bold text-xl text-emerald-500">₹2,150</span>
              </div>
              
              <button className="w-full mt-4 flex items-center justify-center gap-2 bg-muted text-foreground font-semibold py-2.5 rounded-xl hover:bg-muted/80 transition">
                Withdraw Funds
              </button>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                You are earning 24% more this month compared to last month. Keep it up!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
