
import ChitFundCalculator from "@/components/ChitFundCalculator";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-100 to-white flex flex-col justify-center items-center p-2">
      <div className="w-full max-w-md px-3 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chit Fund IRR Calculator</h1>
          <p className="text-purple-600 text-sm max-w-xs mx-auto">
            Calculate the Extended Internal Rate of Return (XIRR) of your chit fund investments
          </p>
        </div>
        
        <ChitFundCalculator />
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 Chit Fund IRR Calculator. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
