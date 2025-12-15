import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Hyperparameters, TrainingLog } from '../types';
import { CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  params: Hyperparameters;
  onComplete: () => void;
}

export const TrainingVisualizer: React.FC<Props> = ({ params, onComplete }) => {
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let epoch = 0;
    // Simulate training loop
    const interval = setInterval(() => {
      epoch++;
      setCurrentEpoch(epoch);

      // Generate fake loss curve (exponential decay with noise)
      const baseLoss = 2.0 * Math.exp(-0.3 * epoch);
      const noise = (Math.random() - 0.5) * 0.1;
      const accuracy = 1 - (baseLoss / 3);

      const newLog: TrainingLog = {
        epoch,
        loss: Math.max(0.1, baseLoss + noise),
        accuracy: Math.min(0.99, Math.max(0, accuracy)),
      };

      setLogs(prev => [...prev, newLog]);

      if (epoch >= params.epochs) {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 800); // Update every 800ms

    return () => clearInterval(interval);
  }, [params.epochs]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-3">
          {isFinished ? (
            <>
              <CheckCircle className="text-green-500" size={32} />
              Huấn luyện Hoàn tất
            </>
          ) : (
            <>
              <Loader2 className="animate-spin text-blue-600" size={32} />
              Đang Huấn luyện mô hình...
            </>
          )}
        </h2>
        <p className="text-gray-600 mt-2">
          Epoch {currentEpoch} / {params.epochs}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Trạng thái hiện tại</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400">Loss (Hàm mất mát)</div>
                <div className="text-2xl font-mono font-bold text-gray-800">
                  {logs.length > 0 ? logs[logs.length - 1].loss.toFixed(4) : "---"}
                </div>
                <div className="text-xs text-gray-500 mt-1">Càng thấp càng tốt</div>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div>
                <div className="text-xs text-gray-400">Accuracy (Độ chính xác)</div>
                <div className="text-2xl font-mono font-bold text-green-600">
                  {logs.length > 0 ? (logs[logs.length - 1].accuracy * 100).toFixed(2) + '%' : "---"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
             Trong thực tế, quá trình này diễn ra trên máy chủ của Google Cloud. 
             Hàm Loss giảm dần biểu thị mô hình đang học cách dự đoán đúng output từ input.
          </div>
        </div>

        {/* Chart */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[350px]">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Biểu đồ Loss theo Epoch</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="epoch" 
                label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }} 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#2563eb' }}
                activeDot={{ r: 6 }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onComplete}
          disabled={!isFinished}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 disabled:opacity-0 disabled:pointer-events-none transition-all transform hover:scale-105"
        >
          Tiến tới Kiểm thử (Playground)
        </button>
      </div>
    </div>
  );
};