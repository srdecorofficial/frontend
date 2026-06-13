'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'primary' | 'outline' | 'ghost'
  children: ReactNode
  className?: string
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-[#bf9b23] text-white hover:bg-[#a6871e] focus:ring-[#bf9b23]',
    outline: 'border-2 border-[#bf9b23] text-[#bf9b23] hover:bg-[#bf9b23] hover:text-white focus:ring-[#bf9b23]',
    ghost: 'text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface focus:ring-light-accent dark:focus:ring-dark-accent',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}


