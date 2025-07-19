// app/api/3ds/start-html/route.ts
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pendingPurchaseId = req.nextUrl.searchParams.get("id");

  if (!pendingPurchaseId) {
    return new NextResponse("Missing pending purchase id", { status: 400 });
  }

  const tokenization = await fetchQuery(api.tokenization.getTokenization, {
    pendingPurchaseId: pendingPurchaseId as Id<"pendingPurchases">,
  });

  if (!tokenization) {
    return new NextResponse("No tokenization found", { status: 404 });
  }

  //   const html = `
  //     <html>
  //       <body>
  //         <form id="fingerprintdevice" action="https://powertranztestframeworkdsacssimulator.azurewebsites.net/acs/fingerprint" method="POST">
  //           <input type="hidden" name="threeDSMethodData" value="${tokenization.redirectData}" />
  //         </form>
  //         <script>
  //           document.getElementById('fingerprintdevice').submit();
  //         </script>
  //       </body>
  //     </html>
  //   `;

  return new NextResponse(tokenization.redirectData, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
