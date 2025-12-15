import React from 'react';
import { Hyperparameters as HyperparamsType } from '../types';
import { Info } from 'lucide-react';

interface Props {
  params: HyperparamsType;
  setParams: React.Dispatch<React.SetStateAction<HyperparamsType>>;
  onNext: () => void;
  onBack: () => void;
}

export const Hyperparameters: React.FC<Props> = ({ params, setParams, onNext, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Cấu hình Hyperparameters</h2>
        <p className="text-gray-600">Điều chỉnh các thông số để tối ưu hóa quá trình học của mô hình.</p>
      </div>

      <div className="grid gap-6">
        {/* Epochs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-800">Epochs</label>
              <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Số lần mô hình duyệt qua toàn bộ tập dữ liệu. Nhiều epoch quá có thể gây học vẹt (overfitting).
                </div>
              </div>
            </div>
            <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-1 rounded">{params.epochs}</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={params.epochs}
            onChange={(e) => setParams({ ...params, epochs: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        {/* Batch Size */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-800">Batch Size</label>
               <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Số lượng mẫu dữ liệu được xử lý cùng một lúc trước khi cập nhật mô hình.
                </div>
              </div>
            </div>
            <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-1 rounded">{params.batchSize}</span>
          </div>
          <div className="flex gap-2">
            {[4, 8, 16, 32].map((size) => (
              <button
                key={size}
                onClick={() => setParams({ ...params, batchSize: size })}
                className={`flex-1 py-2 rounded-lg border font-medium transition-all ${
                  params.batchSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-800">Learning Rate</label>
              <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Quyết định mức độ thay đổi của mô hình sau mỗi bước học. Quá cao: học không ổn định. Quá thấp: học rất chậm.
                </div>
              </div>
            </div>
            <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-1 rounded">{params.learningRate}</span>
          </div>
          <input
            type="range"
            min="0.0001"
            max="0.01"
            step="0.0001"
            value={params.learningRate}
            onChange={(e) => setParams({ ...params, learningRate: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>0.0001</span>
            <span>0.005</span>
            <span>0.01</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
        >
          Bắt đầu Huấn Luyện
        </button>
      </div>
    </div>
  );
};