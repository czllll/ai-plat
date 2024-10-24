import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";


const replicate = new Replicate({
    auth:process.env.REPLICATE_API_TOKEN,
});


export async function POST(req: Request) {
    try {

        const {userId} = auth();
        const body = await req.json();
        const {prompt} = body;

        if (!process.env.REPLICATE_API_TOKEN) {
            return new NextResponse("Configuration error", { status: 500 });
        }
        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        }

        // 创建预测
        const prediction = await replicate.predictions.create({
            version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            input: {
                prompt
            }
        });

        let result = await replicate.predictions.get(prediction.id);
        
        while (result.status === 'processing' || result.status === 'starting') {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            result = await replicate.predictions.get(prediction.id);
        }


        if (result.error) {
            return new NextResponse(`Model error: ${result.error}`, { status: 500 });
        }

        return NextResponse.json(result.output);

    } catch (error) {
        console.error('Error:', error);
        return new NextResponse(
            `Internal error: ${error}`, 
            { status: 500 }
        );
    }
}