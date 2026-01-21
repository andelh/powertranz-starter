import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a UUID (v4)
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Iframe utilities
export function postMessageSafely(
  target: Window,
  message: any,
  origin: string = "*"
) {
  try {
    target.postMessage(message, origin);
  } catch (error) {
    console.warn("Failed to post message:", error);
  }
}

export function detectIframe() {
  if (typeof window === "undefined") return false;

  try {
    // Method 1: Compare window objects
    const inIframe = window.self !== window.top;

    // Method 2: Check for parent context
    const hasParent = window.parent !== window;

    // Method 3: Check frame element (most reliable for same-origin)
    const frameElement = window.frameElement;

    // Method 4: Check referrer
    const fromIframe =
      document.referrer !== "" && document.referrer !== window.location.href;

    console.log({
      inIframe,
      hasParent,
      frameElement: !!frameElement,
      fromIframe,
      referrer: document.referrer,
      location: window.location.href,
    });

    return inIframe || hasParent || !!frameElement;
  } catch (error) {
    // If we get a cross-origin error, we're likely in an iframe
    console.log("Cross-origin restriction detected - likely in iframe:", error);
    return true;
  }
}
