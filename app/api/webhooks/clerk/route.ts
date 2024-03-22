import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { CreateUserParams, UpdateUserParams } from "@/types";
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  console.log("Webhook 0000:", { req, key: process.env.CLERK_WEBHOOK_SECRET });

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET for Clerk is missing");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = event.type;

  console.log("Webhook event:", { eventType, event });

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, username, image_url } =
      event.data;

    const firstName = first_name || "User";
    const lastName = last_name || Math.random().toString(36).substring(2);

    // Create a new user object
    const user: CreateUserParams = {
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: firstName,
      lastName: lastName,
      username: username!,
      photo: image_url,
    };

    // Save the user to the database
    const newUser = await createUser(user);
    console.log("newUser", { newUser, userId: newUser._id });

    // Normally, we should use types from the package to avoid any issues
    // but @clerk/types is not update-to-date with the actual API
    const updateData: any = {};

    if (newUser) {
      updateData.publicMetadata = {
        userId: newUser._id,
      };
    }

    if (!first_name) {
      updateData.firstName = firstName;
    }

    if (!last_name) {
      updateData.lastName = lastName;
    }

    console.log("updateData - ", updateData);

    if (Object.keys(updateData).length > 0) {
      await clerkClient.users.updateUser(id, updateData);
    }

    return NextResponse.json({ message: "OK", user: newUser });
  } else if (eventType === "user.updated") {
    const { id, first_name, last_name, username, image_url } = event.data;

    // Create a new user object
    const user: UpdateUserParams = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    // Save the user to the database
    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  } else if (eventType === "user.deleted") {
    const { id } = event.data;

    // Save the user to the database
    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
