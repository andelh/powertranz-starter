import { CreditCardForm } from "@/components/credit-card-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background ">
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

            {/* Right Side - Credit Card Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <CreditCardForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      {/* <div className="border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need for payment processing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From tokenization to capture, refunds to reconciliation -
              PowerTranz provides all the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold">Secure Tokenization</h3>
              <p className="text-muted-foreground">
                Convert sensitive card data into secure tokens for safe storage
                and processing.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Instant Processing</h3>
              <p className="text-muted-foreground">
                Process payments in real-time with our high-performance
                infrastructure.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold">3D Secure</h3>
              <p className="text-muted-foreground">
                Enhanced security with 3D Secure authentication for card
                transactions.
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
