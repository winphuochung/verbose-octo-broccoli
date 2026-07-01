import React, { useState, useEffect } from "react";
import { Teacher, Evaluation } from "../types";
import { ClipboardCheck, Download, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function StaffEvaluation() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [periodValue, setPeriodValue] = useState("07-2026"); // Default testing
  
  const [newEval, setNewEval] = useState<Partial<Evaluation>>({});

  useEffect(() => {
    fetchTeachers();
    fetchEvaluations();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    setTeachers(await res.json());
  };

  const fetchEvaluations = async () => {
    const res = await fetch("/api/evaluations");
    setEvaluations(await res.json());
  };

  const handleSaveEval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEval.teacherId || !newEval.score) return alert("Vui lòng nhập đủ thông tin");
    
    await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newEval, period: selectedPeriod, periodValue })
    });
    setNewEval({});
    fetchEvaluations();
  };

  // Lọc đánh giá theo kỳ
  const currentEvals = evaluations.filter(e => e.period === selectedPeriod && e.periodValue === periodValue);

  // Thống kê cho biểu đồ
  const stats = {
    "Xuất sắc": 0,
    "Tốt": 0,
    "Hoàn thành": 0,
    "Không hoàn thành": 0
  };
  currentEvals.forEach(e => {
    if (stats[e.score as keyof typeof stats] !== undefined) {
      stats[e.score as keyof typeof stats]++;
    }
  });

  const chartData = Object.keys(stats).map(key => ({
    name: key,
    "Số lượng": stats[key as keyof typeof stats]
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-indigo-600" /> Đánh giá Viên chức
          </h2>
          <p className="text-sm text-slate-500">Đánh giá mức độ hoàn thành nhiệm vụ theo kỳ</p>
        </div>
        <a 
          href="/api/export/evaluation"
          target="_blank"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-semibold text-sm"
        >
          <Download size={18} /> Xuất Báo Cáo (Word)
        </a>
      </div>

      <div className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-sm font-semibold mb-1">Kỳ đánh giá</label>
          <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="p-2 border rounded bg-white">
            <option value="month">Hàng tháng</option>
            <option value="quarter">Hàng quý</option>
            <option value="year">Cuối năm</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Thời gian (VD: 07-2026, Q3-2026)</label>
          <input value={periodValue} onChange={e => setPeriodValue(e.target.value)} className="p-2 border rounded bg-white" placeholder="07-2026" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Form Đánh giá mới */}
        <div className="border rounded-xl p-4">
          <h3 className="font-bold mb-4">Thêm kết quả đánh giá</h3>
          <form onSubmit={handleSaveEval} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Chọn Giáo viên</label>
              <select className="w-full p-2 border rounded" value={newEval.teacherId || ""} onChange={e => setNewEval({...newEval, teacherId: e.target.value})} required>
                <option value="">-- Chọn --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Mức độ hoàn thành</label>
              <select className="w-full p-2 border rounded" value={newEval.score || ""} onChange={e => setNewEval({...newEval, score: e.target.value as any})} required>
                <option value="">-- Chọn --</option>
                <option value="Xuất sắc">Hoàn thành Xuất sắc</option>
                <option value="Tốt">Hoàn thành Tốt</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Không hoàn thành">Không hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Nhận xét thêm (Tùy chọn)</label>
              <textarea className="w-full p-2 border rounded" value={newEval.notes || ""} onChange={e => setNewEval({...newEval, notes: e.target.value})}></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded font-semibold hover:bg-indigo-700">Lưu kết quả</button>
          </form>
        </div>

        {/* Biểu đồ */}
        <div className="border rounded-xl p-4 flex flex-col items-center">
          <h3 className="font-bold mb-4 flex gap-2 items-center"><BarChart2 className="text-indigo-500"/> Thống kê kỳ {periodValue}</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="Số lượng" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-bold mb-3">Danh sách đã đánh giá ({currentEvals.length})</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-600">
              <th className="p-3">Giáo viên</th>
              <th className="p-3">Kết quả</th>
              <th className="p-3">Nhận xét</th>
              <th className="p-3">Thời gian chấm</th>
            </tr>
          </thead>
          <tbody>
            {currentEvals.map(ev => {
              const t = teachers.find(x => x.id === ev.teacherId);
              return (
                <tr key={ev.id} className="border-b hover:bg-slate-50/50">
                  <td className="p-3 font-medium">{t?.name || "N/A"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${ev.score.includes("Xuất sắc") ? 'bg-emerald-100 text-emerald-700' : ev.score === "Tốt" ? 'bg-blue-100 text-blue-700' : ev.score === "Hoàn thành" ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {ev.score}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-slate-500">{ev.notes}</td>
                  <td className="p-3 text-sm text-slate-500">{new Date(ev.date).toLocaleString("vi-VN")}</td>
                </tr>
              )
            })}
            {currentEvals.length === 0 && (
              <tr><td colSpan={4} className="text-center p-6 text-slate-400">Chưa có đánh giá nào trong kỳ này</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
