'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  /** Entrance direction the content animates in from. */
  from?: Direction
  /** Delay in seconds before the animation starts. */
  delay?: number
  /** Animation duration in seconds. */
  duration?: number
  /** Play immediately on mount instead of when scrolled into view. */
  immediate?: boolean
  className?: string
}

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 20 },
  down: { y: -30 },
  left: { x: -30 },
  right: { x: 30 },
  none: {},
}

/**
 * Lightweight client-side entrance-animation wrapper, so static content can stay
 * server-rendered while only the animation runs on the client.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 0.6,
  immediate = false,
  className,
}: RevealProps) {
  const hidden = { opacity: 0, ...offset[from] }
  const shown = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true } })}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
