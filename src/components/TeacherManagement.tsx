import React, { useState, useEffect } from "react";
import { Teacher } from "../types";
import { Users, Plus, Trash2, Edit } from "lucide-react";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Partial<Teacher>>({});

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentTeacher.id;
    const url = isNew ? "/api/teachers" : `/api/teachers/${currentTeacher.id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTeacher),
    });

    setIsEditing(false);
    setCurrentTeacher({});
    fetchTeachers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) return;
    await fetch(`/api/teachers/${id}`, { method: "DELETE" });
    fetchTeachers();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" /> Quản lý Nhân sự
          </h2>
          <p className="text-sm text-slate-500">Danh sách thành viên Tổ chuyên môn</p>
        </div>
        <button
          onClick={() => {
            setCurrentTeacher({});
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
        >
          <Plus size={18} /> Thêm Giáo viên
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200">
          <h3 className="font-bold mb-4">{currentTeacher.id ? "Cập nhật" : "Thêm mới"} Giáo viên</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Họ và tên" className="p-2 border rounded" value={currentTeacher.name || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, name: e.target.value })} />
            <input required type="date" placeholder="Ngày sinh" className="p-2 border rounded" value={currentTeacher.dob || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, dob: e.target.value })} />
            <input required placeholder="Chuyên môn (Toán, Văn...)" className="p-2 border rounded" value={currentTeacher.subject || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, subject: e.target.value })} />
            <input required placeholder="Trình độ (Đại học, Thạc sĩ...)" className="p-2 border rounded" value={currentTeacher.degree || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, degree: e.target.value })} />
            <input placeholder="Số điện thoại" className="p-2 border rounded" value={currentTeacher.phone || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, phone: e.target.value })} />
            <input type="email" placeholder="Email" className="p-2 border rounded" value={currentTeacher.email || ""} onChange={e => setCurrentTeacher({ ...currentTeacher, email: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded hover:bg-slate-100">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Lưu thông tin</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b">
              <th className="p-3 font-medium">Họ và tên</th>
              <th className="p-3 font-medium">Ngày sinh</th>
              <th className="p-3 font-medium">Chuyên môn</th>
              <th className="p-3 font-medium">Trình độ</th>
              <th className="p-3 font-medium">Liên hệ</th>
              <th className="p-3 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id} className="border-b hover:bg-slate-50/50">
                <td className="p-3 font-medium text-slate-700">{teacher.name}</td>
                <td className="p-3 text-slate-600">{teacher.dob}</td>
                <td className="p-3 text-slate-600">{teacher.subject}</td>
                <td className="p-3 text-slate-600">{teacher.degree}</td>
                <td className="p-3 text-sm text-slate-500">
                  <div>{teacher.phone}</div>
                  <div>{teacher.email}</div>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => { setCurrentTeacher(teacher); setIsEditing(true); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(teacher.id)} className="text-red-500 hover:text-red-700 p-1 ml-2"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan={6} className="text-center p-6 text-slate-400">Chưa có giáo viên nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
