import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { DatasetEditor } from './components/DatasetEditor';
import { Hyperparameters } from './components/Hyperparameters';
import { TrainingVisualizer } from './components/TrainingVisualizer';
import { ModelPlayground } from './components/ModelPlayground';
import { AppStep, TrainingExample, Hyperparameters as HyperparamsType } from './types';
import { BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INTRODUCTION);
  const [completedSteps, setCompletedSteps] = useState<AppStep[]>([]);
  
  // App State
  const [dataset, setDataset] = useState<TrainingExample[]>([
    { text_input: "Phân loại cảm xúc: Tôi rất thích món ăn này.", output: "Tích cực" },
    { text_input: "Phân loại cảm xúc: Dịch vụ quá tệ hại.", output: "Tiêu cực" },
    { text_input: "Phân loại cảm xúc: Xe buýt đến muộn 15 phút.", output: "Tiêu cực" },
    { text_input: "Phân loại cảm xúc: Thời tiết hôm nay bình thường.", output: "Trung tính" },
    { text_input: "Phân loại cảm xúc: Bộ phim thật tuyệt vời.", output: "Tích cực" },
  ]);

  const [params, setParams] = useState<HyperparamsType>({
    epochs: 5,
    batchSize: 4,
    learningRate: 0.001
  });

  const handleCompleteStep = (step: AppStep, nextStep: AppStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setCurrentStep(nextStep);
  };

  const handleRestart = () => {
      setCurrentStep(AppStep.INTRODUCTION);
      setCompletedSteps([]);
  };

  const renderContent = () => {
    switch (currentStep) {
      case AppStep.INTRODUCTION:
        return (
          <div className="max-w-3xl mx-auto p-8 text-center space-y-8 animate-fade-in mt-10">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit size={48} className="text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Học Fine-tuning Gemini
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chào mừng! Ứng dụng này sẽ hướng dẫn bạn quy trình tinh chỉnh một mô hình ngôn ngữ lớn. 
              Bạn sẽ trải qua các bước từ chuẩn bị dữ liệu, cấu hình tham số, quan sát quá trình huấn luyện giả lập, 
              và cuối cùng là kiểm thử mô hình do chính bạn tạo ra.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800">Tại sao cần Fine-tune?</h3>
                    <p className="text-sm text-gray-600 mt-2">Để dạy mô hình một định dạng output cụ thể, giọng văn đặc biệt, hoặc kiến thức chuyên ngành mà mô hình gốc chưa biết.</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800">Quy trình là gì?</h3>
                    <p className="text-sm text-gray-600 mt-2">1. Thu thập dữ liệu (Input/Output)<br/>2. Chạy huấn luyện (Training)<br/>3. Sử dụng mô hình mới.</p>
                </div>
            </div>
            <button
              onClick={() => handleCompleteStep(AppStep.INTRODUCTION, AppStep.DATASET)}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Bắt đầu ngay
            </button>
          </div>
        );

      case AppStep.DATASET:
        return (
          <DatasetEditor 
            dataset={dataset} 
            setDataset={setDataset} 
            onNext={() => handleCompleteStep(AppStep.DATASET, AppStep.PARAMETERS)} 
          />
        );

      case AppStep.PARAMETERS:
        return (
          <Hyperparameters 
            params={params} 
            setParams={setParams} 
            onNext={() => handleCompleteStep(AppStep.PARAMETERS, AppStep.TRAINING)}
            onBack={() => setCurrentStep(AppStep.DATASET)}
          />
        );

      case AppStep.TRAINING:
        return (
          <TrainingVisualizer 
            params={params}
            onComplete={() => handleCompleteStep(AppStep.TRAINING, AppStep.PLAYGROUND)}
          />
        );

      case AppStep.PLAYGROUND:
        return (
          <ModelPlayground dataset={dataset} onRestart={handleRestart} />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-blue-600" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">Gemini Tuner Lab</span>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Simulated Environment
          </div>
        </div>
      </header>
      
      <StepIndicator 
        currentStep={currentStep} 
        setStep={(step) => {
            // Only allow navigation to completed steps or current step
            if (completedSteps.includes(step) || step === currentStep) {
                setCurrentStep(step);
            }
        }}
        completedSteps={completedSteps}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Ứng dụng này sử dụng Google Gemini API để mô phỏng quá trình Fine-tuning.</p>
          <p className="mt-1">Dành cho mục đích giáo dục.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;