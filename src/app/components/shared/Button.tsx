/**
 * Button component - Reusable button with multiple variants and states
 * 
 * This component provides a flexible button component with:
 * - Multiple variants (primary, secondary, danger, ghost)
 * - Multiple sizes (sm, md, lg)
 * - Icon support (left or right position)
 * - Loading state with spinner
 * - Full width option
 * - Disabled state handling
 * 
 * Design System:
 * - Primary: Gradient background (brand colors)
 * - Secondary: Gray background
 * - Danger: Red for destructive actions
 * - Ghost: Transparent with hover effect
 * 
 * Accessibility:
 * - Focus ring for keyboard navigation
 * - Disabled state prevents interaction
 * - Loading state disables button
 * 
 * TODO: Add icon-only variant
 * TODO: Add ripple effect on click
 * TODO: Add tooltip support
 * TODO: Add link variant (renders as <a>)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#214059] to-[#395771] text-white hover:opacity-90 focus:ring-[#214059]/20',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/20',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500/20'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!Icon) return null;
    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    return <Icon className={iconSize} />;
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      )}
      {Icon && iconPosition === 'left' && renderIcon()}
      {children}
      {Icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};
