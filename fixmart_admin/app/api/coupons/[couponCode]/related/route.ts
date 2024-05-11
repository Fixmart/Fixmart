import Coupons from "@/lib/models/Coupons";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { couponCode: string } }) => {
  try {
    await connectToDB();

    const coupon = await Coupons.findOne({ couponCode: params.couponCode });

    if (!coupon) {
      return new NextResponse(JSON.stringify({ message: "Coupon not found" }), { status: 404 });
    }

    const relatedCoupons = await Coupons.find({
      $or: [
        { category: coupon.category },
        { products: { $in: coupon.products }}
      ],
      _id: { $ne: coupon._id } // Exclude the current coupon
    });

    if (!relatedCoupons) {
      return new NextResponse(JSON.stringify({ message: "No related coupons found" }), { status: 404 });
    }

    return NextResponse.json(relatedCoupons, { status: 200 });
  } catch (err) {
    console.log("[related_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
