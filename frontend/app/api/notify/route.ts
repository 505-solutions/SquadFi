import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

export async function POST(
  req: Request,
) {
  const notifyApiSecret = process.env.NOTIFY_API_SECRET;
  if (!notifyApiSecret) {
    throw new Error("You need to provide NOTIFY_API_SECRET env variable");
  }

  if (req.method !== "POST") {
    throw new ReferenceError("Method not allowed");
  }

  const notificationPayload = await req.json();
  if (!notificationPayload) {
    return NextResponse.json({ success: false }, {status: 400});
  }
  const data =  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${notifyApiSecret}`,
    },
    body: JSON.stringify(notificationPayload),
  }
  try {
    const result = await fetch(
      `https://notify.walletconnect.com/${projectId}/notify`,
      data
    );

    const gmRes = await result.json(); // { "sent": ["eip155:1:0xafeb..."], "failed": [], "not_found": [] }
    console.log("Notify Server response - send notification", gmRes);
    const isSuccessfulGm = gmRes.sent?.includes(
      notificationPayload.accounts[0]
    );
    return NextResponse.json({ success: isSuccessfulGm, message: gmRes?.reason }, {status: result.status});
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message ?? "Internal server error" }, {status: 500}); 
  }
}