import Coupons from "@/lib/models/Coupons";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { couponCode: string } }
) => {
  try {
    await connectToDB();

    const coupon = await Coupons.findOne({ couponCode: params.couponCode });

    if (!coupon) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(coupon), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[couponCode_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { couponCode: string } }
) => {
  try {
    await connectToDB();

    const couponData = await req.json();

    const existingCoupon = await Coupons.findOne({
      couponCode: params.couponCode,
    });

    if (existingCoupon) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon code already exists" }),
        { status: 400 }
      );
    }

    const newCoupon = new Coupons({ ...couponData, couponCode: params.couponCode });
    await newCoupon.save();

    return new NextResponse(JSON.stringify(newCoupon), { status: 200 });
  } catch (err) {
    console.log("[couponCode_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { couponCode: string } }
) => {
  try {
    await connectToDB();

    const couponData = await req.json();

    const updatedCoupon = await Coupons.findOneAndUpdate(
      { couponCode: params.couponCode },
      couponData,
      { new: true }
    );

    if (!updatedCoupon) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(updatedCoupon), { status: 200 });
  } catch (err) {
    console.log("[couponCode_PUT]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { couponCode: string } }
) => {
  try {
    await connectToDB();

    const deletedCoupon = await Coupons.findOneAndDelete({
      couponCode: params.couponCode,
    });

    if (!deletedCoupon) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Coupon deleted" }),
      { status: 200 }
    );
  } catch (err) {
    console.log("[couponCode_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
