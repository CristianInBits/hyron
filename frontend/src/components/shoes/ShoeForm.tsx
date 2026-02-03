// src/components/shoes/ShoeForm.tsx
import { useState, useEffect } from 'react'
import { Save, X, ChevronDown, ChevronUp } from 'lucide-react'
import { getErrorMessage } from '../../services/errorHandler'
import type { Shoe, ShoeCreateRequest } from '../../types/shoe'

// Importamos nuestros componentes nuevos
// Importamos nuestros componentes nuevos
import type { FormState } from './form/form-types'
import { IdentitySection } from './form/IdentitySection'
import { DetailsSection } from './form/DetailsSection'
import { DistancesSection } from './form/DistancesSection'
import { ExtrasSection } from './form/ExtrasSection'

const INITIAL_STATE: FormState = {
    brand: '', model: '', nickname: '', imageUrl: '', colorway: '', notes: '',
    type: 'RUNNING', favorite: false, active: true,
    purchaseDate: '', initialDistanceKm: '', maxDistanceKm: ''
};

type ShoeFormProps = {
    shoe?: Shoe | null
    onSubmit: (data: ShoeCreateRequest) => Promise<void>
    onCancel: () => void
}

function ShoeForm({ shoe, onSubmit, onCancel }: ShoeFormProps) {
    const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
    const [showOptional, setShowOptional] = useState(!!shoe); // Abrir si editamos
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carga de Datos
    useEffect(() => {
        if (shoe) {
            setFormData({
                brand: shoe.brand,
                model: shoe.model,
                nickname: shoe.nickname || '',
                imageUrl: shoe.imageUrl || '',
                colorway: shoe.colorway || '',
                notes: shoe.notes || '',
                type: shoe.type,
                favorite: shoe.favorite,
                active: shoe.active,
                purchaseDate: shoe.purchaseDate || '',
                initialDistanceKm: shoe.initialDistanceMeters ? (shoe.initialDistanceMeters / 1000).toString() : '',
                maxDistanceKm: shoe.maxDistanceMeters ? (shoe.maxDistanceMeters / 1000).toString() : ''
            });
        } else {
            setFormData(INITIAL_STATE);
        }
    }, [shoe]);

    const updateField = (field: keyof FormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.brand.trim()) { setError('Marca obligatoria'); return; }
        if (!formData.model.trim()) { setError('Modelo obligatorio'); return; }

        try {
            setLoading(true);
            setError(null);

            // Construcción del Payload (Lógica de negocio)
            const payload: ShoeCreateRequest = {
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                nickname: formData.nickname.trim() || null,
                imageUrl: formData.imageUrl.trim() || null,
                colorway: formData.colorway.trim() || null,
                notes: formData.notes.trim() || null,
                type: formData.type,
                favorite: formData.favorite,
                active: formData.active,
                purchaseDate: formData.purchaseDate || null,
                initialDistanceMeters: formData.initialDistanceKm ? Math.round(parseFloat(formData.initialDistanceKm) * 1000) : 0,
                maxDistanceMeters: formData.maxDistanceKm ? Math.round(parseFloat(formData.maxDistanceKm) * 1000) : null,
            };

            await onSubmit(payload);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="text-left flex flex-col h-[80vh] sm:h-auto sm:max-h-[80vh]">

            {/* --- CONTENIDO CON SCROLL --- */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar">

                {error && (
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100 flex items-center sticky top-0 z-10 backdrop-blur-sm shadow-sm mb-4">
                        <X className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}

                {/* BLOQUE 1: IDENTIDAD */}
                <IdentitySection formData={formData} updateField={updateField} />

                {/* SEPARADOR / ACORDEÓN */}
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                    <div className="relative flex justify-center">
                        <button type="button" onClick={() => setShowOptional(!showOptional)} className="bg-page px-4 text-sm text-muted hover:text-main font-medium flex items-center gap-2 transition-colors group">
                            {showOptional ? (
                                <><span>Ocultar detalles</span><ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <><span>Añadir detalles opcionales</span><ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* BLOQUES OPCIONALES */}
                {showOptional && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="text-center space-y-1">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Detalles Adicionales</h3>
                            <p className="text-xs text-muted/70">Personaliza tu equipo al máximo.</p>
                        </div>

                        <DetailsSection formData={formData} updateField={updateField} />

                        <DistancesSection formData={formData} updateField={updateField} />

                        <ExtrasSection formData={formData} updateField={updateField} shoeExists={!!shoe} />
                    </div>
                )}

                <div className="h-4"></div>
            </div>

            {/* --- FOOTER FIJO --- */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-auto bg-page z-20 relative">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 border border-border text-main font-medium rounded-xl hover:bg-surface transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-brand/20 flex items-center">
                    {loading ? <span className="animate-pulse">Guardando...</span> : <><Save className="w-4 h-4 mr-2" />Guardar</>}
                </button>
            </div>
        </form>
    )
}

export default ShoeForm