import { format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '';
  return format(new Date(date), formatStr);
}

/**
 * Format date with time
 */
export function formatDateTime(date) {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
}

/**
 * Format price to currency
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const statusColors = {
    // Client statuses
    PROSPECT: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    // Inquiry statuses
    NEW: 'bg-yellow-100 text-yellow-800',
    CONTACTED: 'bg-blue-100 text-blue-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    CONVERTED: 'bg-green-100 text-green-800',
    DISMISSED: 'bg-gray-100 text-gray-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Truncate text to specified length
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Generate random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
