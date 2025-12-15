import React, { useState } from 'react';
import { TrainingExample } from '../types';
import { Trash2, Plus, RefreshCw, AlertCircle } from 'lucide-react';

interface DatasetEditorProps {
  dataset: TrainingExample[];
  setDataset: (data: TrainingExample[]) => void;
  onNext: () => void;
}

const DEFAULT_EXAMPLES: TrainingExample[] = [
  { text_input: "Phân loại cảm xúc: Tôi rất thích món ăn này.", output: "Tích cực" },
  { text_input: "Phân loại cảm xúc: Dịch vụ quá tệ hại.", output: "Tiêu cực" },
  { text_input: "Phân loại cảm xúc: Xe buýt đến muộn 15 phút.", output: "Tiêu cực" },
  { text_input: "Phân loại cảm xúc: Thời tiết hôm nay bình thường.", output: "Trung tính" },
  { text_input: "Phân loại cảm xúc: Bộ phim thật tuyệt vời và cảm động.", output: "Tích cực" },
];

export const DatasetEditor: React.FC<DatasetEditorProps> = ({ dataset, setDataset, onNext }) => {
  const [newInput, setNewInput] = useState('');
  const [newOutput, setNewOutput] = useState('');

  const addExample = () => {
    if (newInput.trim() && newOutput.trim()) {
      setDataset([...dataset, { text_input: newInput, output: newOutput }]);
      setNewInput('');
      setNewOutput('');
    }
  };

  const removeExample = (index: number) => {
    const newData = [...dataset];
    newData.splice(index, 1);
    setDataset(newData);
  };

  const resetToDefault = () => {
    setDataset(DEFAULT_EXAMPLES);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Fine-tuning (Tinh chỉnh) yêu cầu dữ liệu chất lượng cao. Dữ liệu thường ở định dạng JSONL, bao gồm cặp <strong>Input</strong> (đầu vào) và <strong>Output</strong> (đầu ra mong muốn). Ở đây, chúng ta sẽ tạo một tập dữ liệu nhỏ để dạy Gemini phân loại cảm xúc.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Tập dữ liệu huấn luyện ({dataset.length} mẫu)</h2>
          <button 
            onClick={resetToDefault}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={16} />
            Khôi phục mẫu
          </button>
        </div>

        <div className="p-0 max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output Mong Đợi</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Xóa</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataset.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{row.text_input}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono bg-gray-50/50">{row.output}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => removeExample(idx)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {dataset.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">
              Chưa có dữ liệu. Hãy thêm ví dụ bên dưới.
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-gray-700 mb-1">Input mới</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              placeholder="Ví dụ: Dịch vụ ở đây khá ổn"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-700 mb-1">Output mong đợi</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              placeholder="Ví dụ: Tích cực"
              value={newOutput}
              onChange={(e) => setNewOutput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addExample()}
            />
          </div>
          <div className="md:col-span-1">
            <button
              onClick={addExample}
              disabled={!newInput || !newOutput}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={dataset.length < 5}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
        >
          {dataset.length < 5 ? `Cần thêm ${5 - dataset.length} mẫu nữa` : 'Tiếp tục: Cấu hình'}
        </button>
      </div>
    </div>
  );
};