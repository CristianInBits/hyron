import type { DistanceUnit, WeightUnit } from './units'

export type AppSettings = {
    distanceUnit: DistanceUnit
    weightUnit: WeightUnit
}

const STORAGE_KEY = 'hyron.settings.v1'

export const DEFAULT_SETTINGS: AppSettings = {
    distanceUnit: 'KM',
    weightUnit: 'KG',
}

export function loadSettings(): AppSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return DEFAULT_SETTINGS
        const parsed = JSON.parse(raw) as Partial<AppSettings>

        const distanceUnit =
            parsed.distanceUnit === 'KM' || parsed.distanceUnit === 'MI'
                ? parsed.distanceUnit
                : DEFAULT_SETTINGS.distanceUnit

        const weightUnit =
            parsed.weightUnit === 'KG' || parsed.weightUnit === 'LB'
                ? parsed.weightUnit
                : DEFAULT_SETTINGS.weightUnit

        return { distanceUnit, weightUnit }
    } catch {
        return DEFAULT_SETTINGS
    }
}

export function saveSettings(next: AppSettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function patchSettings(partial: Partial<AppSettings>): AppSettings {
    const current = loadSettings()
    const next = { ...current, ...partial }
    saveSettings(next)
    return next
}