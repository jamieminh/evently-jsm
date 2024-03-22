"use server";

import { CreateCategoryParams } from "@/types";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import { convertDocumentToObject, handleError } from "../utils";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });

    return convertDocumentToObject(newCategory);
  } catch (e) {
    handleError(e);
  }
};

export const getAllCategories = async () => {
  try {
    await connectToDatabase();
    const categories = await Category.find();

    return convertDocumentToObject(categories);
  } catch (e) {
    handleError(e);
  }
};
