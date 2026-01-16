import { ArrowLeft, Ruler, Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { SegmentedControl } from '../components/ui/SegmentedControl' // <--- IMPORTADO

export default function SettingsPage() {
    const navigate = useNavigate()
    const { settings, setDistanceUnit, setWeightUnit } = useSettings()

    return (
        <div className="max-w-md mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center pt-6 pb-6 px-4">
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="p-2 -ml-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 ml-2">Configuración</h1>
            </div>

            {/* Unidades */}
            <div className="px-4 space-y-6">
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Unidades de medida
                    </h2>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-5">

                        {/* Distancia */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    <Ruler className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Distancia</p>
                                    <p className="text-xs text-gray-400">Running y natación</p>
                                </div>
                            </div>

                            <SegmentedControl
                                value={settings.distanceUnit}
                                options={[
                                    { value: 'KM', label: 'km' },
                                    { value: 'MI', label: 'mi' },
                                ]}
                                onChange={setDistanceUnit}
                            />
                        </div>

                        {/* Divisor sutil */}
                        <div className="h-px bg-gray-50" />

                        {/* Peso */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Peso</p>
                                    <p className="text-xs text-gray-400">Gimnasio y fuerza</p>
                                </div>
                            </div>

                            <SegmentedControl
                                value={settings.weightUnit}
                                options={[
                                    { value: 'KG', label: 'kg' },
                                    { value: 'LB', label: 'lb' },
                                ]}
                                onChange={setWeightUnit}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 px-1 text-center">
                        Tus datos históricos se convertirán automáticamente.
                    </p>
                </section>
            </div>
        </div>
    )
}