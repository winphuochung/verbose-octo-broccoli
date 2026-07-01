import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data.json');

// Helper to read/write DB
const readDB = () => {
  if (!fs.existsSync(DATA_FILE)) return { teachers: [], evaluations: [], files: [] };
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
};
const writeDB = (data: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set or is using the placeholder.");
}

// System Instruction for the digital transformation assistant
const SYSTEM_INSTRUCTION = `# Custom System Instruction: Chuyên gia Triển khai và Vận hành Hệ thống Điều hành Giáo dục Google Workspace

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

// API route for Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Yêu cầu danh sách tin nhắn hợp lệ." });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng thiết lập API Key trong Settings > Secrets."
      });
    }

    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi trao đổi với AI." });
  }
});

// API route for customized Blueprint generation
app.post("/api/generate-blueprint", async (req, res) => {
  try {
    const { schoolLevel, department, primaryGoal } = req.body;
    
    if (!schoolLevel || !department || !primaryGoal) {
      return res.status(400).json({ error: "Vui lòng cung cấp đủ thông tin cấp học, tổ chuyên môn và mục tiêu chính." });
    }

    if (!ai) {
      const fallbackBlueprint = generateFallbackBlueprint(schoolLevel, department, primaryGoal);
      return res.json({ blueprint: fallbackBlueprint, isFallback: true });
    }

    const prompt = `Hãy thiết kế một đề án/phương án "Trung tâm điều hành thông minh" (Smart Operations Center) chi tiết cho:
- **Cấp học**: ${schoolLevel}
- **Tổ chuyên môn**: ${department}
- **Mục tiêu ưu tiên**: ${primaryGoal}

Yêu cầu: Viết hoàn toàn bằng tiếng Việt, trình bày thật chi tiết, trực quan bằng Markdown với các bảng dữ liệu mẫu, công thức Google Sheets, và quy trình kết nối Forms -> Sheets -> Apps Script -> Looker Studio theo chu trình PDCA.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      }
    });

    res.json({ blueprint: response.text, isFallback: false });
  } catch (error: any) {
    console.error("Error in /api/generate-blueprint:", error);
    const fallback = generateFallbackBlueprint(req.body.schoolLevel, req.body.department, req.body.primaryGoal);
    res.json({ blueprint: fallback, isFallback: true, error: error.message });
  }
});

