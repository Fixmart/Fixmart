// Import necessary modules
import Loader from '@/components/custom ui/Loader'
import CouponsForm from '@/components/coupons/CouponsForm'
import React, { useEffect, useState } from 'react'

const CouponDetails = ({ params }: { params: { couponCode: string }}) => {

  const [loading, setLoading] = useState(true)
  const [couponDetails, setCouponDetails] = useState<CouponsType | null>(null)

  // Function to fetch coupon details from the API
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

  // useEffect hook to fetch coupon details when the component mounts
  useEffect(() => {
    getCouponDetails()
  }, [])

  // Render loading indicator if data is still loading, otherwise render the CouponsForm with initial data
  return loading ? <Loader /> : (
    <CouponsForm initialData={couponDetails} />
  )
}

export default CouponDetails
