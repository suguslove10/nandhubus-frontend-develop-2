import React, { Suspense } from 'react'
import Checkout from './checkout'

function page() {
  return (
    <Suspense><Checkout /></Suspense>
  )
}

export default page