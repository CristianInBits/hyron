import type { ShoeType } from "../../../types/shoe";

export type FormState = {
    brand: string;
    model: string;
    nickname: string;
    imageUrl: string;
    colorway: string;
    notes: string;
    type: ShoeType;
    favorite: boolean;
    active: boolean;
    purchaseDate: string;
    initialDistanceKm: string;
    maxDistanceKm: string;
}

// Props que recibirán todos los hijos
export interface FormSectionProps {
    formData: FormState;
    updateField: (field: keyof FormState, value: any) => void;
    shoeExists?: boolean; // Para saber si es edición
}

// Estilos compartidos para coherencia visual
export const FORM_STYLES = {
    input: "w-full px-3 py-2 bg-page border border-border rounded-lg text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all",
    label: "block text-xs font-bold text-muted uppercase tracking-wider mb-1.5",
    iconContainer: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
};