"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import Multi from "../custom ui/Multi";
import Loader from "../custom ui/Loader";

const formSchema = z.object({
    couponCode: z.string().min(2).max(20),
    percent: z.coerce.number().min(0).max(100),
    startDate: z.date(),
    endDate: z.date(),
    products: z.array(z.string()),
    description: z.string(),
});

interface CouponsFormProps {
  initialData?: CouponsType | null; 
}

const CouponForm: React.FC<CouponsFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "GET",
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log("[products_GET]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
    ? {
      ...initialData,
      products: initialData.products.map(
        (products) => products._id
      ),
    }
      : {
        couponCode: "",
        percent: 0,
        startDate: new Date(),
        endDate: new Date(),
        products: [],
        },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/coupons/${initialData._id}`
        : "/api/coupons";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Coupons ${initialData ? "updated" : "created"}`);
        window.location.href = "/coupons";
        router.push("/coupons");
      }
    } catch (err) {
      console.log("[coupons_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Coupons</p>
          <Delete id={initialData._id} item={""} />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Coupon</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
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
          <div className="md:grid md:grid-cols-2 gap-8">
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
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
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
                        value={field.value}
                        onKeyDown={handleKeyPress}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
  )}
/>        </div>
          <div className="md:grid md:grid-cols-2 gap-8">
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
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products</FormLabel>
                    <FormControl>
                      <Multi
                        placeholder="Products"
                        products={products}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (productsId) => productsId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              /> </div>

        <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
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

export default CouponForm;