function generateFallbackBlueprint(schoolLevel: string, department: string, primaryGoal: string): string {
  return `# Đề án: Trung tâm Điều hành Thông minh Tổ ${department} - Cấp ${schoolLevel}
## (Hệ thống Tự động hóa & Vận hành dựa trên Dữ liệu theo chu trình PDCA)

> **Mục tiêu ưu tiên:** ${primaryGoal}
> **Công nghệ sử dụng:** 100% Google Workspace (Forms, Sheets, Apps Script, Looker Studio, Drive, Sites)

---

## I. KIẾN TRÚC TỔNG THỂ HỆ THỐNG (PDCA)

Hệ thống được thiết kế khép kín nhằm tối ưu hóa công tác quản trị và dạy học của tổ chuyên môn, giảm thiểu tối đa các thủ tục hành chính giấy tờ thông thường:

\`\`\`
  [P] Lập kế hoạch (Google Sites / Sheets)
                │
                ▼
  [D] Thực hiện số hóa (Google Forms & Drive)
                │
                ▼
  [C] Trực quan hóa & Giám sát (Looker Studio)
                │
                ▼
  [A] Tự động cải tiến (Apps Script / Gửi báo cáo tự động)
\`\`\`

---

## II. CHI TIẾT CÁC PHÂN HỆ CHỨC NĂNG

### Phân hệ 1: Quản trị học thuật (Academic Administration)
* **Ứng dụng**: Sổ báo giảng trực tuyến & Phân công nhiệm vụ.
* **Quy trình**:
  1. Đầu tuần, Giáo viên điền thông tin báo giảng qua Google Forms.
  2. Dữ liệu tự động đổ về Google Sheets \`Cơ sở dữ liệu Báo giảng\`.
  3. Looker Studio tự động hiển thị tiến độ báo giảng của cả tổ.
* **Cấu trúc dữ liệu Google Sheets (\`tb_bao_giang\`):**

| Cột (Trường dữ liệu) | Kiểu dữ liệu | Mô tả | Công thức / Ví dụ |
| :--- | :--- | :--- | :--- |
| \`id\` | INT (Primary Key) | Mã báo giảng tự động | \`BG-\` & TEXT(Timestamp, \"yyyymmddhhmmss\") |
| \`email_gv\` | VARCHAR | Email giáo viên nhập | \`thaycongan@school.edu.vn\` |
| \`ten_gv\` | VARCHAR | Họ tên giáo viên | Tự động lấy từ bảng danh mục GV |
| \`tuan\` | INT | Tuần thực hiện | \`Tuần 1, Tuần 2,...\` |
| \`ngay_day\` | DATE | Ngày dạy | \`2026-09-07\` |
| \`tiet_ppct\` | INT | Tiết phân phối chương trình | \`Tiết 12\` |
| \`ten_bai_day\` | VARCHAR | Tên bài dạy (GDPT 2018) | \`Bài 3: Thực hành đo gia tốc tự do\` |

---

### Phân hệ 2: Kiểm soát chất lượng & Đánh giá (PDCA - Check)
* **Ứng dụng**: Đánh giá Kế hoạch bài dạy (Giáo án) theo Công văn 5512 & Phiếu dự giờ giáo viên trực tuyến.
* **Quy trình**:
  1. Tổ trưởng/Tổ phó dự giờ sử dụng Google Form trên điện thoại để chấm điểm trực tiếp tiết dạy.
  2. Apps Script tính toán điểm trung bình và xếp loại tự động trên Google Sheets.
  3. Apps Script gửi ngay một email chứa Biên bản đánh giá dự giờ định dạng PDF tuyệt đẹp về cho giáo viên được dự giờ.

---

### Phân hệ 3: Tự động hóa quy trình (Apps Script Automation)
Dưới đây là mã nguồn Apps Script cốt lõi để kích hoạt chức năng tự động gửi email phản hồi kết quả dự giờ và nhắc nhở hoàn thành báo cáo chuyên môn cuối tuần:

\`\`\`javascript
/**
 * Tự động gửi Email phản hồi đánh giá tiết dạy cho giáo viên
 * Gắn trực tiếp vào biểu mẫu Google Sheets nhận phản hồi từ Form Dự Giờ
 */
function onFormSubmitNotification(e) {
  try {
    var range = e.range;
    var sheet = range.getSheet();
    var row = range.getRow();
    
    // Lấy dữ liệu dòng vừa submit
    var timestamp = sheet.getRange(row, 1).getValue();
    var emailGV = sheet.getRange(row, 2).getValue();
    var tenGV = sheet.getRange(row, 3).getValue();
    var lopDay = sheet.getRange(row, 4).getValue();
    var baiDay = sheet.getRange(row, 5).getValue();
    var nguoiDuGio = sheet.getRange(row, 6).getValue();
    var xepLoai = sheet.getRange(row, 7).getValue();
    var nhanXetGopY = sheet.getRange(row, 8).getValue();
    
    var subject = \"[Trung tâm Vận hành Số] Kết quả đánh giá dự giờ tiết dạy: \" + baiDay;
    
    var body = \"Kính gửi Thầy/Cô \" + tenGV + \",\\n\\n\" +
               \"Dưới đây là kết quả đánh giá dự giờ tiết dạy từ Tổ chuyên môn:\\n\\n\" +
               \"- Bài dạy: \" + baiDay + \"\\n\" +
               \"- Lớp: \" + lopDay + \"\\n\" +
               \"- Người dự giờ: \" + nguoiDuGio + \"\\n\" +
               \"- Xếp loại tiết dạy: \" + xepLoai + \"\\n\" +
               \"- Ý kiến nhận xét, góp ý chuyên môn: \" + nhanXetGopY + \"\\n\\n\" +
               \"Chúc Thầy/Cô luôn nhiều năng lượng để hoàn thành xuất sắc nhiệm vụ học thuật.\\n\\n\" +
               \"Trân trọng,\\n\" +
               \"Hệ thống vận hành thông minh Tổ chuyên môn.\";
               
    if (emailGV && emailGV.indexOf(\"@\") !== -1) {
      MailApp.sendEmail(emailGV, subject, body);
      Logger.log(\"Đã gửi email thành công tới: \" + emailGV);
    }
  } catch (err) {
    Logger.log(\"Lỗi gửi email: \" + err.toString());
  }
}
\`\`\`

---

## III. HƯỚNG DẪN KẾT NỐI LOOKER STUDIO

1. **Kết nối nguồn dữ liệu**: Chọn nguồn **Google Sheets**, tìm kiếm tên file chứa dữ liệu phản hồi của tổ.
2. **Xây dựng Biểu đồ Scorecard (Chỉ số KPI)**:
   - Tổng số tiết dạy đã báo giảng.
   - Điểm đánh giá dự giờ trung bình toàn tổ.
3. **Biểu đồ Cột (Column Chart)**: Số tiết dạy của từng giáo viên trong tổ để so sánh độ đồng đều.
4. **Bảng dữ liệu chi tiết (Table)**: Danh sách tổng hợp báo giảng trong tuần, lọc nhanh theo tuần học và họ tên giáo viên.`;
}

