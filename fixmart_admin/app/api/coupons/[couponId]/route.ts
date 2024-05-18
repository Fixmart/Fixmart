
import Coupons from "@/lib/models/Coupons";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { couponId: string } }
) => {
  try {
    await connectToDB();

    const coupons = await Coupons.findById(params.couponId).populate({
      path: "products",
      model: Product,
    });

    if (!coupons) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(coupons), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { couponId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const coupons = await Coupons.findById(params.couponId);

    if (!coupons) {
      return new NextResponse(
        JSON.stringify({ message: "Coupons not found" }),
        { status: 404 }
      );
    }
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

    const addedProducts = products.filter(
      (productId: string) => !coupons.products.includes(productId)
    );
    // included in new data, but not included in the previous data

    const removedProducts = coupons.products.filter(
      (productId: string) => !products.includes(productId)
    );
    await Promise.all([
      // Update added collections with this product
      ...addedProducts.map((productId: string) =>
        Product.findByIdAndUpdate(productId, {
          $push: { coupons: coupons._id },
        })
      ),
      ...removedProducts.map((productId: string) =>
        Product.findByIdAndUpdate(productId, {
          $pull: { coupons: coupons._id },
        })
      ),
    ]);

    const updatedCoupon = await Coupons.findByIdAndUpdate(
      coupons._id,
      {
        couponCode,
        percent,
        startDate,
        endDate,
        products,
      },
      { new: true }
    ).populate({ path: "products", model: Product });

    await updatedCoupon.save();

    return NextResponse.json(updatedCoupon, { status: 200 });
  } catch (err) {
    console.log("[couponCode_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { couponCode: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const coupons = await Coupons.findById(params.couponCode);

    if (!coupons) {
      return new NextResponse(
        JSON.stringify({ message: "Coupon not found" }),
        { status: 404 }
      );
    }

    await Coupons.findByIdAndDelete(coupons._id);

    // Update collections
    await Promise.all(
      coupons.products.map((productId: string) =>
        Product.findByIdAndUpdate(productId, {
          $pull: { coupons: coupons._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Coupon deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[couponCode_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export const dynamic = "force-dynamic";
