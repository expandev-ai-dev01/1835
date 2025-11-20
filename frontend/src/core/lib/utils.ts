import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @function cn
 * @summary Combines class names with Tailwind merge support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
