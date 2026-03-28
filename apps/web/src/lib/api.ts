export type Service = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
};

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type Booking = {
  id: string;
  serviceId: string;
  service: Service;
  scheduledAt: string;
  address: string;
  totalAmount: number;
  status: BookingStatus;
  providerId?: string;
};
