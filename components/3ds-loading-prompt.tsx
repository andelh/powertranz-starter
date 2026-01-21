import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postMessageSafely } from "@/lib/utils";
import { ThreeDSCompleteData } from "./auth-capture-form";

type ThreeDSLoadingPromptProps = {
  iframeHtml: string;
  onComplete?: (result: {
    success: boolean;
    data?: ThreeDSCompleteData;
    error?: any;
  }) => void;
  onPageChange?: (url: string) => void; // New prop for page navigation
  targetUrl?: string; // URL to watch for
};

export default function ThreeDSLoadingPrompt({
  iframeHtml,
  onComplete,
  onPageChange,
  targetUrl,
}: ThreeDSLoadingPromptProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  // Origin validation for security
  const isValidOrigin = (origin: string): boolean => {
    const allowedOrigins = [
      // Your domains
      // TODO: Add your domains here,

      "http://localhost:3000",
      "http://localhost:3001",
      // Add your payment processor domains
      "powertranz.com",
      "your-payment-processor.com",
    ];

    return allowedOrigins.some((allowed) =>
      origin.includes(allowed.replace("https://", "").replace("http://", ""))
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("3DS iframe message:", event.data);

      // Validate origin if in production
      if (
        process.env.NODE_ENV === "production" &&
        !isValidOrigin(event.origin)
      ) {
        console.warn("Blocked message from unauthorized origin:", event.origin);
        return;
      }

      if (event.data && typeof event.data === "object") {
        switch (event.data.type) {
          case "3ds-complete":
            if (event.data.status === "success") {
              console.log("3DS successful:", event.data);
              if (onComplete) {
                onComplete({ success: true, data: event.data });
              }

              // Navigate to appropriate success page
              // setTimeout(() => {
              //     router.push(
              //       `/checkout/complete?isSuccess=1&order_id=${event.data.orderId}&transactionIdentifier=${event.data.transactionIdentifier}`,
              //     );
              // }, 1000);
            }
            break;

          case "3ds-error":
            console.log("3DS failed:", event.data);
            if (onComplete) {
              onComplete({ success: false, error: event.data });
            }

            // Forward error to parent embed
            if (window.top && window.top !== window.parent) {
              postMessageSafely(window.top, {
                type: "CHECKOUT_ERROR",
                status: "error",
                error: event.data.responseMessage || event.data.errors,
                timestamp: Date.now(),
              });
            }

            // Navigate to error page
            setTimeout(() => {
              router.push(
                `/checkout/complete?isSuccess=0&responseMessage=${encodeURIComponent(
                  event.data.responseMessage || "Payment failed"
                )}`
              );
            }, 1000);
            break;

          case "page-loaded":
          case "navigation":
            console.log(
              "3DS iframe navigated to:",
              event.data.url || event.data.page
            );

            if (onPageChange) {
              onPageChange(event.data.url || event.data.page);
            }

            // Check if it's a specific page we're watching for
            if (
              targetUrl &&
              event.data.url &&
              event.data.url.includes(targetUrl)
            ) {
              console.log("3DS iframe landed on target page:", targetUrl);
            }

            // Forward navigation info to parent embed
            // if (window.top && window.top !== window.parent) {
            //   postMessageSafely(window.top, {
            //     type: "3DS_NAVIGATION",
            //     url: event.data.url || event.data.page,
            //     timestamp: Date.now(),
            //   });
            // }
            break;

          default:
            console.log("Unknown 3DS message type:", event.data.type);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete, onPageChange, targetUrl, router]);

  // Approach 4: Add navigation monitoring script to iframe content
  const enhancedIframeHtml = iframeHtml.replace(
    "</head>",
    `
    <script>
      // Monitor navigation within the iframe and send messages to parent
      (function() {
        let currentUrl = window.location.href;
        
        // Send initial page load message
        window.parent.postMessage({
          type: 'page-loaded',
          url: currentUrl,
          timestamp: Date.now()
        }, '*');

        // Monitor for URL changes (for SPAs)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
          originalPushState.apply(history, arguments);
          const newUrl = window.location.href;
          if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            window.parent.postMessage({
              type: 'navigation',
              url: newUrl,
              timestamp: Date.now()
            }, '*');
          }
        };
        
        history.replaceState = function() {
          originalReplaceState.apply(history, arguments);
          const newUrl = window.location.href;
          if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            window.parent.postMessage({
              type: 'navigation',
              url: newUrl,
              timestamp: Date.now()
            }, '*');
          }
        };

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', function() {
          const newUrl = window.location.href;
          if (newUrl !== currentUrl) {
            currentUrl = newUrl;
            window.parent.postMessage({
              type: 'navigation',
              url: newUrl,
              timestamp: Date.now()
            }, '*');
          }
        });
        
        // Auto-detect common completion scenarios
        const checkForCompletion = () => {
          const url = window.location.href;
          const params = new URLSearchParams(window.location.search);
          
          // Check for success indicators
          if (url.includes('/complete') || url.includes('/success') || 
              params.get('success') === 'true' || params.get('isSuccess') === '1') {
            window.parent.postMessage({
              type: '3ds-complete',
              status: 'success',
              url: url,
              timestamp: Date.now()
            }, '*');
          }
          
          // Check for error indicators
          if (url.includes('/error') || url.includes('/fail') || 
              params.get('success') === 'false' || params.get('isSuccess') === '0') {
            window.parent.postMessage({
              type: '3ds-error',
              status: 'error',
              url: url,
              responseMessage: params.get('responseMessage') || 'Payment failed',
              timestamp: Date.now()
            }, '*');
          }
        };
        
        // Check immediately and on URL changes
        checkForCompletion();
        window.addEventListener('load', checkForCompletion);
      })();
    </script>
    </head>`
  );

  return (
    <Dialog onOpenChange={(open) => {}} open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-1 text-2xl font-semibold leading-6 ">
            <div className="flex animate-pulse flex-row items-center justify-between gap-2">
              Processing your order...{" "}
              <Loader2 className="mr-4 h-6 w-6 animate-spin text-primary" />
            </div>
          </DialogTitle>
          <DialogDescription>
            Please do not refresh the page. If prompted, please complete the
            security confirmation below.
          </DialogDescription>
        </DialogHeader>
        <div className="relative transition-all ease-out will-change-transform">
          <iframe
            ref={iframeRef}
            srcDoc={enhancedIframeHtml}
            title="fac_form"
            id="fac_form"
            className="bg-background"
            onError={(error) => {
              console.error("3DS iframe error:", error);
              // Notify parent of iframe error
              if (window.top && window.top !== window.parent) {
                postMessageSafely(window.top, {
                  type: "CHECKOUT_ERROR",
                  status: "error",
                  error: "3DS iframe failed to load",
                  timestamp: Date.now(),
                });
              }
            }}
            name="fac_form"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            referrerPolicy="no-referrer-when-downgrade"
            frameBorder="0"
            style={{
              height: "40vh",
              width: "100%",
              zIndex: 1,
              position: "relative",
              // backgroundColor: "white",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
