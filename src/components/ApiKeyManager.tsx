import React, { useState, useEffect } from "react";
import { Key, AlertTriangle, Settings, ExternalLink } from "lucide-react";

export const MODELS = [
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash", desc: "Nhanh, mặc định" },
  { id: "gemini-3-pro-preview", name: "Gemini 3 Pro", desc: "Chuyên sâu, logic phức tạp" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "Dự phòng tốc độ cao" },
];

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("GEMINI_API_KEY");
    const model = localStorage.getItem("GEMINI_SELECTED_MODEL");
    if (key) setApiKeyState(key);
    else setShowModal(true); // Bắt buộc nhập nếu chưa có

    if (model) setSelectedModel(model);
    else localStorage.setItem("GEMINI_SELECTED_MODEL", MODELS[0].id);
  }, []);

  const saveSettings = (key: string, model: string) => {
    localStorage.setItem("GEMINI_API_KEY", key);
    localStorage.setItem("GEMINI_SELECTED_MODEL", model);
    setApiKeyState(key);
    setSelectedModel(model);
    setShowModal(false);
  };

  return { apiKey, selectedModel, showModal, setShowModal, saveSettings };
}

interface ApiKeyManagerProps {
  show: boolean;
  onClose: () => void;
  onSave: (key: string, model: string) => void;
  initialKey: string;
  initialModel: string;
  isForce?: boolean; // Bắt buộc nhập
}

export default function ApiKeyManager({ show, onClose, onSave, initialKey, initialModel, isForce }: ApiKeyManagerProps) {
  const [keyInput, setKeyInput] = useState(initialKey);
  const [modelInput, setModelInput] = useState(initialModel);

  useEffect(() => {
    if (show) {
      setKeyInput(initialKey || localStorage.getItem("GEMINI_API_KEY") || "");
      setModelInput(initialModel || localStorage.getItem("GEMINI_SELECTED_MODEL") || MODELS[0].id);
    }
  }, [show, initialKey, initialModel]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return alert("Vui lòng nhập API Key!");
    onSave(keyInput.trim(), modelInput);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Thiết lập Hệ thống AI</h2>
            <p className="text-xs text-slate-500">Cấu hình API Key và Model xử lý chính</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                Lấy Key tại AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                placeholder="AIzaSyB..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
              Key được lưu trữ an toàn trong trình duyệt của bạn (localStorage) và không gửi tới bất kỳ máy chủ nào ngoài Google.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">Chọn Model AI Ưu Tiên (Cards)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODELS.map(m => (
                <div 
                  key={m.id}
                  onClick={() => setModelInput(m.id)}
                  className={\`cursor-pointer border rounded-xl p-3 text-left transition relative overflow-hidden \${
                    modelInput === m.id 
                      ? "border-indigo-500 bg-indigo-50 shadow-sm" 
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }\`}
                >
                  {modelInput === m.id && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 rounded-bl-full flex items-start justify-end p-1.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full mt-0.5 mr-0.5" />
                    </div>
                  )}
                  <h4 className={\`text-xs font-bold mb-1 \${modelInput === m.id ? "text-indigo-700" : "text-slate-700"}\`}>{m.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            {!isForce && (
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Đóng
              </button>
            )}
            <button 
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20"
            >
              Lưu cấu hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
