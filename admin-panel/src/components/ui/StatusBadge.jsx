import React from 'react'
import Badge from './Badge'

const StatusBadge = ({ status, children, ...props }) => {
  const value = status || children || 'Unknown'

  const normalized = String(value).toLowerCase()

  let variant = 'default'

  if (
    ['active', 'approved', 'completed', 'success', 'online'].includes(
      normalized
    )
  ) {
    variant = 'success'
  } else if (
    ['pending', 'processing', 'requested', 'waiting'].includes(normalized)
  ) {
    variant = 'warning'
  } else if (
    ['rejected', 'blocked', 'cancelled', 'failed', 'offline'].includes(
      normalized
    )
  ) {
    variant = 'danger'
  }

  return (
    <Badge variant={variant} {...props}>
      {value}
    </Badge>
  )
}

export default StatusBadge
