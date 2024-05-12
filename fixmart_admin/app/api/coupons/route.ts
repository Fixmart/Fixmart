import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Coupons from "@/lib/models/Coupons";


export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      couponCode,
      percent,
      startDate,
      endDate,
      products,
    } = await req.json();
    if (!couponCode|| !percent || !startDate || !endDate || !products) {
      return new NextResponse("Not enough data to create a Coupons", {
        status: 400,
      });
    }

    const newCoupon = await Coupons.create({
      couponCode,
      percent,
      startDate,
      endDate,
      products,
    });

    await newCoupon.save();

    if (products) {
      for (const productId of products) {
        const product  = await Product.findById(productId);
        if (products) {
          products.coupons.push(newCoupon._id);
          await products.save();
        }
      }
    }

    return NextResponse.json(newCoupon, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest, { params }: { params: { couponCode: string } }) => {
  try {
    await connectToDB();

    const coupons = (await Coupons.find().sort({ createdAt: "desc" }).populate({ path: "products", model: Product }))

    return NextResponse.json(coupons, { status: 200 });
  } catch (err) {
    console.log("[coupons_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
