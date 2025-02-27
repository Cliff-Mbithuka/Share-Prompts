//Get(read)
import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    if (!params?.id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt not found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all Prompts", { status: 500 });
  }
};
// Patch (update)
export const PATCH = async (request, context) => {

  const { prompt, tag } = await request.json();
  
  try {
    await connectToDB();
    const { params } = context;

    if (!params?.id) return new Response("Invalid request", { status: 400 });

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt)
      return new Response("Prompt not found", { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response("Successfully updated the Prompt", { status: 200 });
  } catch (error) {
   
    return new Response("Failed to update the Prompt", { status: 500 });
  }
};

// Delete (delete)
// export const DELETE = async (request, context) => {
//   try {

//     await connectToDB();
//     const { params } = context;

//     if (!params?.id) return new Response("Invalid request", { status: 400 });

//     await Prompt.findByIdAndDelete(params.id);

//     return new Response("Prompt deleted successfully", { status: 200 });
//   } catch (error) {
//     return new Response("Failed to delete the Prompt", { status: 500 });
//   }
// };
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Check if the id is provided
    if (!params?.id) {
      return new Response("Invalid request", { status: 400 });
    }

    // Proceed with deleting the prompt
    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete the Prompt", { status: 500 });
  }
};