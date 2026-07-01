import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, ClipboardList, TrendingUp, RefreshCw, Layout, Database, FileCode, BarChart3, HelpCircle } from "lucide-react";

interface PDCAStage {
  id: "P" | "D" | "C" | "A";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgLight: string;
  workspaceTools: { name: string; icon: React.ReactNode; purpose: string }[];
  steps: string[];
  benefit: string;
}

export default function PDCAVisualizer() {
  const [activeStage, setActiveStage] = useState<"P" | "D" | "C" | "A">("P");

  const stages: PDCAStage[] = [
    {
      id: "P",
      title: "PLAN - Lập Kế Hoạch",
      subtitle: "Xây dựng mục tiêu và biểu mẫu số hóa quy trình",
      icon: <ClipboardList className="w-6 h-6 text-indigo-600" />,
      color: "text-indigo-600",
      borderColor: "border-indigo-200",
      bgLight: "bg-indigo-50/50",
      workspaceTools: [
        { name: "Google Sites", icon: <Layout className="w-4 h-4 text-indigo-500" />, purpose: "Trang thông tin nội bộ tập trung của tổ chuyên môn" },
        { name: "Google Drive", icon: <Database className="w-4 h-4 text-amber-500" />, purpose: "Lưu trữ mẫu giáo án, kế hoạch dạy học không giấy tờ" }
      ],
      steps: [
        "Thiết lập mục tiêu và KPI hoạt động của tổ liên chuyên môn.",
        "Xây dựng cấu trúc thư mục lưu trữ bài dạy khoa học trên Google Drive.",
        "Thiết kế cổng thông tin điện tử (Google Sites) làm nơi truy cập tập trung của giáo viên."
      ],
      benefit: "Giảm 90% thời gian tìm kiếm tài liệu, thống nhất biểu mẫu và công khai kế hoạch học thuật."
    },
    {
      id: "D",
      title: "DO - Thực Hiện Số Hóa",
      subtitle: "Thu thập dữ liệu chuyên môn trực tuyến",
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      color: "text-emerald-600",
      borderColor: "border-emerald-200",
      bgLight: "bg-emerald-50/50",
      workspaceTools: [
        { name: "Google Forms", icon: <FileText className="w-4 h-4 text-purple-500" />, purpose: "Biểu mẫu dự giờ, sổ báo giảng, phản hồi học sinh" },
        { name: "Google Sheets", icon: <Database className="w-4 h-4 text-emerald-500" />, purpose: "Lưu trữ dữ liệu phản hồi có cấu trúc theo thời gian thực" }
      ],
      steps: [
        "Giáo viên nhập sổ báo giảng trực tuyến thông qua Google Forms cuối tuần.",
        "Thành viên dự giờ đánh giá tiết dạy trực tiếp bằng điện thoại qua form đánh giá 5512.",
        "Nhập liệu điểm số, chuyên đề học thuật trực tiếp trên các bảng tính Google Sheets."
      ],
      benefit: "Loại bỏ hoàn toàn sổ sách giấy viết tay, thu thập dữ liệu tức thời và chính xác tại nguồn."
    },
    {
      id: "C",
      title: "CHECK - Kiểm Tra Hiệu Suất",
      subtitle: "Giám sát thông minh và trực quan hóa dữ liệu",
      icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
      color: "text-amber-600",
      borderColor: "border-amber-200",
      bgLight: "bg-amber-50/50",
      workspaceTools: [
        { name: "Looker Studio", icon: <BarChart3 className="w-4 h-4 text-blue-500" />, purpose: "Trực quan hóa dashboard giám sát, so sánh hiệu suất giáo viên" },
        { name: "Google Sheets Analytics", icon: <Database className="w-4 h-4 text-emerald-500" />, purpose: "Sử dụng pivot table và công thức kiểm tra tính đúng hạn" }
      ],
      steps: [
        "Kết nối nguồn dữ liệu Google Sheets tự động với bảng Looker Studio.",
        "Theo dõi tiến độ báo giảng của từng giáo viên trong tổ thông qua biểu đồ tròn.",
        "Phân tích chất lượng các tiết dạy dự giờ, phát hiện sớm các nội dung cần hỗ trợ chuyên môn."
      ],
      benefit: "Ban giám hiệu và Tổ trưởng nắm bắt toàn bộ bức tranh học thuật tức thời chỉ qua một màn hình."
    },
    {
      id: "A",
      title: "ACT - Cải Tiến Liên Tục",
      subtitle: "Tự động hóa hành động và phản hồi chuyên môn",
      icon: <RefreshCw className="w-6 h-6 text-rose-600" />,
      color: "text-rose-600",
      borderColor: "border-rose-200",
      bgLight: "bg-rose-50/50",
      workspaceTools: [
        { name: "Google Apps Script", icon: <FileCode className="w-4 h-4 text-rose-500" />, purpose: "Viết mã tự động gửi thư báo kết quả, nhắc lịch nộp bài" },
        { name: "Google Chat Bot", icon: <HelpCircle className="w-4 h-4 text-cyan-500" />, purpose: "Gửi cảnh báo tức thì về phòng chat của tổ liên chuyên môn" }
      ],
      steps: [
        "Hệ thống tự động kích hoạt gửi Email biên bản dự giờ PDF về hòm thư giáo viên.",
        "Tự động gửi email nhắc lịch cho giáo viên chưa nộp báo giảng vào thứ Sáu.",
        "Điều chỉnh kế hoạch bài dạy và phương pháp dạy học dựa trên phản hồi dữ liệu."
      ],
      benefit: "Tạo luồng phản hồi khép kín tự động, thúc đẩy sự tiến bộ liên tục mà không cần nhắc nhở thủ công."
    }
  ];

  const currentStage = stages.find(s => s.id === activeStage)!;

  return (
    <div className="space-y-8">
      {/* Intro section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Triết Lý Vận Hành Thông Minh (PDCA)</h2>
        <p className="text-slate-600 leading-relaxed text-sm">
          Một hệ thống điều hành thông minh cho tổ chuyên môn không chỉ đơn thuần là gom các tệp tin lưu trên Drive. 
          Nó là một <strong>chu trình khép kín PDCA</strong> kết nối dữ liệu liên tục: Lập kế hoạch 
          chuyên môn <span className="font-semibold text-indigo-600">PLAN</span>, thực hiện nhập liệu tự động <span className="font-semibold text-emerald-600">DO</span>, 
          phân tích báo cáo thông minh <span className="font-semibold text-amber-600">CHECK</span>, và kích hoạt hành động phản hồi tự động bằng code <span className="font-semibold text-rose-600">ACT</span>.
        </p>
      </div>

      {/* PDCA Ring/Flow selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? `${stage.borderColor} bg-white shadow-md ring-2 ring-indigo-500/10`
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              {/* Corner badge */}
              <div className={`absolute top-3 right-3 text-2xl font-black opacity-10 ${stage.color}`}>
                {stage.id}
              </div>

              <div className="mb-3">{stage.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                {stage.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {stage.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Detail Box */}
      <motion.div
        key={activeStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 md:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden`}
      >
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${currentStage.bgLight} ${currentStage.color} border ${currentStage.borderColor}`}>
              Giai đoạn {currentStage.id}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-3">{currentStage.title}</h3>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">{currentStage.subtitle}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Các bước triển khai số hóa:</h4>
            <ul className="space-y-3">
              {currentStage.steps.map((step, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-700">
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-3 mt-0.5 shrink-0 ${currentStage.bgLight} ${currentStage.color}`}>
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`p-4 rounded-xl ${currentStage.bgLight} border border-dashed ${currentStage.borderColor}`}>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Giá trị thiết thực cho tổ chuyên môn:</h5>
            <p className="text-sm text-slate-600">{currentStage.benefit}</p>
          </div>
        </div>

        {/* Workspace tool mappings in this stage */}
        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl flex flex-col justify-between border border-slate-100">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Các công cụ Google Workspace bổ trợ:</h4>
            <div className="space-y-3">
              {currentStage.workspaceTools.map((tool, idx) => (
                <div key={idx} className="flex p-3 bg-white rounded-xl border border-slate-100 shadow-2xs items-start">
                  <div className="p-2 bg-slate-50 rounded-lg mr-3">
                    {tool.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{tool.name}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">{tool.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Hệ thống Google Workspace đồng bộ</span>
            <span className="font-semibold text-indigo-600">No-Code Integration</span>
          </div>
        </div>
      </motion.div>

      {/* Visual System Architecture Map */}
      <div className="bg-slate-950 text-slate-100 p-8 rounded-3xl relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-lg font-bold">Luồng dữ liệu liên thông trực quan</h3>
            <p className="text-slate-400 text-xs">
              Mô tả cách thức dữ liệu di chuyển hoàn toàn tự động qua các ứng dụng mà không cần sự can thiệp thủ công từ giáo viên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Box 1: Form */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold">1. Google Forms</h4>
              <p className="text-[10px] text-slate-400">Giáo viên điền thông tin báo giảng/đánh giá</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-center text-slate-600 text-lg">➔</div>

            {/* Box 2: Sheets & Apps Script */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2 relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                Apps Script Trigger
              </span>
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mx-auto">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold">2. Sheets Database</h4>
              <p className="text-[10px] text-slate-400">Lưu trữ dữ liệu tức thì & Kích hoạt code tự động</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-center text-slate-600 text-lg">➔</div>

            {/* Box 3: Looker & Email */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mx-auto">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold">3. Looker Studio & Email</h4>
              <p className="text-[10px] text-slate-400">Xem trực quan hoá & Tự động gửi kết quả PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
