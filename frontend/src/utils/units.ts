export type DistanceUnit = 'KM' | 'MI'
export type WeightUnit = 'KG' | 'LB'

const METERS_PER_KM = 1000
const METERS_PER_MI = 1609.344
const LB_PER_KG = 2.2046226218

export function metersToKm(meters: number): number {
    return meters / METERS_PER_KM
}

export function kmToMeters(km: number): number {
    return km * METERS_PER_KM
}

export function metersToMi(meters: number): number {
    return meters / METERS_PER_MI
}

export function miToMeters(mi: number): number {
    return mi * METERS_PER_MI
}

export function kgToLb(kg: number): number {
    return kg * LB_PER_KG
}

export function lbToKg(lb: number): number {
    return lb / LB_PER_KG
}

export function formatDistanceFromMeters(
    meters: number | null | undefined,
    unit: DistanceUnit,
    decimals = 1
): string {
    const safe = meters ?? 0
    const value = unit === 'KM' ? metersToKm(safe) : metersToMi(safe)
    const suffix = unit === 'KM' ? 'km' : 'mi'

    return `${value.toFixed(decimals)} ${suffix}`
}

export function toBaseMeters(value: number, unit: DistanceUnit): number {
    return unit === 'KM' ? kmToMeters(value) : miToMeters(value)
}

export function formatWeightFromKg(
    kg: number | null | undefined,
    unit: WeightUnit,
    decimals = 0
): string {
    const safe = kg ?? 0
    const value = unit === 'KG' ? safe : kgToLb(safe)
    const suffix = unit === 'KG' ? 'kg' : 'lb'

    return `${value.toFixed(decimals)} ${suffix}`
}

export function toBaseKg(value: number, unit: WeightUnit): number {
    return unit === 'KG' ? value : lbToKg(value)
}

export function formatPaceFromSecondsPerKm(
    secondsPerKm: number | null | undefined,
    unit: DistanceUnit
): string {
    if (secondsPerKm == null || !Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return '-'

    const conversionFactor = unit === 'MI'
        ? (METERS_PER_MI / METERS_PER_KM)
        : 1
    const seconds = secondsPerKm * conversionFactor
    
    const total = Math.round(seconds)
    const mins = Math.floor(total / 60)
    const secs = total % 60
    const suffix = unit === 'KM' ? '/km' : '/mi'

    return `${mins}:${secs.toString().padStart(2, '0')} ${suffix}`
}
