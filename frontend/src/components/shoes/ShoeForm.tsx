import { useState, useEffect } from 'react'
import { getErrorMessage } from '../../services/errorHandler'
import type { Shoe, ShoeCreateRequest, ShoeType } from '../../types/shoe'
import { Footprints, Image as ImageIcon } from 'lucide-react'

// Lista de tipos para el desplegable
const SHOE_TYPES: ShoeType[] = ['RUNNING', 'TRAIL', 'CROSSFIT', 'HYROX', 'WALKING'];

type ShoeFormProps = {
    shoe?: Shoe | null
    onSubmit: (data: ShoeCreateRequest) => Promise<void>
    onCancel: () => void
}

function ShoeForm({ shoe, onSubmit, onCancel }: ShoeFormProps) {
    // --- ESTADOS ---
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')

    const [nickname, setNickname] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [colorway, setColorway] = useState('')
    const [notes, setNotes] = useState('')
    const [purchaseDate, setPurchaseDate] = useState('');

    const [type, setType] = useState<ShoeType>('RUNNING')
    const [favorite, setFavorite] = useState(false);
    const [active, setActive] = useState(true);

    const [initialDistanceKm, setInitialDistanceKm] = useState('')
    const [maxDistanceKm, setMaxDistanceKm] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // --- CARGAR DATOS AL EDITAR ---
    useEffect(() => {
        if (shoe) {
            setBrand(shoe.brand)
            setModel(shoe.model)

            setNickname(shoe.nickname || '')
            setImageUrl(shoe.imageUrl || '')
            setColorway(shoe.colorway || '')
            setNotes(shoe.notes || '')
            setPurchaseDate(shoe.purchaseDate || '')

            setType(shoe.type)
            setFavorite(shoe.favorite);
            setActive(shoe.active);

            setInitialDistanceKm(shoe.initialDistanceMeters ? (shoe.initialDistanceMeters / 1000).toString() : '')
            setMaxDistanceKm(shoe.maxDistanceMeters ? (shoe.maxDistanceMeters / 1000).toString() : '')
        } else {
            // Limpiar form si es creación
            setBrand('')
            setModel('')

            setNickname('')
            setImageUrl('')
            setColorway('')
            setNotes('')
            setPurchaseDate('')

            setType('RUNNING')
            setFavorite(false)
            setActive(true)

            setInitialDistanceKm('')
            setMaxDistanceKm('')
        }
    }, [shoe])

    // --- MANEJADOR DE ENVÍO ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!brand.trim()) { setError('La marca es obligatoria'); return; }
        if (!model.trim()) { setError('El modelo es obligatorio'); return; }

        try {
            setLoading(true)
            setError(null)

            await onSubmit({
                brand: brand.trim(),
                model: model.trim(),

                nickname: nickname.trim() || null,
                imageUrl: imageUrl.trim() || null,
                colorway: colorway.trim() || null,
                notes: notes.trim() || null,
                purchaseDate: purchaseDate.trim() || null,

                type: type,
                favorite: favorite,
                active: active,

                initialDistanceMeters: initialDistanceKm ? Math.round(parseFloat(initialDistanceKm) * 1000) : 0,
                maxDistanceMeters: maxDistanceKm ? Math.round(parseFloat(maxDistanceKm) * 1000) : null,
            })
        } catch (err) {
            setError(getErrorMessage(err))
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // --- CLASES CSS COMUNES (Para no repetir) ---
    const inputClass = "w-full px-3 py-2 bg-page border border-border rounded-lg text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all";
    const labelClass = "block text-xs font-bold text-muted uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="text-left">

            {/* Mensaje de Error */}
            {error && (
                <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm border border-rose-100 dark:border-rose-800">
                    {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">

                {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
                <div className="sm:w-1/3 flex flex-col gap-4">
                    <label className={labelClass}>Previsualización</label>
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-dashed border-border bg-page flex items-center justify-center group">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Vista previa"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Si falla la carga de la imagen, la ocultamos o mostramos placeholder
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="text-center p-4">
                                <ImageIcon className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
                                <span className="text-xs text-muted">Sin imagen</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>URL de Imagen</label>
                        <input
                            type="url"
                            className={inputClass}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                        />
                        <p className="text-[10px] text-muted mt-1">Copia la dirección de imagen de Google</p>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: DATOS --- */}
                <div className="sm:w-2/3 flex flex-col gap-4">

                    {/* TIPO */}
                    <div>
                        <label className={labelClass}>Tipo de actividad *</label>
                        <select
                            className={inputClass}
                            value={type}
                            onChange={(e) => setType(e.target.value as ShoeType)}
                        >
                            {SHOE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* MARCA Y MODELO */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Marca *</label>
                            <input
                                type="text"
                                className={inputClass}
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="Nike"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Modelo *</label>
                            <input
                                type="text"
                                className={inputClass}
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="Pegasus 40"
                            />
                        </div>
                    </div>

                    {/* APODO */}
                    <div>
                        <label className={labelClass}>Apodo (Opcional)</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder='Ej: "Las de competición"'
                        />
                    </div>

                    {/* DISTANCIAS */}
                    <div className="p-4 bg-page rounded-xl border border-border mt-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Footprints className="w-4 h-4 text-brand" />
                            <h4 className="text-sm font-bold text-main">Control de Kilometraje</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Km Actuales</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className={inputClass}
                                    value={initialDistanceKm}
                                    onChange={(e) => setInitialDistanceKm(e.target.value)}
                                    placeholder="0"
                                />
                                <p className="text-[10px] text-muted mt-1">Si ya las has usado antes</p>
                            </div>
                            <div>
                                <label className={labelClass}>Km Máximos</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className={inputClass}
                                    value={maxDistanceKm}
                                    onChange={(e) => setMaxDistanceKm(e.target.value)}
                                    placeholder="Ej: 800"
                                />
                                <p className="text-[10px] text-muted mt-1">Para aviso de cambio</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- BOTONES DE ACCIÓN --- */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-border text-main rounded-lg hover:bg-page transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-brand/20"
                >
                    {loading ? 'Guardando...' : 'Guardar Zapatilla'}
                </button>
            </div>
        </form>
    )
}

export default ShoeForm