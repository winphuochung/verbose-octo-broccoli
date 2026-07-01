import React, { useState } from "react";
import { motion } from "motion/react";
import { CodeTemplate } from "../types";
import { Copy, Check, FileSpreadsheet, Send, ShieldCheck, Mail, Calendar, Sparkles } from "lucide-react";

export default function TemplateHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const templates: CodeTemplate[] = [
    {
      title: "Biểu mẫu Sổ báo giảng trực tuyến",
      category: "academic",
      description: "Cấu trúc cột chuẩn trên Google Sheets để lưu trữ dữ liệu báo giảng nộp từ Google Forms của cả tổ chuyên môn.",
      sheetsSchema: [
        "Timestamp (Thời gian nộp)",
        "Email_Giao_Vien (Địa chỉ email đăng nhập)",
        "Ten_Giao_Vien (Họ tên đầy đủ)",
        "Tuan_Hoc (Tuần thực hiện, ví dụ: Tuần 1, Tuần 2)",
        "Ngay_Day (Ngày thực hiện thực tế)",
        "Tiet_PPCT (Tiết thứ mấy theo phân phối chương trình)",
        "Lop_Day (Lớp dạy học)",
        "Ten_Bai_Day (Tên bài học theo chương trình GDPT 2018)",
        "Ghi_Chu (Điều chỉnh hoặc ghi chú phòng bộ môn nếu có)"
      ],
      appsScript: `// Không cần Apps Script cho chức năng lưu trữ cơ bản, dữ liệu tự liên kết từ Google Form`,
      lookerGuide: "Vẽ biểu đồ cột ngang (Bar Chart) đếm số dòng dữ liệu theo 'Ten_Giao_Vien' để kiểm tra xem mỗi giáo viên đã nộp đủ số tiết định mức trong tuần chưa."
    },
    {
      title: "Mã tự động gửi Email Biên bản dự giờ tiết dạy cho GV",
      category: "automation",
      description: "Dán mã nguồn này vào Google Apps Script của Sheet nhận phản hồi Form Dự giờ. Hệ thống tự động biên soạn nội dung nhận xét xếp loại và gửi email cho giáo viên ngay khi Tổ trưởng bấm gửi biểu mẫu đánh giá dự giờ.",
      sheetsSchema: [
        "Cột A: Timestamp | Cột B: Email giáo viên dạy | Cột C: Họ tên giáo viên | Cột D: Tên bài học | Cột E: Lớp | Cột F: Xếp loại | Cột G: Nhận xét ưu điểm | Cột H: Góp ý hạn chế | Cột I: Người dự giờ"
      ],
      appsScript: `/**
 * Google Apps Script - Tự động hóa gửi thông tin nhận xét tiết dạy
 * Hướng dẫn cài đặt:
 * 1. Mở file Google Sheets chứa phản hồi biểu mẫu dự giờ.
 * 2. Chọn Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết code cũ, dán đoạn code này vào.
 * 4. Bấm Lưu (Save), sau đó chọn Trình kích hoạt (Triggers - Biểu tượng đồng hồ bên trái).
 * 5. Thêm trình kích hoạt mới: Chọn hàm "guiEmailDuGio", loại sự kiện là "Khi gửi biểu mẫu" (On form submit).
 */
function guiEmailDuGio(e) {
  try {
    // Lấy thông tin dòng dữ liệu vừa được nộp qua biểu mẫu
    var sheet = SpreadsheetApp.getActiveSheet();
    var activeRow = e.range.getRow();
    
    // Đọc các ô dữ liệu tương ứng (Chỉnh sửa số cột 1, 2, 3... cho khớp với cấu trúc thực tế của bạn)
    var timestamp = sheet.getRange(activeRow, 1).getValue();
    var emailGV = sheet.getRange(activeRow, 2).getValue();
    var tenGV = sheet.getRange(activeRow, 3).getValue();
    var tenBai = sheet.getRange(activeRow, 4).getValue();
    var lopDay = sheet.getRange(activeRow, 5).getValue();
    var xepLoai = sheet.getRange(activeRow, 6).getValue();
    var uuDiem = sheet.getRange(activeRow, 7).getValue();
    var hanChe = sheet.getRange(activeRow, 8).getValue();
    var nguoiDu = sheet.getRange(activeRow, 9).getValue();
    
    // Định dạng tiêu đề email chuyên nghiệp
    var subject = "[Trung tâm Số] Biên bản nhận xét dự giờ tiết dạy: " + tenBai + " - Lớp " + lopDay;
    
    // Biên soạn nội dung thư điện tử
    var htmlBody = "<h3>KÍNH GỬI THẦY/CÔ " + tenGV.toUpperCase() + "</h3>" +
                   "<p>Tổ chuyên môn vừa ghi nhận biên bản dự giờ tiết dạy trực tuyến của Thầy/Cô vào lúc " + Utilities.formatDate(new Date(timestamp), "GMT+7", "dd/MM/yyyy HH:mm") + ".</p>" +
                   "<table border='1' cellpadding='8' style='border-collapse: collapse; border-color: #e2e8f0; font-family: sans-serif; font-size: 14px; width: 100%; max-width: 600px;'>" +
                   "  <tr style='background-color: #f8fafc;'><th align='left' width='35%'>Bài dạy</th><td>" + tenBai + "</td></tr>" +
                   "  <tr><th align='left'>Lớp dạy</th><td>" + lopDay + "</td></tr>" +
                   "  <tr style='background-color: #f8fafc;'><th align='left'>Người dự giờ</th><td>" + nguoiDu + "</td></tr>" +
                   "  <tr><th align='left'>Xếp loại tiết dạy</th><td style='font-weight: bold; color: #4f46e5;'>" + xepLoai + "</td></tr>" +
                   "  <tr style='background-color: #f8fafc;'><th align='left'>Ưu điểm nổi bật</th><td>" + uuDiem + "</td></tr>" +
                   "  <tr><th align='left'>Góp ý hạn chế</th><td>" + hanChe + "</td></tr>" +
                   "</table>" +
                   "<p style='color: #64748b; font-size: 13px; margin-top: 15px;'>Biên bản được tự động tổng hợp từ Trung tâm Điều hành Số của Tổ chuyên môn. Trân trọng cảm ơn những đóng góp học thuật của Thầy/Cô.</p>";
                   
    // Thực thi gửi thư nếu email hợp lệ
    if (emailGV && emailGV.indexOf("@") !== -1) {
      MailApp.sendEmail({
        to: emailGV,
        subject: subject,
        htmlBody: htmlBody
      });
      Logger.log("Đã gửi email thành công tới: " + emailGV);
    }
  } catch (error) {
    Logger.log("Lỗi thực thi gửi email nhận xét: " + error.toString());
  }
}`,
      lookerGuide: "Tạo một bảng dữ liệu trên Looker Studio, nhóm theo 'Ten_Giao_Vien' và chọn chỉ số là 'Xep_Loai' để vẽ biểu đồ tròn (Pie Chart) hiển thị tỷ lệ xếp loại Giỏi/Khá/Trung bình của tổ."
    },
    {
      title: "Mã tự động nhắc nhở hoàn thành Báo Cáo Tuần (Thứ Sáu)",
      category: "automation",
      description: "Đoạn mã này được lên lịch tự động chạy vào 16:00 chiều thứ Sáu hàng tuần. Nó sẽ quét cột 'Trạng thái' trong bảng kế hoạch của tổ chuyên môn và tự động gửi email nhắc giáo viên chưa hoàn thành báo cáo hoặc báo giảng.",
      sheetsSchema: [
        "Cột A: Họ tên giáo viên | Cột B: Email giáo viên | Cột C: Trang_Thai_Bao_Giang (Hoàn thành / Chưa nộp) | Cột D: Trang_Thai_Giao_An (Hoàn thành / Chưa nộp)"
      ],
      appsScript: `/**
 * Tự động gửi Email nhắc nhở giáo viên nộp báo cáo chuyên môn trễ hạn
 * Thiết lập trình kích hoạt: Lên lịch sự kiện dựa trên thời gian (Time-driven trigger) chạy hàng tuần vào chiều thứ Sáu.
 */
function nhacNhoNopBaoCao() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DanhSachGiaoVien");
    if (!sheet) {
      Logger.log("Không tìm thấy sheet mang tên 'DanhSachGiaoVien'");
      return;
    }
    
    var lastRow = sheet.getLastRow();
    var dataRange = sheet.getRange(2, 1, lastRow - 1, 4); // Đọc từ dòng 2 đến dòng cuối, lấy 4 cột
    var data = dataRange.getValues();
    
    for (var i = 0; i < data.length; i++) {
      var tenGV = data[i][0];
      var emailGV = data[i][1];
      var trangThaiBaoGiang = data[i][2];
      var trangThaiGiaoAn = data[i][3];
      
      // Nếu giáo viên chưa hoàn thành báo cáo giảng dạy hoặc giáo án
      if (trangThaiBaoGiang === "Chưa nộp" || trangThaiGiaoAn === "Chưa nộp") {
        var subject = "[Nhắc nhở tự động] Hoàn thành hồ sơ chuyên môn cuối tuần";
        
        var body = "Kính gửi Thầy/Cô " + tenGV + ",\\n\\n" +
                   "Hệ thống vận hành số ghi nhận Thầy/Cô chưa hoàn tất hồ sơ chuyên môn tuần học này:\\n";
                   
        if (trangThaiBaoGiang === "Chưa nộp") {
          body += "- Chưa hoàn tất cập nhật Sổ báo giảng trực tuyến.\\n";
        }
        if (trangThaiGiaoAn === "Chưa nộp") {
          body += "- Chưa tải Kế hoạch bài dạy (Giáo án) tuần tới lên Google Drive.\\n";
        }
        
        body += "\\nKính mong quý Thầy/Cô khẩn trương hoàn thành trước 17h00 hôm nay để Tổ chuyên môn tổng hợp báo cáo gửi Ban giám hiệu.\\n\\n" +
                "Trân trọng,\\n" +
                "Tổ trưởng Chuyên môn.";
                
        if (emailGV && emailGV.indexOf("@") !== -1) {
          MailApp.sendEmail(emailGV, subject, body);
          Logger.log("Đã gửi email nhắc nhở tới: " + emailGV);
        }
      }
    }
  } catch (err) {
    Logger.log("Lỗi nhắc nhở tự động: " + err.toString());
  }
}`,
      lookerGuide: "Tạo một bảng dữ liệu lọc nhanh (Scorecard) hiển thị 'Tổng số giáo viên chưa nộp' để giúp tổ trưởng nắm bắt nhanh quân số cần đôn đốc."
    },
    {
      title: "Hệ thống Đánh giá Kế hoạch bài dạy (Giáo án) theo Công văn 5512",
      category: "quality",
      description: "Thiết kế biểu mẫu trực tuyến chấm điểm giáo án theo đúng 12 tiêu chí của Công văn 5512 Bộ Giáo dục & Đào tạo, giúp số hóa hoàn toàn quy trình kiểm tra giáo án định kỳ.",
      sheetsSchema: [
        "Mã_Giáo_Án (Ví dụ: GA-TOAN10-T12)",
        "Giáo_Viên_Soạn",
        "Tên_Bài_Dạy",
        "Tiêu_Chí_1_Chuẩn_Kiến_Thức (Điểm từ 1-5)",
        "Tiêu_Chí_2_Thiết_Bị_Dạy_Học (Điểm từ 1-5)",
        "Tiêu_Chí_3_Tiến_Trình_Sư_Phạm (Điểm từ 1-5)",
        "Điểm_Trung_Bình (Công thức Sheets)",
        "Xếp_Loại_Chung (Công thức IF lồng)",
        "Ý_Kiến_Góp_Ý_Tổ_Trưởng"
      ],
      appsScript: `// Hàm tính xếp loại tự động trên Google Sheets bằng công thức:
// =IFS(G2>=4.5, "Xuất sắc", G2>=3.8, "Khá", G2>=3.0, "Đạt yêu cầu", G2<3.0, "Cần sửa đổi")`,
      lookerGuide: "Vẽ biểu đồ mạng nhện (Radar Chart) hoặc biểu đồ thanh biểu thị điểm trung bình của từng tiêu chí để biết tiêu chí nào giáo viên trong tổ thường làm tốt, tiêu chí nào còn gặp khó khăn cần tập huấn thêm."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Thư Viện Công Cụ Số Hóa Sư Phạm
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Quý Thầy/Cô có thể sao chép ngay các tài liệu, cấu trúc cơ sở dữ liệu trên Google Sheets 
          và mã nguồn Google Apps Script được lập trình sẵn dưới đây để đưa vào hệ thống của trường học. 
          Các tệp mã đều được comment tiếng Việt tỉ mỉ và hướng dẫn liên kết Looker Studio chi tiết.
        </p>
      </div>

      {/* Grid Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl, idx) => {
          const schemaId = `schema-${idx}`;
          const codeId = `code-${idx}`;
          const guideId = `guide-${idx}`;

          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    tmpl.category === "academic"
                      ? "bg-indigo-50 text-indigo-600"
                      : tmpl.category === "quality"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}>
                    {tmpl.category === "academic" ? "Quản trị Học thuật" : tmpl.category === "quality" ? "Kiểm soát Chất lượng" : "Tự động hóa Quy trình"}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-tight">{tmpl.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{tmpl.description}</p>
              </div>

              {/* Accordion Sheets Schema */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Cơ sở dữ liệu Google Sheets:
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 relative">
                    <ul className="text-xs text-slate-600 space-y-1 list-inside list-disc">
                      {tmpl.sheetsSchema.map((col, cIdx) => (
                        <li key={cIdx}>{col}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleCopy(tmpl.sheetsSchema.join("\n"), schemaId)}
                      className="absolute top-2 right-2 p-1.5 bg-white hover:bg-slate-50 rounded border border-slate-200 text-slate-400 hover:text-slate-600 transition"
                      title="Sao chép tên cột"
                    >
                      {copiedId === schemaId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Show Code if present */}
                {tmpl.appsScript && tmpl.appsScript.length > 50 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-rose-600" />
                      Mã Google Apps Script:
                    </h4>
                    <div className="relative">
                      <pre className="bg-slate-950 text-slate-200 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-[160px] leading-relaxed">
                        <code>{tmpl.appsScript}</code>
                      </pre>
                      <button
                        onClick={() => handleCopy(tmpl.appsScript, codeId)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900 text-slate-400 hover:text-slate-200 rounded border border-slate-800 transition text-xs flex items-center gap-1"
                      >
                        {copiedId === codeId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === codeId ? "Đã chép" : "Sao chép mã"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Looker Studio connection guide */}
                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Hướng dẫn Looker Studio KPI:
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{tmpl.lookerGuide}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
