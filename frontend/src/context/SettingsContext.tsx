import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { formatDistanceFromMeters, formatWeightFromKg, formatPaceFromSecondsPerKm, type DistanceUnit, type WeightUnit } from '../utils/units'
import { loadSettings, patchSettings, type AppSettings } from '../utils/settingsStorage'

type SettingsContextValue = {
    settings: AppSettings
    setDistanceUnit: (u: DistanceUnit) => void
    setWeightUnit: (u: WeightUnit) => void
    formatDistance: (meters: number | null | undefined, decimals?: number) => string
    formatWeight: (kg: number | null | undefined, decimals?: number) => string
    formatPace: (secondsPerKm: number | null | undefined) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(() => loadSettings())

    const setDistanceUnit = (u: DistanceUnit) => {
        const next = patchSettings({ distanceUnit: u })
        setSettings(next)
    }

    const setWeightUnit = (u: WeightUnit) => {
        const next = patchSettings({ weightUnit: u })
        setSettings(next)
    }

    const value = useMemo<SettingsContextValue>(() => ({
        settings,
        setDistanceUnit,
        setWeightUnit,
        formatDistance: (meters, decimals = 1) =>
            formatDistanceFromMeters(meters, settings.distanceUnit, decimals),
        formatWeight: (kg, decimals = 0) =>
            formatWeightFromKg(kg, settings.weightUnit, decimals),
        formatPace: (secondsPerKm) =>
            formatPaceFromSecondsPerKm(secondsPerKm, settings.distanceUnit),
    }), [settings])

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
    const ctx = useContext(SettingsContext)
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
    return ctx
}