"use client"

import Loader from '@/components/custom ui/Loader'
import CouponsForm from '@/components/coupons/CouponForm'
import React, { useEffect, useState } from 'react'

const CouponDetails = ({ params }: { params: { couponCode: string }}) => {

  const [loading, setLoading] = useState(true)
  const [couponDetails, setCouponDetails] = useState<CouponsType | null>(null)


  const getCouponDetails = async () => {
    try { 
      const res = await fetch(`/api/coupons/${params.couponCode}`, {
        method: "GET"
      })
      const data = await res.json()
      setCouponDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[couponCode_GET]", err)
    }
  }

  useEffect(() => {
    getCouponDetails()
  }, [])

  return loading ? <Loader /> : (
    <CouponsForm initialData={couponDetails} />
  )
}

export default CouponDetails
