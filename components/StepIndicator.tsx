import React from 'react';
import { AppStep } from '../types';
import { BookOpen, Database, Sliders, Activity, MessageSquare } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
  setStep: (step: AppStep) => void;
  completedSteps: AppStep[];
}

const steps = [
  { id: AppStep.INTRODUCTION, label: 'Giới thiệu', icon: BookOpen },
  { id: AppStep.DATASET, label: 'Dữ liệu', icon: Database },
  { id: AppStep.PARAMETERS, label: 'Cấu hình', icon: Sliders },
  { id: AppStep.TRAINING, label: 'Huấn luyện', icon: Activity },
  { id: AppStep.PLAYGROUND, label: 'Kiểm thử', icon: MessageSquare },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, setStep, completedSteps }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-4 md:px-8">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = isCompleted || isActive;

          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${isClickable ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
              onClick={() => isClickable && setStep(step.id)}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : 
                  isCompleted ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 text-gray-400'}
              `}>
                <Icon size={20} />
              </div>
              <span className={`text-xs font-medium hidden md:block ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};