import { CreditCardForm } from "@/components/credit-card-form";
import { Button } from "@/components/ui/button";
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
            <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">
                  A starter kit for integrating{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PowerTranz
                  </span>{" "}
                  payments into your full-stack application.
                </h1>

                <p className="font-mono text-lg leading-normal text-muted-foreground max-w-lg">
                  shadcn/ui style reusable code and hooks for PowerTranz
                  payments.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button size="lg" className="text-base px-8">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8">
                  <span>+</span>
                  <span className="ml-2">View Documentation</span>
                </Button>
              </div>

              {/* Features */}
              <div className="pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Secure tokenization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>3D Secure support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Real-time processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Complete API coverage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Terminal Demo */}
            <div className="flex justify-center lg:justify-end">
              <Terminal className="shadow-2xl">
                <TypingAnimation>
                  npx shadcn@latest add @powertranz/payment-hooks
                </TypingAnimation>
                <AnimatedSpan className="text-green-400">
                  √ Checking registry.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-400">
                  √ Installing dependencies.
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-400">
                  ℹ Created 17 files:
                </AnimatedSpan>
                <div className="pl-4 grid gap-y-1 text-muted-foreground">
                  <AnimatedSpan className="text-muted-foreground">
                    - lib/powertranz/types.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - lib/powertranz/client.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - lib/powertranz/index.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - lib/powertranz/utils.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - hooks/use-powertranz.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - components/powertranz-iframe.tsx
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - app/api/powertranz/tokenize/route.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - app/api/powertranz/auth/route.ts
                  </AnimatedSpan>
                  <AnimatedSpan className="text-muted-foreground">
                    - ...and 9 more API routes
                  </AnimatedSpan>
                </div>
                <AnimatedSpan className="text-green-400 mt-2">
                  √ Installation complete!
                </AnimatedSpan>
                <AnimatedSpan className="text-yellow-400">
                  ℹ Run yarn dev to start building.
                </AnimatedSpan>
              </Terminal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
