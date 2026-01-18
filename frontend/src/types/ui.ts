/**
 * Variantes de color disponibles para los componentes de UI.
 *
 * Este tipo centraliza el catálogo de colores soportados en la aplicación para:
 * - Mantener consistencia visual entre componentes.
 * - Evitar strings mágicos repartidos por el código.
 * - Facilitar la validación estática de mapas de estilos (TypeScript).
 *
 * Cada componente suele asociar estas variantes a un mapa `THEME`/`VARIANTS`
 * con clases Tailwind explícitas.
 */
export type ColorVariant = 'green' | 'blue' | 'purple' | 'hyrox'

/**
 * Subconjunto de {@link ColorVariant} soportado por componentes de entrada de distancia.
 *
 * Actualmente excluye `purple` porque esos componentes no definen tema para esa variante.
 * Se deriva automáticamente con {@link Exclude} para evitar duplicar literales.
 */
export type DistanceColorVariant = Exclude<ColorVariant, 'purple'>
