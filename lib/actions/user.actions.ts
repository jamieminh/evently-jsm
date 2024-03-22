"use server";

import { convertDocumentToObject, handleError } from "@/lib/utils";
import { CreateUserParams, UpdateUserParams } from "@/types";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Order from "../database/models/order.model";
import { revalidatePath } from "next/cache";

export const getUserById = async (clerkId: string) => {
  try {
    await connectToDatabase();

    // const newUser = await User.findOne({ clerkId });

    // return a normal object instead of the mongo document
    // return convertDocumentToObject(newUser);
  } catch (e) {
    handleError(e);
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(userData);

    return convertDocumentToObject(newUser);
  } catch (e) {
    handleError(e);
  }
};

export const updateUser = async (
  clerkId: string,
  userData: UpdateUserParams
) => {
  try {
    await connectToDatabase();

    // NOTE: without {new:true} the action will return the document BEFORE the update
    const user = await User.findOneAndUpdate({ clerkId }, userData, {
      new: true,
    });

    return convertDocumentToObject(user);
  } catch (e) {
    handleError(e);
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    // get the user before deleting it to check if it exists
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Unlink relationships:
    // - remove references to user from 'events' collection
    // - remove references to user from 'orders' collection
    const eventsPromise = Event.updateMany(
      { _id: user.events },
      { $pull: { organizer: user._id } }
    );
    const ordersPromise = Order.updateMany(
      { _id: { $in: user.orders } },
      { $unset: { buyer: 1 } }
    );

    await Promise.all([eventsPromise, ordersPromise]);

    const newUser = await User.findByIdAndDelete(
      { id: user.id },
      { new: true }
    );
    revalidatePath("/");

    return convertDocumentToObject(newUser);
  } catch (e) {
    handleError(e);
  }
};
