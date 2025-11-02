/**
 * Toast notification service for displaying user feedback
 * Uses Svelte 5 runes for reactive state management
 */

import { rune } from '$lib/runes.svelte';
import type { ToastNotification } from './types';

let toastIdCounter = 0;

function generateToastId(): string {
  return `toast-${Date.now()}-${toastIdCounter++}`;
}

/**
 * Toast notification service
 * Manages a queue of toast notifications with auto-dismiss
 */
export const toastService = {
  /** Reactive list of active toasts */
  toasts: rune<ToastNotification[]>([]),

  /**
   * Shows a success toast notification
   */
  success(message: string, duration = 5000): void {
    this.show({
      id: generateToastId(),
      message,
      type: 'success',
      duration,
      dismissible: true
    });
  },

  /**
   * Shows an error toast notification
   */
  error(message: string, duration = 7000): void {
    this.show({
      id: generateToastId(),
      message,
      type: 'error',
      duration,
      dismissible: true
    });
  },

  /**
   * Shows a warning toast notification
   */
  warning(message: string, duration = 6000): void {
    this.show({
      id: generateToastId(),
      message,
      type: 'warning',
      duration,
      dismissible: true
    });
  },

  /**
   * Shows an info toast notification
   */
  info(message: string, duration = 5000): void {
    this.show({
      id: generateToastId(),
      message,
      type: 'info',
      duration,
      dismissible: true
    });
  },

  /**
   * Shows a custom toast notification
   */
  show(toast: ToastNotification): void {
    this.toasts.value = [...this.toasts.value, toast];

    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);
    }
  },

  /**
   * Dismisses a specific toast by ID
   */
  dismiss(id: string): void {
    this.toasts.value = this.toasts.value.filter((toast) => toast.id !== id);
  },

  /**
   * Clears all toasts
   */
  clear(): void {
    this.toasts.value = [];
  }
};

