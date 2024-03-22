import { RefinementCtx, z, ZodType } from "zod";

const FutureDateSchema = z.date().refine((value: Date) => value > new Date(), {
  message: "Date must be in the future",
});

export const eventFormSchema = z
  .object({
    title: z.string().min(3, {
      message: "Title must be at least 3 characters long",
    }),
    description: z
      .string()
      .min(3, {
        message: "Description must be at least 3 characters long",
      })
      .max(400, {
        message: "Description must be at most 400 characters long",
      }),
    location: z
      .string()
      .min(3, {
        message: "Location must be at least 3 characters long",
      })
      .max(100, {
        message: "Location must be at most 100 characters long",
      }),
    imageUrl: z.string().url({
      message: "Please enter a valid URL",
    }),
    startDateTime: FutureDateSchema,
    endDateTime: FutureDateSchema,
    categoryId: z.string().min(1, { message: "Please select a category" }), // min(1) is a semi-official way to apply required validation
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url({
      message: "Please enter a valid URL",
    }),
  })

  /**
   * a superRefine() to check if the endDateTime is after startDateTime
   * these 2 fields are dependant on each other, so we have to check them together
   * however, there was no ctx.removeIssue method to remove error from the other
   * field if a change in one field makes the other field valid
   * 
   * So we use a custom validation function in EventForm instead
   */
  // .superRefine((data, ctx) => {
  //   const start = data.startDateTime;
  //   const end = data.endDateTime;

  //   console.log("check - ", {
  //     diff: end.getTime() - start.getTime(),
  //     start,
  //     end,
  //     check: end.getTime() - start.getTime() >= 30 * 60 * 1000,
  //   });

  //   if (end.getTime() <= start.getTime()) {
  //     // the error is only show on the changed field, so if startDateTime was valid,
  //     // but changed into invalid, the error will only show on startDateTime
  //     // so we have to adjust the error content
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.invalid_date,
  //       message: "Event start time must be before end time",
  //       path: ["startDateTime"],
  //     });
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.invalid_date,
  //       message: "Event end time must be after start time",
  //       path: ["endDateTime"],
  //     });
  //   } else {
  //     ctx.(["startDateTime", "endDateTime"]);
  //   }

  //   if (!(end.getTime() - start.getTime() >= 30 * 60 * 1000)) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.invalid_date,
  //       message: "Event must be at least 30 minutes long",
  //       path: ["endDateTime"],
  //     });
  //   }
  // });
