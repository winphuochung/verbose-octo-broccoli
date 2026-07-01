import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PDCAVisualizer from "./components/PDCAVisualizer";
import BlueprintCreator from "./components/BlueprintCreator";
import ExpertChat from "./components/ExpertChat";
import TemplateHub from "./components/TemplateHub";
import FileManager from "./components/FileManager";
import TeacherManagement from "./components/TeacherManagement";
import StaffEvaluation from "./components/StaffEvaluation";
import ApiKeyManager, { useApiKey } from "./components/ApiKeyManager";
import { RefreshCw, Sparkles, MessageSquare, Code2, FolderUp, Users, ClipboardCheck, Key } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"pdca" | "blueprint" | "chat" | "hub" | "files" | "teachers" | "evaluation">("pdca");
  const { apiKey, selectedModel, showModal, setShowModal, saveSettings } = useApiKey();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Banner Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/10">
                G
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5 uppercase">
                  Điều Hành Giáo Dục
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 normal-case">
                    Google Workspace
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Trung tâm số hóa & tự động hóa chuyên môn học thuật (GDPT 2018)
                </p>
              </div>
            </div>

            {/* Quick Action Info & Settings */}
            <div className="flex items-center gap-3 text-xs">
              <span className="hidden md:inline-block font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                Model: {selectedModel.replace("gemini-", "").replace("-preview", "")}
              </span>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold border border-rose-100 transition shadow-xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lấy API key để sử dụng app</span>
                <span className="sm:hidden">API Key</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ApiKeyManager 
        show={showModal} 
        onClose={() => setShowModal(false)}
        onSave={saveSettings}
        initialKey={apiKey}
        initialModel={selectedModel}
        isForce={!apiKey}
      />

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Visual Header Introduction */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full text-indigo-300 border border-white/5">
              Phân tích chuyên gia & Kiến trúc sư Giải pháp
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-sans leading-tight">
              Trung tâm Điều hành Giáo dục Thông minh Tổ liên chuyên môn
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-light">
              Hệ thống được thiết kế đặc biệt nhằm giúp các tổ trưởng chuyên môn, giáo viên phổ thông chuyển đổi số 
              quy trình sư phạm và hành chính (báo giảng trực tuyến, dự giờ, chấm giáo án 5512) thông qua sức mạnh 
              đồng bộ 100% của hệ sinh thái <strong>Google Workspace</strong>.
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Bento Rail */}
        <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("pdca")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "pdca"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            Chu trình PDCA Số hóa
          </button>

          <button
            onClick={() => setActiveTab("blueprint")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "blueprint"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            Trình Tạo Đề Án
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "chat"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            Tư Vấn Chuyên Gia AI
          </button>

          <button
            onClick={() => setActiveTab("hub")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "hub"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Code2 className="w-4 h-4 shrink-0" />
            Thư Viện Code
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "files"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <FolderUp className="w-4 h-4 shrink-0" />
            Kho Tài Liệu
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "teachers"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Nhân Sự
          </button>

          <button
            onClick={() => setActiveTab("evaluation")}
            className={`p-3 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === "evaluation"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            Đánh Giá
          </button>
        </div>

        {/* Active Tab Panel - Staggered Slide In */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {activeTab === "pdca" && <PDCAVisualizer />}
              {activeTab === "blueprint" && <BlueprintCreator />}
              {activeTab === "chat" && <ExpertChat />}
              {activeTab === "hub" && <TemplateHub />}
              {activeTab === "files" && <FileManager />}
              {activeTab === "teachers" && <TeacherManagement />}
              {activeTab === "evaluation" && <StaffEvaluation />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-slate-400 text-center text-xs space-y-2">
        <p className="font-medium text-slate-500">
          Hệ thống Quản trị & Số hóa Chuyên môn Trường học - Cấp cao
        </p>
        <p className="text-slate-400 font-light max-w-md mx-auto">
          Ứng dụng thiết kế theo triết lý giảm thiểu gánh nặng hành chính cho nhà giáo, tối ưu năng suất lao động học thuật dựa trên dữ liệu.
        </p>
      </footer>
    </div>
  );
}
