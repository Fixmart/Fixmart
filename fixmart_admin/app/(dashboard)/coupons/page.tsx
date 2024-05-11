"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/coupons/CouponColumns"; 

const Coupons = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<CouponsType[]>([]); // Adjust the type for coupons if needed

  const getCoupons = async () => {
    try {
      const res = await fetch("/api/coupons", {
        method: "GET",
      });
      const data = await res.json();
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      console.log("[coupons_GET]", err);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Coupons</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/coupons/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={coupons} searchKey="couponCode" /> {/* Adjust searchKey if needed */}
    </div>
  );
};

export default Coupons;
