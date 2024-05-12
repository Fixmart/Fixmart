"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface MultiProps {
  placeholder: string;
  products: ProductType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const Multi: React.FC<MultiProps> = ({
  placeholder,
  products,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  let selected: ProductType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      products.find((products) => products._id === id)
    ) as ProductType[];
  }

   const selectables =products.filter((products)=> !selected.includes(products));
  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((products) => (
          <Badge key={products._id}>
            {products.title}
            <button type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(products._id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((products) => (
              <CommandItem
                key={products._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(products._id);
                  setInputValue("");
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {products.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default Multi;
