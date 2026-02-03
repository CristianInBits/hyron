// src/components/shoes/form/ExtrasSection.tsx
import { FORM_STYLES, type FormSectionProps } from './form-types';

export function ExtrasSection({ formData, updateField, shoeExists }: FormSectionProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <label htmlFor="notes" className={FORM_STYLES.label}>Notas Personales</label>
                <textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="¿Qué tal se sienten? ¿Para qué entrenos las usas?"
                    className={`${FORM_STYLES.input} resize-none`}
                />
            </div>

            {shoeExists && (
                <div className="flex items-center gap-3 pt-2">
                    <input
                        id="active"
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => updateField('active', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-brand focus:ring-brand"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-main">
                        Zapatilla Activa (En rotación)
                    </label>
                </div>
            )}
        </div>
    );
}