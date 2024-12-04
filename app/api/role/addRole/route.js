
import Role from "@/app/models/Role";
import { connectToDatabase } from "@/app/utils/connectToDatabase";

// Connect to the database
await connectToDatabase();

// POST handler for adding a new role
export async function POST(req) {
  try {
    // Parse the request body
    const { name, permissions } = await req.json();

    // Validate input
    if (!name || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions are required, and permissions must be an array.' },
        { status: 400 }
      );
    }

    // Check for duplicates (optional, depending on your use case)
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json(
        { error: `Role with name "${name}" already exists.` },
        { status: 409 }
      );
    }

    // Create and save the role
    const newRole = new Role({ name, permissions });
    await newRole.save();

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('Error adding role:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
