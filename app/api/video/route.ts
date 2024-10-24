import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";


const replicate = new Replicate({
    auth:process.env.REPLICATE_API_TOKEN,
});


export async function POST(req:Request) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const {prompt} = body;

        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error(
              'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
            );
          }

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        if(!prompt){
            return new NextResponse("Prompt is required", {status:400});
        }
        
        const output = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
              input: {
                fps: 8,
                model: "xl",
                width: 576,
                height: 320,
                prompt: "An astronaut riding a horse",
                batch_size: 1,
                num_frames: 24,
                init_weight: 0.5,
                guidance_scale: 7.5,
                remove_watermark: false,
                num_inference_steps: 50
              }
            }
          );
          console.log(output)
        return NextResponse.json(output);
    }catch(error){
        console.log("[Music_ERROR",error);
        return new NextResponse("Internal error",{status:500});
    }
}