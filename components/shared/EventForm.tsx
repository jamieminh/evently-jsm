"use client";
import { eventDefaultValues } from "@/constants/types";
import { eventFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Dropdown from "./Dropdown";
import FileUploader from "./FileUploader";

import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FieldValues, useForm } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";

type Props = {
  userId: string;
  type: "create" | "update";
  event?: IEvent;
  eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  console.log("EventForm", { event, type });

  const initialValues =
    type === "update" && event
      ? {
          ...event,
          categoryId: event.category._id.toString(),
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;

  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  // Define the form.
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  // Define a submit handler, the values would already
  // be validated and typed by zod.
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    console.log(values);

    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      console.log("onSubmit - 000", uploadedImages);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].url;
    }
    console.log("onSubmit - 111", { uploadedImageUrl, type });

    if (type === "create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (type === "update" && eventId) {
      try {
        if (!event) {
          throw new Error("Missing Event Id");
        }
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`,
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  function validateDates() {
    const startDateTime = form.getValues("startDateTime");
    const endDateTime = form.getValues("endDateTime");
    console.log("validateDates - ", { startDateTime, endDateTime });
    if (endDateTime.getTime() <= startDateTime.getTime()) {
      form.setError("endDateTime", {
        type: "manual",
        message: "End date must be after start date",
      });
    } else if (
      endDateTime.getTime() - startDateTime.getTime() <
      30 * 60 * 1000
    ) {
      form.setError("endDateTime", {
        type: "manual",
        message: "Event must be at least 30 minutes long",
      });
    } else {
      form.clearErrors("endDateTime");
    }
  }

  function onDateChange(date: Date, field: FieldValues) {
    field.onChange(date);
    validateDates();
  }

  console.log('EventForm - ', form.getValues());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 event-form"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Event title"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    {...field}
                    onChangeHandler={field.onChange}
                    value={field.value}
                    isOnEventForm={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="imageUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            name="location"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      width={24}
                      height={24}
                      alt="location"
                    />
                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            name="startDateTime"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={24}
                      height={24}
                      alt="calendar"
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-500">
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => onDateChange(date, field)}
                      showTimeSelect={true}
                      timeInputLabel="Time: "
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      timeIntervals={15}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="endDateTime"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={24}
                      height={24}
                      alt="calendar"
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-500">
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => onDateChange(date, field)}
                      showTimeSelect={true}
                      timeInputLabel="Time: "
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      timeIntervals={15}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      width={24}
                      height={24}
                      alt="dollar"
                      className="filter-grey"
                    />
                    <Input
                      onWheel={(e) => e.currentTarget.blur()} // disable scroll inside input to change value
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => {
                        console.log("IsFree - ", { field, value: field.value });
                        return (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <Label
                                  htmlFor="isFree"
                                  className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Free Ticket
                                </Label>
                                <Checkbox
                                  id="isFree"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mr-2 h-5 w-5 border-2 border-primary-500"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <div className="flex-center h-[55px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      width={24}
                      height={24}
                      alt="link"
                    />
                    <Input
                      placeholder="Url"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size={"lg"}
          disabled={form.formState.isSubmitting}
          className="button col-2 w-full capitalize"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
