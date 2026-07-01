import React, { useState, useEffect } from "react";
import { Upload, FileText, Video, File, Download } from "lucide-react";
import { FileItem } from "../types";

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchFiles();
      } else {
        alert("Upload thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi upload.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes("pdf")) return <FileText className="text-red-500" />;
    if (mimetype.includes("word") || mimetype.includes("document")) return <FileText className="text-blue-500" />;
    if (mimetype.includes("video")) return <Video className="text-purple-500" />;
    return <File className="text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kho Tài Liệu & Media</h2>
          <p className="text-sm text-slate-500">Quản lý các file Word, PDF, Video phục vụ chuyên môn</p>
        </div>
        <div>
          <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
            <Upload size={18} />
            <span className="font-semibold text-sm">{isUploading ? "Đang tải..." : "Tải file lên"}</span>
            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept=".pdf,.doc,.docx,video/*" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <FolderOpen className="mx-auto h-12 w-12 opacity-20 mb-3" />
            <p>Chưa có tài liệu nào. Hãy tải lên file đầu tiên!</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center p-4 border border-slate-100 rounded-xl hover:shadow-md transition bg-slate-50 group">
              <div className="p-3 bg-white rounded-lg shadow-xs mr-4">
                {getFileIcon(file.mimetype)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700 truncate text-sm" title={file.originalName}>
                  {file.originalName}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(file.uploadDate).toLocaleDateString("vi-VN")} • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <a href={`/uploads/${file.filename}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                <Download size={18} />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Temporary Folder icon since not imported above
function FolderOpen(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
