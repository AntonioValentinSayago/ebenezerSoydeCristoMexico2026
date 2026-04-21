export type UserRole = "" | "pastor" | "siervo";
export type ShirtSize = "" | "CH" | "M" | "G" | "XL";
export type PaymentMethod = "" | "stripe" | "mercado-pago" | "conekta" | "transferencia";

export type FormState = {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    churchName: string;
    city: string;
    role: UserRole;
    pastorIdFile: File | null;
    notes: string;
    attendeesCount: number;
    wantsShirt: boolean;
    shirtSize: ShirtSize;
    shirtQuantity: number;
    paymentMethod: PaymentMethod;
    attendeeFile: File | null;
    breakfastAttendance: "si" | "no" | "";
};
/**
 * Types for Shirt
 */

export type ShirtImageItem = {
  url: string;
  publicId?: string;
};

export type Shirt = {
  id: number;
  name: string;
  price: string;
  sizes: { size: string; stock: number }[];
  images: ShirtImageItem[];
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShirtListResponse = {
  success: boolean;
  data: Shirt[];
};