"use client";
import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CouponsType>[] = [
  {
    accessorKey: "couponCode",
    header: "Coupon Code",
    cell: ({ row }) => (
      <Link
        href={`/coupons/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.couponCode}
      </Link>
    ),
  },
  {
    accessorKey: "percent",
    header: "Percent (%)",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString(),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => row.original.products.map((products) => products.title).join(", "),
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="coupon" id={row.original.couponCode} />,
  },
  
];
