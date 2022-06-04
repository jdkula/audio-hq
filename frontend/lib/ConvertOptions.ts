/**
 * ConvertOptions.ts
 * ===================
 * Provides options passed to workers for audio processing
 */
export default interface ConvertOptions {
    cut?:
        | {
              start: number;
              end: number;
          }
        | null
        | undefined;
    fadeIn?: number | null | undefined;
    fadeOut?: number | null | undefined;
}
