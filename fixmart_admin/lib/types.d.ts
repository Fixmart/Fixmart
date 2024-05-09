type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
}

type ProductType = {
  _id: string;
  title: string;
  ItemCode:String;
  HSNCode:String;
  description: string;
  media: [string];
  category: string;
  collections: [CollectionType];
  tags: [string];
  size: [string];
  color: [string];
  Quantity:Number;
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
  QuantitySold:Number;
  PurchasedBy:[{CustomerType,quantity}];
}

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
}

type OrderItemType = {
  product: ProductType
  color: string;
  size: string;
  quantity: number;
}

type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
}