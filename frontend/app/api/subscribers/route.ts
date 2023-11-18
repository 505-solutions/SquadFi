import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}


export async function GET(req: NextRequest, res: NextResponse) {
  const notifyApiSecret = process.env.NOTIFY_API_SECRET;
  if (!notifyApiSecret) {
    throw new Error("You need to provide NOTIFY_API_SECRET env variable");
  }

  if (req.method !== "GET") {
    throw new ReferenceError("Method not allowed");
  }

  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/subscribers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${notifyApiSecret}`,
        },
      }
    );

    const subscribers = await result.json(); // ["eip155:1:0xafeb...", "eip155:1:0xbcd..."]
    console.log("Notify Server response - get subscribers", subscribers);

    return NextResponse.json({ subscribers }, {status: result.status,});
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message ?? "Internal server error",
    }, {status: 500});
  }
}
  
