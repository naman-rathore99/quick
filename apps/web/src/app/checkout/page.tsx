"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});
const timeSlots = [
  "8:00 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
];
export default function CheckoutPage() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
const [selectedTime, setSelectedTime] = useState("");
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
        
        {/* LEFT FORM */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Checkout</h1>

          {/* User Info */}
          <div className="space-y-4">
            <input
              placeholder="Full Name"
              className="w-full p-3 rounded-lg border"
            />
            <input
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg border"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <textarea
              placeholder="Enter your address"
              className="w-full p-3 rounded-lg border"
            />
            <input
              placeholder="Landmark / Notes"
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <div className="space-y-4">
  <h2 className="text-lg font-semibold">Select Date & Time</h2>

  {/* Date */}
  <input
    type="date"
    className="w-full p-3 rounded-lg border"
    value={selectedDate}
    min={new Date().toISOString().split("T")[0]}
    onChange={(e) => setSelectedDate(e.target.value)}
  />

  {/* Time Slots */}
  <div className="grid grid-cols-3 gap-2">
    {timeSlots.map((slot) => (
      <button
        key={slot}
        type="button"
        onClick={() => setSelectedTime(slot)}
        className={`p-2 rounded-lg border text-sm transition ${
          selectedTime === slot
            ? "bg-primary text-white border-primary"
            : "hover:border-primary"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
</div>

          {/* Map */}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Select your location on map
            </p>

            <MapPicker
              onLocationSelect={(lat, lng) =>
                setLocation({ lat, lng })
              }
            />
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="rounded-2xl border p-6 space-y-4 h-fit">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="flex justify-between">
            <span>Home Cleaning</span>
            <span>₹499</span>
          </div>

          <div className="flex justify-between">
          <span>
  {selectedDate && selectedTime
    ? `${selectedDate}, ${selectedTime}`
    : "Select date & time"}
</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹499</span>
          </div>

          <Button
  className="w-full mt-4"
  disabled={!selectedDate || !selectedTime}
>
  Pay & Book
</Button>
          {/* Debug */}
          {location && (
            <p className="text-xs text-muted-foreground">
              Lat: {location.lat}, Lng: {location.lng}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}