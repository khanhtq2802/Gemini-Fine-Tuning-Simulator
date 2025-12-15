import React, { useState, useRef, useEffect } from 'react';
import { generateBaseResponse, generateTunedSimulationResponse } from '../services/geminiService';
import { TrainingExample, ChatMessage, ModelType } from '../types';
import { Send, Bot, User, Sparkles, RefreshCcw } from 'lucide-react';

interface Props {
  dataset: TrainingExample[];
  onRestart: () => void;
}

export const ModelPlayground: React.FC<Props> = ({ dataset, onRestart }) => {
  const [modelType, setModelType] = useState<ModelType>(ModelType.TUNED);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      role: 'model',
      text: 'Chào bạn! Tôi là mô hình Gemini. Bạn có thể chuyển đổi giữa "Base Model" (Mô hình gốc) và "Fine-tuned Model" (Đã tinh chỉnh) để thấy sự khác biệt. Hãy thử nhập một câu để tôi phân loại cảm xúc nhé!'
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    let responseText = '';
    
    if (modelType === ModelType.BASE) {
      responseText = await generateBaseResponse(userMsg);
    } else {
      responseText = await generateTunedSimulationResponse(userMsg, dataset);
    }

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] max-h-[800px] flex flex-col md:flex-row gap-4 p-4 animate-fade-in">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-64 flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800">Chọn Mô hình</h3>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setModelType(ModelType.BASE)}
            className={`p-3 rounded-lg text-left transition-all border ${
              modelType === ModelType.BASE 
              ? 'bg-gray-100 border-gray-400 font-medium' 
              : 'hover:bg-gray-50 border-transparent'
            }`}
          >
            <div className="text-sm text-gray-500">Mô hình Gốc</div>
            <div className="text-gray-900">Gemini Flash (Base)</div>
          </button>

          <button
            onClick={() => setModelType(ModelType.TUNED)}
            className={`p-3 rounded-lg text-left transition-all border relative overflow-hidden ${
              modelType === ModelType.TUNED 
              ? 'bg-blue-50 border-blue-400 font-medium' 
              : 'hover:bg-gray-50 border-transparent'
            }`}
          >
            <div className="text-sm text-blue-600">Đã tinh chỉnh</div>
            <div className="text-blue-900 flex items-center gap-2">
              Gemini Tuned <Sparkles size={14} className="text-yellow-500" />
            </div>
            {modelType === ModelType.TUNED && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-blue-200/50 rounded-bl-full pointer-events-none"></div>
            )}
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Dữ liệu đã học</h4>
            <div className="text-xs text-gray-600 max-h-40 overflow-y-auto space-y-2">
                {dataset.slice(0, 3).map((d, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded">
                        <div className="font-medium text-gray-800 truncate">In: {d.text_input}</div>
                        <div className="text-blue-600 truncate">Out: {d.output}</div>
                    </div>
                ))}
                {dataset.length > 3 && <div className="text-center italic text-gray-400">... và {dataset.length - 3} mẫu khác</div>}
            </div>
        </div>
        
        <button 
            onClick={onRestart}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
        >
            <RefreshCcw size={14} /> Bắt đầu lại
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 flex items-center gap-2">
           {modelType === ModelType.BASE ? 'Gemini 2.5 Flash' : 'Gemini Tuned Model'}
           {modelType === ModelType.TUNED && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Active</span>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-800' : 'bg-blue-600'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                </div>
                <div className={`p-3 rounded-lg text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gray-800 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="flex gap-3 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                   <Bot size={16} className="text-white" />
                 </div>
                 <div className="p-3 bg-white border border-gray-200 rounded-lg rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={modelType === ModelType.TUNED ? "Thử nhập: 'Phân loại: Đồ ăn ở đây dở quá'" : "Nhập tin nhắn..."}
              className="flex-1 p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};