// --- NEW API ENDPOINTS ---

// Upload API
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không tìm thấy file" });
  }
  const db = readDB();
  const newFile = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    uploadDate: new Date().toISOString()
  };
  db.files.push(newFile);
  writeDB(db);
  res.json({ message: "Upload thành công", file: newFile });
});

app.get("/api/files", (req, res) => {
  const db = readDB();
  res.json(db.files || []);
});

// Teachers API
app.get("/api/teachers", (req, res) => {
  const db = readDB();
  res.json(db.teachers || []);
});

app.post("/api/teachers", (req, res) => {
  const db = readDB();
  const newTeacher = { id: uuidv4(), ...req.body };
  db.teachers.push(newTeacher);
  writeDB(db);
  res.json(newTeacher);
});

app.put("/api/teachers/:id", (req, res) => {
  const db = readDB();
  const index = db.teachers.findIndex((t: any) => t.id === req.params.id);
  if (index !== -1) {
    db.teachers[index] = { ...db.teachers[index], ...req.body };
    writeDB(db);
    res.json(db.teachers[index]);
  } else {
    res.status(404).json({ error: "Không tìm thấy GV" });
  }
});

app.delete("/api/teachers/:id", (req, res) => {
  const db = readDB();
  db.teachers = db.teachers.filter((t: any) => t.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Evaluations API
app.get("/api/evaluations", (req, res) => {
  const db = readDB();
  res.json(db.evaluations || []);
});

app.post("/api/evaluations", (req, res) => {
  const db = readDB();
  const newEval = { id: uuidv4(), ...req.body, date: new Date().toISOString() };
  if (!db.evaluations) db.evaluations = [];
  db.evaluations.push(newEval);
  writeDB(db);
  res.json(newEval);
});

// Export Docx API
app.get("/api/export/evaluation", async (req, res) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "BIÊN BẢN ĐÁNH GIÁ VIÊN CHỨC", bold: true, size: 32 })
          ],
        }),
        new Paragraph({ text: "Đây là mẫu báo cáo đánh giá được tạo tự động từ hệ thống." })
      ],
    }]
  });

  const b64string = await Packer.toBase64String(doc);
  const buffer = Buffer.from(b64string, 'base64');
  
  res.setHeader('Content-Disposition', 'attachment; filename=DanhGiaVienChuc.docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);
});

// Start Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
