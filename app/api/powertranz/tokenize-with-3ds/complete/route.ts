import { NextResponse } from "next/server";

// app/api/3ds/tokenize/complete/route.ts
export async function POST(req: Request) {
  const result = await req.json();

  const spiToken = result?.SpiToken;
  // Optionally validate risk/3ds status here...
  // Save the tokenized card in DB or session
  // You could also POST this to another internal endpoint

  // Redirect to returnTo param
  const url = new URL(req.url!);
  const returnTo = url.searchParams.get("returnTo") || "/checkout";

  return NextResponse.redirect(returnTo); // or render success page with client-side redirection
}
