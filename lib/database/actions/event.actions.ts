import { convertDocumentToObject, handleError } from "@/lib/utils";
import { connectToDatabase } from "..";
import Event from "../models/event.model";

export const getEventById = async (id: string) => {
  try {
    await connectToDatabase();

    const newUser = await Event.findOne({ id });

    // return a normal object instead of the mongo document
    return convertDocumentToObject(newUser);
  } catch (e) {
    handleError(e);
  }
};

export const updateManyEvents = async (events: any) => {
  
}