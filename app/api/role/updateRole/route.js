import User from "@/app/models/User";
import { connectToDatabase } from "@/app/utils/connectToDatabase";

export async function PATCH(req) {
  try {
    console.log("Updating user role...");

    // Parse the request body
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return new Response(
        JSON.stringify({ message: "User ID and role are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find and update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
