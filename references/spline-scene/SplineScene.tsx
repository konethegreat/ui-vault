// Original: Spline Scene by Serafim (https://21st.dev/@serafimcloud/components/splite), MIT.
// The MIT notice is in LICENSE.md. Nothing in this file is copied from the demo scene.
// Changes in this repository: this comment header only. The component code is unchanged.

'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
