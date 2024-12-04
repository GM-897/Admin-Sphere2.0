import Role from "@/app/models/Role";
import { connectToDatabase } from "@/app/utils/connectToDatabase";

export async function GET(req) {
  try {
    await connectToDatabase();

    const roles = await Role.find().select("name -_id"); // Only fetch role names
    
    return new Response(JSON.stringify(roles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
