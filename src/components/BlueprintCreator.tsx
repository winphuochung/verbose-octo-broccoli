import React, { useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { BlueprintParams } from "../types";
import { FileCode2, Copy, Download, Sparkles, Check, ChevronRight, GraduationCap, Library, Target } from "lucide-react";
import { callGeminiAPI } from "../utils/gemini";

export default function BlueprintCreator() {
  const [params, setParams] = useState<BlueprintParams>({
    schoolLevel: "Trung học Phổ thông (THPT)",
    department: "Toán - Tin học",
    primaryGoal: "Tự động hóa số hóa sổ báo giảng và quản lý nhận xét dự giờ giáo viên theo Công văn 5512."
  });

  const [blueprint, setBlueprint] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedInstruction, setCopiedInstruction] = useState<boolean>(false);
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"system-instruction" | "dynamic-blueprint">("system-instruction");

  const SYSTEM_INSTRUCTION_CONTENT = `# Custom System Instruction: Chuyên gia Triển khai và Vận hành Hệ thống Điều hành Giáo dục Google Workspace

## 1. Role
Bạn là một bot AI chuyên gia đóng vai trò là Trợ lý Triển khai và Vận hành Hệ thống Điều hành Giáo dục thông minh cho Tổ liên chuyên môn tại các trường phổ thông (GDPT 2018). Bạn am hiểu sâu sắc về kiến trúc giải pháp Google Workspace, quy trình PDCA, và cách xây dựng các giải pháp số hóa không mã/thấp mã (No-code/Low-code) để tối ưu hiệu suất dạy và học.

## 2. Objective
Mục tiêu cốt lõi của bạn là hỗ trợ các Tổ trưởng chuyên môn, giáo viên số hóa toàn bộ quy trình hành chính, quản trị học thuật, và quản lý chất lượng dạy học. Bạn sẽ chuyển đổi các tài liệu, quy trình giấy tờ thủ công thành các giải pháp tự động, có cấu trúc dữ liệu rõ ràng, liên kết chặt chẽ với nhau thông qua hệ sinh thái Google Workspace (Forms, Sheets, Apps Script, Looker Studio, Sites, Drive).

## 3. Guidelines & Rules
1. **Định hướng Google Workspace**: Mọi giải pháp đề xuất phải sử dụng 100% tài nguyên Google Workspace. Tránh sử dụng bất kỳ bên thứ ba trả phí nào ngoài hệ sinh thái Google.
2. **Tư duy dữ liệu (Data-driven)**: Hướng dẫn người dùng xây dựng các Google Sheet đóng vai trò là "Cơ sở dữ liệu có cấu trúc" (Relational-like). Luôn xác định rõ các cột (Trường dữ liệu), kiểu dữ liệu (text, date, number), và khóa liên kết giữa các bảng.
3. **Tập trung vào chu trình PDCA**:
   - **Plan**: Thiết lập các biểu mẫu kế hoạch, phân công nhiệm vụ lưu trữ trên Google Drive/Sites.
   - **Do**: Biểu mẫu biểu giảng, nhận xét, dự giờ bằng Google Forms.
   - **Check**: Trực quan hóa tiến độ hoàn thành, chất lượng bài dạy qua Looker Studio.
   - **Act**: Thiết lập Apps Script để tự động nhắc nhở, gửi báo cáo cải tiến liên tục.
4. **Tự động hóa bằng Google Apps Script**: Khi người dùng yêu cầu các luồng tự động (gửi email, tạo biên bản PDF, đồng bộ dữ liệu), hãy cung cấp mã nguồn Google Apps Script chuẩn, được chú thích tiếng Việt rõ ràng, dễ hiểu, xử lý ngoại lệ đầy đủ và có hướng dẫn copy-paste chi tiết.
5. **GDPT 2018**: Thiết kế các biểu mẫu dự giờ, đánh giá kế hoạch bài dạy phải tuân thủ nghiêm ngặt các Thông tư, Công văn hướng dẫn hiện hành của Bộ Giáo dục & Đào tạo (ví dụ: Công văn 5512/BGDĐT, Thông tư 22/2021/BGDĐT).
6. **Rõ ràng và khả thi**: Không đưa ra hướng dẫn chung chung. Hãy cung cấp từng bước chi tiết (Bước 1: Tạo Form gì, Bước 2: Liên kết Sheet như thế nào, Bước 3: Cấu hình Apps Script ra sao).

## 4. Tone & Persona
- **Chuyên nghiệp và Đồng hành**: Ngôn từ chuẩn mực, tôn trọng, thấu hiểu khó khăn của giáo viên khi tiếp cận công nghệ.
- **Mạch lạc và sư phạm**: Trình bày thông tin dễ hiểu, có ví dụ minh họa trực quan, sử dụng định dạng Markdown phong phú (bảng biểu, codeblock, danh sách gạch đầu dòng).
- **Thực chiến**: Ưu tiên giải pháp thực tiễn làm được ngay, giảm tải tối đa gánh nặng hành chính cho thầy cô.

## 5. Output Format
Khi trả lời bất kỳ yêu cầu thiết kế giải pháp nào, bạn phải tuân thủ cấu trúc sau:
- **Tên giải pháp**: Tên rõ ràng, trực diện.
- **Mô tả quy trình**: Giải thích luồng dữ liệu chạy từ đâu đến đâu.
- **Cấu trúc Dữ liệu (Bảng dữ liệu mẫu)**: Danh sách các trường cần thiết trên Google Sheets.
- **Hướng dẫn Thiết lập từng bước**: Các thao tác kéo thả, liên kết công cụ.
- **Mã nguồn Apps Script (nếu có)**: Code hoàn chỉnh, sạch, có comment tiếng Việt.
- **Mẫu báo cáo Looker Studio (nếu có)**: Hướng dẫn các biểu đồ cần vẽ trên Looker Studio.`;

  const handleGenerate = async () => {
    setLoading(true);
    setBlueprint("");
    try {
      const prompt = \`Hãy thiết kế một đề án/phương án "Trung tâm điều hành thông minh" (Smart Operations Center) chi tiết cho:
- **Cấp học**: \${params.schoolLevel}
- **Tổ chuyên môn**: \${params.department}
- **Mục tiêu ưu tiên**: \${params.primaryGoal}

Yêu cầu: Viết hoàn toàn bằng tiếng Việt, trình bày thật chi tiết, trực quan bằng Markdown với các bảng dữ liệu mẫu, công thức Google Sheets, và quy trình kết nối Forms -> Sheets -> Apps Script -> Looker Studio theo chu trình PDCA.\`;

      const selectedModel = localStorage.getItem("GEMINI_SELECTED_MODEL") || "gemini-3-flash-preview";
      const reply = await callGeminiAPI([{ role: "user", content: prompt }], selectedModel);
      
      setBlueprint(reply);
    } catch (err: any) {
      console.error(err);
      alert("Đã có lỗi xảy ra trong quá trình thiết lập đề án: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMarkdown = (text: string) => {
    return (
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl md:text-2xl font-bold text-slate-950 border-b border-slate-100 pb-3 mb-6 mt-8 font-sans" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-6 mb-4 border-l-4 border-indigo-500 pl-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base md:text-lg font-bold text-slate-800 mt-5 mb-3" {...props} />,
            p: ({node, ...props}) => <p className="text-sm text-slate-600 leading-relaxed mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-5 space-y-2 text-sm text-slate-600" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-5 space-y-2 text-sm text-slate-600" {...props} />,
            li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
            code: ({node, inline, className, children, ...props}: any) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative my-5 rounded-xl overflow-hidden border border-slate-200">
                  <div className="bg-slate-900 text-slate-400 px-4 py-1.5 text-xs font-mono flex justify-between items-center border-b border-slate-800">
                    <span>{match[1].toUpperCase()}</span>
                    <button
                      onClick={() => handleCopy(String(children), setCopiedBlueprint)}
                      className="hover:text-slate-200 flex items-center gap-1 transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
                    <code {...props}>{String(children).replace(/\n$/, '')}</code>
                  </pre>
                </div>
              ) : (
                <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
              );
            },
            table: ({node, ...props}) => <div className="overflow-x-auto my-5 rounded-xl border border-slate-200"><table className="w-full text-sm text-left border-collapse" {...props} /></div>,
            th: ({node, ...props}) => <th className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-slate-700 text-xs uppercase" {...props} />,
            td: ({node, ...props}) => <td className="border-b border-slate-100 px-4 py-3 text-slate-600 text-xs" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-50/40 text-indigo-900 my-5 rounded-r" {...props} />
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Switch Hub Mode tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("system-instruction")}
          className={`pb-3 text-sm font-semibold transition px-4 border-b-2 flex items-center gap-2 ${
            activeTab === "system-instruction"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          System Instruction Gốc của Bot AI
        </button>
        <button
          onClick={() => setActiveTab("dynamic-blueprint")}
          className={`pb-3 text-sm font-semibold transition px-4 border-b-2 flex items-center gap-2 ${
            activeTab === "dynamic-blueprint"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Trình Tạo Đề Án Số Hóa Thực Chiến
        </button>
      </div>

      {activeTab === "system-instruction" ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Mục đích của System Instruction này:</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Đây là bản <strong>System Instruction chuẩn mực, chuyên nghiệp</strong> được thiết kế dựa trên phân tích nghiệp vụ sư phạm sâu sắc. 
              Bạn có thể sao chép hoặc tải tệp tin cấu hình này về để cài đặt trực tiếp vào bất kỳ hệ thống chatbot AI nào (ví dụ: Google AI Studio, Custom GPT, Dify, v.v.) 
              để biến AI đó thành một Chuyên gia tư vấn số hóa giáo dục thực chiến cho tổ chuyên môn của bạn.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleCopy(SYSTEM_INSTRUCTION_CONTENT, setCopiedInstruction)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
              >
                {copiedInstruction ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedInstruction ? "Đã sao chép!" : "Sao chép System Instruction"}
              </button>
              <button
                onClick={() => handleDownload(SYSTEM_INSTRUCTION_CONTENT, "custom-system-instruction.md")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Tải về tệp .MD
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-h-[500px] overflow-y-auto font-mono">
            {renderMarkdown(SYSTEM_INSTRUCTION_CONTENT)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Tham số thiết lập trường học
              </h3>

              {/* School Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Cấp Học (Phổ thông)
                </label>
                <select
                  value={params.schoolLevel}
                  onChange={(e) => setParams({ ...params, schoolLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option>Trung học Phổ thông (THPT)</option>
                  <option>Trung học Cơ sở (THCS)</option>
                  <option>Tiểu học</option>
                </select>
              </div>

              {/* Department Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Tên Tổ / Liên Tổ Chuyên Môn
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Library className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={params.department}
                    onChange={(e) => setParams({ ...params, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Ví dụ: Toán - Tin, Ngữ văn, Khoa học Tự nhiên"
                  />
                </div>
              </div>

              {/* Primary Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Mục tiêu Ưu tiên Số hóa
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3">
                    <Target className="w-4 h-4 text-slate-400" />
                  </span>
                  <textarea
                    rows={4}
                    value={params.primaryGoal}
                    onChange={(e) => setParams({ ...params, primaryGoal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                    placeholder="Mô tả công việc bạn muốn số hóa đầu tiên (ví dụ: thu thập dự giờ, theo dõi nộp giáo án, báo giảng...)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-xs"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang thiết kế đề án chuyên sâu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tạo Đề Án Số Hóa Chi Tiết
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Right Column */}
          <div className="lg:col-span-7">
            {blueprint ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Đề án Số hóa Chuyên môn Hoàn tất</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Đã tối ưu hóa dựa trên thông tin trường của bạn</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(blueprint, setCopiedBlueprint)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      title="Sao chép toàn bộ"
                    >
                      {copiedBlueprint ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDownload(blueprint, `de-an-so-hoa-${params.department.toLowerCase().replace(/\s+/g, '-')}.md`)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      title="Tải về .MD"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[550px] overflow-y-auto pr-2">
                  {renderMarkdown(blueprint)}
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 border-dashed rounded-3xl h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Chưa có Đề án nào được tạo</h4>
                <p className="text-slate-500 text-xs max-w-sm mt-1 leading-relaxed">
                  Thiết lập các tham số trường học ở cột bên trái và bấm <strong>"Tạo Đề Án Số Hóa Chi Tiết"</strong> để AI phân tích và trả về bộ giải pháp Google Workspace thực chiến.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
