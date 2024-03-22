"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { SelectValue } from "@radix-ui/react-select";
import Dropdown from "./Dropdown";

type Props = {
  placeholder: string;
};

const CategoryFilter = (props: Props) => {
  const [category, setCategory] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.has("category")) {
      setCategory(searchParams.get("category") as string);
    }
  }, []);

  const onSelectCategory = (category: string) => {
    setCategory(category);
    let newUrl = "";

    if (category) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <Dropdown
      value={category}
      onChangeHandler={onSelectCategory}
      isOnEventForm={false}
    />
  );
};

export default CategoryFilter;
