"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, CreditCard, Clock, History, Calendar, CheckCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/auth-context";

// Mock Data
const ACTIVE_BOOKINGS = [
  { id: "B-101", service: "Deep House Cleaning", provider: "Priya S.", date: "Today, 2:00 PM", price: "₹1,500", status: "Upcoming" }
];

const PAST_BOOKINGS = [
  { id: "B-082", service: "Plumbing Repair", provider: "Rahul M.", date: "Aug 18, 2026", price: "₹800", status: "Completed" },
  { id: "B-045", service: "AC Service", provider: "Amit K.", date: "Jul 22, 2026", price: "₹1,200", status: "Completed" },
];

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!
          </h1>
          <p className="text-muted-foreground mt-1">Manage your bookings and account details here.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border/60">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 font-medium transition-colors relative ${activeTab === "bookings" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            My Bookings
            {activeTab === "bookings" && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`pb-3 font-medium transition-colors relative ${activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Account Details
            {activeTab === "profile" && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content: Bookings */}
        {activeTab === "bookings" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Active Bookings */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Active Bookings
              </h2>
              {ACTIVE_BOOKINGS.length > 0 ? (
                <div className="grid gap-4">
                  {ACTIVE_BOOKINGS.map(booking => (
                    <div key={booking.id} className="bg-card border-2 border-primary/20 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-md">
                            {booking.status}
                          </span>
                          <span className="text-sm text-muted-foreground">ID: {booking.id}</span>
                        </div>
                        <h3 className="font-bold text-lg">{booking.service}</h3>
                        <p className="text-muted-foreground">with {booking.provider}</p>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-1">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Clock className="w-4 h-4 text-primary" />
                          {booking.date}
                        </div>
                        <p className="text-lg font-bold text-emerald-500">{booking.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 border border-border/60 rounded-2xl p-8 text-center">
                  <p className="text-muted-foreground">No active bookings right now.</p>
                </div>
              )}
            </section>

            {/* Past Bookings */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" /> Past Bookings
              </h2>
              <div className="grid gap-4">
                {PAST_BOOKINGS.map(booking => (
                  <div key={booking.id} className="bg-card border border-border/60 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-bold text-foreground">{booking.service}</h3>
                      <p className="text-sm text-muted-foreground">{booking.date} • with {booking.provider}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{booking.price}</p>
                      <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                        View Receipt <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* Tab Content: Profile Details */}
        {activeTab === "profile" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Personal Info */}
            <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name || "Customer User"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <input type="text" defaultValue={user?.name || ""} className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <button className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Saved Addresses */}
              <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" /> Saved Addresses
                </h3>
                <div className="space-y-3">
                  <div className="border border-border/60 rounded-xl p-3 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded text-foreground mb-1 inline-block">HOME</span>
                      <p className="text-sm text-muted-foreground">123, 4th Cross, Indiranagar<br/>Bengaluru, Karnataka 560038</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">
                    + Add New Address
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" /> Payment Methods
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border border-border/60 rounded-xl p-3">
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs font-bold">VISA</div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/28</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">
                    + Add Payment Method
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => logout()}
                className="w-full border border-destructive/20 text-destructive font-semibold py-2.5 rounded-lg hover:bg-destructive/10 transition"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
