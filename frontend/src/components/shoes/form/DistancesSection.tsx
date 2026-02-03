// src/components/shoes/form/DistancesSection.tsx
import { Footprints } from 'lucide-react';
import { FORM_STYLES, type FormSectionProps } from './form-types';

export function DistancesSection({ formData, updateField }: FormSectionProps) {
    // Si no es un tipo de zapatilla de correr/andar, no mostramos esto
    if (!['RUNNING', 'TRAIL', 'WALKING'].includes(formData.type)) {
        return null;
    }

    return (
        <div className="p-5 bg-surface/50 rounded-xl border border-border space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-brand/10 rounded text-brand">
                    <Footprints className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-main">Objetivos de Distancia</h4>
            </div>

            <div className="grid grid-cols-2 gap-5 items-start">
                {/* Km Iniciales */}
                <div className="space-y-1.5">
                    <label htmlFor="initialDistance" className={FORM_STYLES.label}>Km Iniciales</label>
                    <div className="relative">
                        <input
                            id="initialDistance"
                            type="number"
                            min="0"
                            step="0.1"
                            value={formData.initialDistanceKm}
                            onChange={(e) => updateField('initialDistanceKm', e.target.value)}
                            placeholder="0"
                            className={FORM_STYLES.input}
                        />
                    </div>
                    <p className="text-[10px] text-muted">Si ya las has usado antes.</p>
                </div>

                {/* Vida Útil */}
                <div className="space-y-1.5">
                    <label htmlFor="maxDistance" className={FORM_STYLES.label}>Vida Útil (Km)</label>
                    <div className="relative">
                        <input
                            id="maxDistance"
                            type="number"
                            min="1"
                            value={formData.maxDistanceKm}
                            onChange={(e) => updateField('maxDistanceKm', e.target.value)}
                            placeholder={formData.type === 'TRAIL' ? "600" : "800"}
                            className={FORM_STYLES.input}
                        />
                        {!formData.maxDistanceKm && (
                            <button
                                type="button"
                                onClick={() => updateField('maxDistanceKm', formData.type === 'TRAIL' ? '600' : '800')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-1 bg-border/50 hover:bg-border rounded text-muted hover:text-main transition-colors"
                            >
                                Auto
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-muted">Te avisaremos al llegar.</p>
                </div>
            </div>
        </div>
    );
}