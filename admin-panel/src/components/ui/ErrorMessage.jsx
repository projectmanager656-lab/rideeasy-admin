import React from 'react'
import ErrorState from './ErrorState'

const ErrorMessage = ({
  message = 'Something went wrong. Please try again.',
  ...props
}) => {
  return (
    <ErrorState
      message={message}
      {...props}
    />
  )
}

export default ErrorMessage
