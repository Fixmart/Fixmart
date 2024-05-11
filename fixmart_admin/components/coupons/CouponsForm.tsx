"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Delete from "../custom ui/Delete";
import Loader from "../custom ui/Loader";
import MultiSelect from "../custom ui/MultiSelect";
import ProductDetails from "@/app/(dashboard)/products/[productId]/page";
import Product from "@/lib/models/Product";

const products = await Product.find().lean();
const formSchema = z.object({
  couponCode: z.string().min(2).max(20),
  percent: z.number().min(0).max(100),
  startDate: z.date(),
  endDate: z.date(),
  products: z.array(z.string()), // Assuming products are represented by their IDs
});

interface CouponsFormProps {
  initialData?: CouponsType | null; // Must have "?" to make it optional
}

const CouponsForm: React.FC<CouponsFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ?{}
      : {
          couponCode: "",
          percent: 0,
          startDate: new Date(),
          endDate: new Date(),
          products: [],
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await fetch("/api/coupons", {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success("Coupon created successfully");
        router.push("/coupons");
      }
    } catch (err) {
      console.error("[CouponsForm]", err);
      toast.error("Failed to create coupon. Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Coupon</p>
          <Delete id={initialData.couponCode} item="coupon" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Coupon</p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="couponCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Coupon Code"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percent Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Percent Discount"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    {...field}
                    value={field.value.toISOString().split('T')[0]}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input
                        type="date"
                        placeholder="End Date"
                        {...field}
                        value={field.value.toISOString().split('T')[0]}
                        onKeyDown={handleKeyPress}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
  )}
/>
                

          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/coupons")}
              className="bg-blue-1 text-white"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CouponsForm;
