export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PowerTranz Payment Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This demo showcases PowerTranz payment integration capabilities
            including secure tokenization and payment capture functionality.
          </p>
        </div>

        {/* Demo Sections */}
        <div className="space-y-8">
          {/* Tokenization Demo Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🔐 Tokenization Demo
            </h2>
            <p className="text-gray-600 mb-6">
              Demonstrate secure payment tokenization including card
              tokenization and 3D Secure authentication flows.
            </p>
            <div className="bg-gray-100 rounded-md p-6 border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center">
                Tokenization demo components will be implemented here
              </p>
            </div>
          </div>

          {/* Payment Capture Demo Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              💳 Payment Capture Demo
            </h2>
            <p className="text-gray-600 mb-6">
              Demonstrate payment processing including authorization, capture,
              and refund operations.
            </p>
            <div className="bg-gray-100 rounded-md p-6 border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-center">
                Payment capture demo components will be implemented here
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>PowerTranz Integration Starter Template</p>
        </div>
      </div>
    </div>
  );
}
