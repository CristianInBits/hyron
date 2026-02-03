// src/components/shoes/form/DetailsSection.tsx
import { Calendar, Palette, Tag } from 'lucide-react';
import { FORM_STYLES, type FormSectionProps } from './form-types';

export function DetailsSection({ formData, updateField }: FormSectionProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fecha */}
            <div className="space-y-1.5">
                <label htmlFor="purchaseDate" className={FORM_STYLES.label}>Fecha de Compra</label>
                <div className="relative">
                    <div className={FORM_STYLES.iconContainer}>
                        <Calendar className="h-4 w-4 text-muted" />
                    </div>
                    <input
                        id="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => updateField('purchaseDate', e.target.value)}
                        className={`${FORM_STYLES.input} pl-10`}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {/* Color */}
            <div className="space-y-1.5">
                <label htmlFor="colorway" className={FORM_STYLES.label}>Color / Edición</label>
                <div className="relative">
                    <div className={FORM_STYLES.iconContainer}>
                        <Palette className="h-4 w-4 text-muted" />
                    </div>
                    <input
                        id="colorway"
                        type="text"
                        value={formData.colorway}
                        onChange={(e) => updateField('colorway', e.target.value)}
                        placeholder="Ej. Black/Gold..."
                        className={`${FORM_STYLES.input} pl-10`}
                    />
                </div>
            </div>

            {/* Apodo */}
            <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="nickname" className={FORM_STYLES.label}>Apodo</label>
                <div className="relative">
                    <div className={FORM_STYLES.iconContainer}>
                        <Tag className="h-4 w-4 text-muted" />
                    </div>
                    <input
                        id="nickname"
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => updateField('nickname', e.target.value)}
                        placeholder="Ej. Las Voladoras..."
                        className={`${FORM_STYLES.input} pl-10`}
                    />
                </div>
            </div>
        </div>
    );
}