export type UserRole = "" | "pastor" | "siervo";
export type ShirtSize = "" | "CH" | "M" | "G" | "XG" | "2XG";
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
};