import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ICategory } from "@/lib/database/models/category.model";
import { startTransition, useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";

type Props = {
  onChangeHandler?: (value: string) => void;
  value?: string;
  isOnEventForm: boolean;
};

const Dropdown = ({ value, onChangeHandler, isOnEventForm }: Props) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryList = await getAllCategories();
      if (categoryList) {
        setCategories(categoryList as ICategory[]);
      }
    };

    fetchCategories();
  }, []);

  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    if (isOnEventForm) {
      createCategory({ categoryName: newCategory.trim() }).then((category) => {
        setCategories((prev) => [...prev, category]);
      });
    }
  };

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {!isOnEventForm && (
          <SelectItem className="select-item p-regular-14" value="all">
            All
          </SelectItem>
        )}
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category._id}
              value={isOnEventForm ? category._id : category.name}
              className="select-item p-regular-14"
            >
              {category.name}
            </SelectItem>
          ))}
        {isOnEventForm && (
          <AlertDialog>
            <AlertDialogTrigger className="p-md-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
              Add new category
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>New Cateogory</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    placeholder="Category name"
                    type="text"
                    className="input-field mt-3"
                    maxLength={30}
                    onChange={onCategoryChange}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => startTransition(handleAddCategory)}
                >
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
