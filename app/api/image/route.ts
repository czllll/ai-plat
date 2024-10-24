import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const{prompt, amount = "1", resolution = "512x512"} = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }
        if(!openai.apiKey){
            return new NextResponse("OpenAI API Key not Configured", {status:500});
        }
        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400});
        }
        if (!amount) {
            return new NextResponse("Amout is required", { status: 400});
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400});
        }

        const response = await openai.images.generate({
            prompt:prompt,
            size:resolution,
            n:parseInt(amount,10),
        });

        return NextResponse.json(response.data)

    }catch(error) {
        console.log("[IMAGE_ERROR", error)
        return new NextResponse("Internal error", { status: 500});
    }
}