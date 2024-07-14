import { NextResponse } from "next/server";

import { ImageModel } from "@/models";
import { connectToDB } from "@/lib/mongodb";
import { replicate } from "@/lib/replicate";

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = body.prompt;

  try {
    const res: any = await replicate.run(
      "prompthero/openjourney:ad59ca21177f9e217b9075e7300cf6e14f7e5b4505b87b9689dbd866e9768969",
      {
        input: {
          prompt,
        },
      }
    );

    const imageUrl = res.join("");

    await connectToDB();

    const imageDoc = await ImageModel.create({ imageUrl, prompt });

    if (!imageDoc) {
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Image generated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectToDB();

  const images = await ImageModel.find().sort({ createdAt: -1 }).limit(10);

  return NextResponse.json({ images }, { status: 200 });
}
