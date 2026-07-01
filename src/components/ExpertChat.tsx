import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";
import { Send, Sparkles, Copy, Check, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { callGeminiAPI } from "../utils/gemini";

export default function ExpertChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Kính chào quý Thầy/Cô! Tôi là **Trợ lý Vận hành và Chuyển đổi Số Giáo dục Google Workspace**.

Tôi ở đây để giúp quý Thầy/Cô thiết kế, xây dựng và sửa lỗi cho các công cụ số hóa tại tổ chuyên môn, ví dụ:
* 📝 **Google Forms**: Phiếu dự giờ 5512, Sổ báo giảng trực tuyến, khảo sát học sinh.
* 📊 **Google Sheets**: Thiết kế cấu trúc bảng dữ liệu học sinh, điểm số, chuyên đề khoa học.
* 💻 **Google Apps Script**: Viết code gửi email biên bản dự giờ tự động, gửi cảnh báo trễ báo giảng.
* 📈 **Looker Studio**: Trực quan hóa các KPI chuyên môn của tổ trên bảng hiển thị trực quan.

Thầy/Cô muốn thiết kế hay tối ưu quy trình nào hôm nay?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { text: "Viết Apps Script tự động gửi kết quả dự giờ qua email", icon: "📧" },
    { text: "Cơ sở dữ liệu Sổ báo giảng nên có các cột nào?", icon: "📅" },
    { text: "Làm cách nào vẽ biểu đồ KPI trên Looker Studio?", icon: "📊" },
    { text: "Quy trình PDCA số hóa đánh giá giáo án 5512", icon: "✅" }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }
    setError(null);

    const updatedMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const selectedModel = localStorage.getItem("GEMINI_SELECTED_MODEL") || "gemini-3-flash-preview";
      const reply = await callGeminiAPI(updatedMessages, selectedModel);
      
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      // Chuyển trạng thái cột đang chờ thành Đã dừng do lỗi không áp dụng trực tiếp ở UI này,
      // nhưng hiển thị thông báo lỗi màu đỏ như yêu cầu.
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderMarkdown = (text: string) => {
    return (
      <div className="prose prose-slate max-w-none text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3 mt-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-sm font-bold text-slate-900 mt-4 mb-2 border-l-3 border-indigo-500 pl-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xs font-bold text-slate-800 mt-3 mb-1" {...props} />,
            p: ({node, ...props}) => <p className="mb-3 text-slate-700 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-600" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-600" {...props} />,
            li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
            code: ({node, inline, className, children, ...props}: any) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative my-3 rounded-lg overflow-hidden border border-slate-200">
                  <div className="bg-slate-900 text-slate-400 px-3 py-1 text-[10px] font-mono flex justify-between items-center border-b border-slate-800">
                    <span>{match[1].toUpperCase()}</span>
                    <button
                      onClick={() => handleCopyMessage(String(children), -999)}
                      className="hover:text-slate-200 flex items-center gap-1 transition"
                    >
                      <Copy className="w-3 h-3" /> Sao chép
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-100 p-3 text-xs overflow-x-auto font-mono">
                    <code {...props}>{String(children).replace(/\n$/, '')}</code>
                  </pre>
                </div>
              ) : (
                <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
              );
            },
            table: ({node, ...props}) => <div className="overflow-x-auto my-3 rounded-lg border border-slate-200"><table className="w-full text-xs text-left border-collapse" {...props} /></div>,
            th: ({node, ...props}) => <th className="bg-slate-50 border-b border-slate-200 px-3 py-2 font-bold text-slate-700 uppercase" {...props} />,
            td: ({node, ...props}) => <td className="border-b border-slate-100 px-3 py-2 text-slate-600" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-indigo-500 pl-3 py-0.5 italic bg-indigo-50/40 text-indigo-950 my-3 rounded-r" {...props} />
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Chuyên Gia Tư Vấn Google Workspace</h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
              Sẵn sàng trợ giúp số hóa sư phạm
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Thầy/Cô có muốn xóa lịch sử cuộc trò chuyện?")) {
              setMessages([messages[0]]);
              setError(null);
            }
          }}
          className="text-xs text-slate-400 hover:text-slate-600 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Xóa trò chuyện
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, index) => {
          const isAI = msg.role === "assistant";
          return (
            <div key={index} className={`flex ${isAI ? "justify-start" : "justify-end"} items-start gap-3`}>
              {isAI && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-1 shadow-sm">
                  AI
                </div>
              )}
              <div className="max-w-[82%] relative group">
                <div className={`p-4 rounded-2xl shadow-2xs ${
                  isAI
                    ? "bg-white text-slate-800 border border-slate-100"
                    : "bg-indigo-600 text-white rounded-tr-xs"
                }`}>
                  {isAI ? renderMarkdown(msg.content) : <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                </div>

                {/* Copy helper */}
                {isAI && (
                  <button
                    onClick={() => handleCopyMessage(msg.content, index)}
                    className="absolute right-2 bottom-2 p-1 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition duration-200"
                    title="Sao chép câu trả lời"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-1 animate-pulse">
              AI
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-2 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đã xảy ra sự cố kết nối:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-150 shrink-0 bg-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý chủ đề hỏi AI:</p>
          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt.text);
                  handleSend(prompt.text);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Nhập nội dung hỏi Chuyên gia về Google Apps Script, Sheets, Forms, Looker Studio..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-xl px-5 flex items-center justify-center transition shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
