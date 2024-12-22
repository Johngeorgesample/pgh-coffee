'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
    </div>
  )
}
