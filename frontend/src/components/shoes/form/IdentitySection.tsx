// src/components/shoes/form/IdentitySection.tsx
import { Image as ImageIcon } from 'lucide-react';
import type { ShoeType } from '../../../types/shoe';
import { FORM_STYLES, type FormSectionProps } from './form-types';

const SHOE_TYPES: ShoeType[] = ['RUNNING', 'TRAIL', 'CROSSFIT', 'HYROX', 'WALKING'];

export function IdentitySection({ formData, updateField }: FormSectionProps) {
    return (
        <div className="relative space-y-8 pb-8 border-b border-border">

            {/* Botón Favorito Flotante */}
            <button
                type="button"
                onClick={() => updateField('favorite', !formData.favorite)}
                className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-300 ${formData.favorite
                    ? 'text-yellow-400 bg-yellow-400/10 scale-110'
                    : 'text-muted hover:text-yellow-400 hover:bg-surface'
                    }`}
                title="Marcar como favorita"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={formData.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            {/* Imagen Central */}
            <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                    <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden bg-surface shadow-sm transition-all ${formData.imageUrl ? 'border-brand' : 'border-border border-dashed'
                        }`}>
                        {formData.imageUrl ? (
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-muted/50" />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Pega la URL de la imagen..."
                        value={formData.imageUrl}
                        onChange={(e) => updateField('imageUrl', e.target.value)}
                        className="mt-4 text-center text-sm w-64 bg-transparent border-b border-border focus:border-brand focus:outline-none placeholder:text-muted/50 pb-1 transition-colors"
                    />
                </div>
            </div>

            {/* Selector de Tipo */}
            <div className="space-y-3">
                <label className={FORM_STYLES.label}>Tipo de Actividad</label>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {SHOE_TYPES.map((typeOption) => (
                        <button
                            key={typeOption}
                            type="button"
                            onClick={() => updateField('type', typeOption)}
                            className={`
                                px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all border
                                ${formData.type === typeOption
                                    ? 'bg-brand text-white border-brand shadow-md shadow-brand/20 scale-105'
                                    : 'bg-page text-muted border-border hover:border-brand/50 hover:text-main'}
                            `}
                        >
                            {typeOption}
                        </button>
                    ))}
                </div>
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label htmlFor="brand" className={FORM_STYLES.label}>Marca</label>
                    <input
                        id="brand"
                        type="text"
                        value={formData.brand}
                        onChange={(e) => updateField('brand', e.target.value)}
                        placeholder="Ej. Nike, Adidas..."
                        className={FORM_STYLES.input}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="model" className={FORM_STYLES.label}>Modelo</label>
                    <input
                        id="model"
                        type="text"
                        value={formData.model}
                        onChange={(e) => updateField('model', e.target.value)}
                        placeholder="Ej. Metcon 9..."
                        className={FORM_STYLES.input}
                        required
                    />
                </div>
            </div>
        </div>
    );
}