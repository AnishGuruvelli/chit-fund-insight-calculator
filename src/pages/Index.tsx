
import ChitFundCalculator from "@/components/ChitFundCalculator";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chit Fund IRR Calculator</h1>
          <p className="text-purple-700 max-w-md mx-auto">
            Calculate the Extended Internal Rate of Return (XIRR) of your chit fund investments
          </p>
        </div>
        
        <ChitFundCalculator />
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2023 Chit Fund IRR Calculator. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
