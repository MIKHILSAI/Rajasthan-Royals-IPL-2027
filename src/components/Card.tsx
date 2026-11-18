import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function Card({ title, subtitle, action, children, className = '', bodyClassName = '' }: CardProps) {
  return (
    <section className={`card reusable-card ${className}`}>
      {(title || subtitle || action) && (
        <header className="reusable-card-header">
          <div className="reusable-card-heading">
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={`reusable-card-body ${bodyClassName}`}>{children}</div>
    </section>
  )
}
