# Tài Liệu Thiết Kế & Hướng Dẫn Bộ Khung Hệ Thống Backend
## PHẦN MỀM CHẤM ĐIỂM BÁO CÁO ĐỀ TÀI MÔN HỌC

Tài liệu này định nghĩa bộ khung (System Backend Skeleton) chuẩn production được xây dựng dựa trên cấu trúc phân lớp hiện đại của dự án `ThucTapCoSo-backend` và tích hợp toàn bộ các nghiệp vụ, tác nhân từ tài liệu [Use Case Modeling](file:///d:/CNPM/CNPM-backend/Use_Case_Modeling_Cham_Diem_Bao_Cao.md).

---

## 1. Công Nghệ Sử Dụng (Technology Stack)

Hệ thống được thiết kế chạy trên nền tảng **Node.js** sử dụng ngôn ngữ **TypeScript** với các công nghệ lõi:
- **Framework chính**: `Express.js` (nhẹ, linh hoạt, dễ mở rộng).
- **ORM**: `Prisma ORM` để làm việc với database PostgreSQL/MySQL một cách an toàn và chuẩn hóa thông qua TypeScript.
- **Validation**: `Zod` dùng để định nghĩa schema và xác thực dữ liệu đầu vào (Request validation).
- **Authentication**: `JWT` (JSON Web Token) kết hợp băm mật khẩu bằng `bcryptjs`.
- **File Upload**: `multer` cấu hình kiểm soát dung lượng và định dạng file báo cáo.
- **Logger**: `Winston` hoặc `Pino` ghi log chi tiết lịch sử lỗi và hoạt động của hệ thống.
- **Testing**: `Jest` & `Supertest` phục vụ viết Unit Test, Integration Test và E2E Test.

---

## 2. Cấu Trúc Thư Mục Hệ Thống (Directory Structure)

Bộ khung backend được phân chia lớp rõ ràng theo nguyên tắc **Separation of Concerns (SoC)** nhằm đảm bảo khả năng bảo trì, mở rộng và viết unit test độc lập:

```
CNPM-backend/
│
├── prisma/
│   ├── schema.prisma              # Định nghĩa toàn bộ Database Models & Enums
│   ├── seed.ts                    # Seed dữ liệu mẫu (Tài khoản mặc định, Rubric mẫu,...)
│   └── migrations/                # Chứa các file migrations tự động sinh bởi Prisma
│
├── src/
│   ├── app.ts                     # Cấu hình Express app, tích hợp global middlewares & routers
│   ├── server.ts                  # Entry point chính - Chỉ thực hiện listen port
│   │
│   ├── config/                    # Cấu hình tham số hệ thống kết nối môi trường
│   │   ├── prisma.ts              # Singleton Prisma Client duy trì kết nối DB
│   │   ├── env.ts                 # Validate & parse các biến process.env bằng Zod
│   │   ├── cors.ts                # Định cấu hình chia sẻ tài nguyên nguồn gốc chéo (CORS)
│   │   └── swagger.ts             # Cấu hình tài liệu API tự động (Swagger UI)
│   │
│   ├── constants/                 # Định nghĩa các hằng số dùng chung toàn hệ thống
│   │   ├── httpStatus.ts          # Danh sách mã lỗi HTTP (200, 400, 401, 403, 404, 500)
│   │   └── messages.ts            # Hằng số thông điệp phản hồi bằng tiếng Việt chuẩn hóa
│   │
│   ├── routes/                    # Định nghĩa các tuyến đường API
│   │   ├── index.ts               # Router tổng hợp (Barrel router) gộp tất cả các nhánh
│   │   └── v1/                    # Thư mục chứa API phiên bản 1
│   │       ├── auth.routes.ts     # Các API xác thực tài khoản (UC-01)
│   │       ├── user.routes.ts     # Các API quản lý thông tin & tài khoản (UC-02, UC-13)
│   │       ├── rubric.routes.ts   # Các API quản lý Rubric chấm điểm (UC-08)
│   │       ├── submission.routes.ts # Các API nộp bài, chấm điểm, sửa đổi, bình luận (UC-03 -> UC-06, UC-09, UC-10, UC-15, UC-16, UC-22)
│   │       ├── assignment.routes.ts # Các API phân công, danh sách lớp, xuất báo cáo (UC-07, UC-11, UC-12, UC-17, UC-18)
│   │       ├── config.routes.ts   # Các API cấu hình tham số hệ thống (UC-14)
│   │       ├── term.routes.ts     # Các API quản lý học kỳ & khóa điểm (UC-19)
│   │       ├── backup.routes.ts   # Các API sao lưu và phục hồi dữ liệu (UC-20)
│   │       └── log.routes.ts      # Các API xem nhật ký hoạt động hệ thống (UC-21)
│   │
│   ├── middleware/                # Các bộ lọc trung gian xử lý Request
│   │   ├── auth.ts                # Xác thực JWT, giải mã payload và phân quyền Actor (UC-I01)
│   │   ├── validate.ts            # Middleware tổng quát chạy schema Zod để kiểm tra API Payload
│   │   ├── upload.ts              # Cấu hình lưu trữ và kiểm soát file nộp hợp lệ (UC-I02)
│   │   └── errorHandler.ts        # Global Error Handler - tóm và xử lý tập trung mọi lỗi phát sinh
│   │
│   ├── controllers/               # Lớp trung gian nhận Request, điều phối gọi Service, trả Response
│   │   ├── auth.controller.ts     # Điều phối đăng nhập, đổi mật khẩu
│   │   ├── user.controller.ts     # Điều phối cập nhật thông tin cá nhân, phân quyền tài khoản (UC-02, UC-13)
│   │   ├── rubric.controller.ts   # Điều phối thiết lập tiêu chí chấm điểm (UC-08)
│   │   ├── submission.controller.ts # Điều phối nộp báo cáo, chấm điểm, phê duyệt, bình luận
│   │   ├── assignment.controller.ts # Điều phối nhập phân công từ file, xuất bảng điểm
│   │   ├── config.controller.ts   # Điều phối cấu hình tham số hệ thống (UC-14)
│   │   ├── term.controller.ts     # Điều phối khóa điểm, khóa học kỳ (UC-19)
│   │   ├── backup.controller.ts   # Điều phối sao lưu, phục hồi database (UC-20)
│   │   └── log.controller.ts      # Điều phối xem nhật ký hoạt động hệ thống (UC-21)
│   │
│   ├── services/                  # Lớp Business Logic thuần túy - Không chứa logic req/res
│   │   ├── auth.service.ts        # Logic đăng nhập, sinh JWT, mã hóa mật khẩu
│   │   ├── user.service.ts        # Logic quản lý tài khoản, phân quyền, thông tin cá nhân (UC-02, UC-13)
│   │   ├── rubric.service.ts      # Logic kiểm tra & lưu trữ hệ thống tiêu chí rubric (UC-08)
│   │   ├── submission.service.ts  # Logic nộp bài, chấm điểm, tự động tính điểm tổng theo trọng số (UC-I05)
│   │   ├── assignment.service.ts  # Logic đọc excel phân công, xuất file báo cáo lớp, theo dõi tiến độ (UC-11, UC-12)
│   │   ├── notification.service.ts # Module gửi mail/thông báo tự động khi có trạng thái thay đổi (UC-I03)
│   │   ├── config.service.ts      # Logic cấu hình tham số hệ thống (UC-14)
│   │   ├── term.service.ts        # Logic khóa học kỳ, khóa điểm cuối kỳ (UC-19)
│   │   ├── backup.service.ts      # Logic sao lưu, khôi phục database vật lý (UC-20)
│   │   └── log.service.ts         # Logic ghi và truy xuất nhật ký hoạt động hệ thống (UC-21)
│   │
│   ├── repositories/              # Lớp Truy Cập Cơ Sở Dữ Liệu (chỉ giao tiếp với Prisma)
│   │   ├── user.repository.ts
│   │   ├── rubric.repository.ts
│   │   ├── submission.repository.ts
│   │   ├── assignment.repository.ts
│   │   ├── config.repository.ts
│   │   ├── term.repository.ts
│   │   └── log.repository.ts
│   │
│   ├── validators/                # Chứa các Zod Schemas dùng cho kiểm tra dữ liệu đầu vào
│   │   ├── auth.validator.ts      # Schema đăng nhập, reset mật khẩu, đổi mật khẩu
│   │   ├── user.validator.ts      # Schema cập nhật thông tin cá nhân, tạo tài khoản
│   │   ├── rubric.validator.ts    # Schema tạo/sửa tiêu chí rubric (kiểm tra tổng trọng số = 100%)
│   │   ├── submission.validator.ts # Schema gửi bài, chấm điểm chi tiết, gửi bình luận
│   │   ├── assignment.validator.ts # Schema cấu hình phân công, lọc tìm kiếm
│   │   ├── config.validator.ts    # Schema cấu hình tham số hệ thống
│   │   └── term.validator.ts      # Schema quản lý khóa học kỳ
│   │
│   ├── types/                     # Chứa định nghĩa kiểu dữ liệu tĩnh của TypeScript
│   │   ├── express.d.ts           # Mở rộng Request của Express (gán thêm thông tin `req.user` sau giải mã)
│   │   ├── env.d.ts               # Định nghĩa kiểu biến môi trường
│   │   └── dto/                   # Data Transfer Objects định dạng dữ liệu truyền qua API
│   │
│   └── utils/                     # Thư viện tiện ích dùng chung
│       ├── apiResponse.ts         # Chuẩn hóa định dạng JSON phản hồi (success, message, data)
│       ├── logger.ts              # Thiết lập công cụ ghi log Winston/Pino
│       ├── fileHelper.ts          # Kiểm tra đuôi file, dọn dẹp tên file, kiểm tra dung lượng
│       └── dbBackupHelper.ts      # Tiện ích backup và restore database PostgreSQL bằng script
│
├── tests/                         # Thư mục chứa kịch bản kiểm thử tự động
│   ├── unit/                      # Unit test cho lớp Services và Utils (Mocks Repository)
│   ├── integration/               # Integration test kiểm thử luồng API và kết nối DB test thực tế
│   └── helpers/                   # Setup/teardown cơ sở dữ liệu ảo để phục vụ test
│
├── .env                           # Chứa biến môi trường bảo mật cục bộ (Bị bỏ qua bởi Git)
├── .env.example                   # File mẫu biến môi trường phục vụ cấu hình dự án
├── package.json                   # Quản lý thư viện phụ thuộc và định nghĩa scripts khởi chạy
├── tsconfig.json                  # Cấu hình biên dịch mã nguồn TypeScript
└── .gitignore                     # Chỉ định các thư mục, file không tải lên Git repository
```

---

## 3. Luồng Xử Lý Request (Request Lifecycle Flow)

Mọi yêu cầu từ Client gửi lên hệ thống sẽ đi qua một quy trình xử lý khép kín nhằm đảm bảo tính an toàn dữ liệu và tối ưu hóa hiệu năng:

```
Client Request (HTTP)
      │
      ▼
Routes Layer (`src/routes/v1/*`)
      │  [Xác định path & method tương ứng]
      ▼
Middlewares Layer
      ├── 1. `auth.ts` ────────► Kiểm tra JWT, xác thực quyền truy cập (UC-I01)
      ├── 2. `validate.ts` ────► Xác thực định dạng, kiểu dữ liệu payload bằng Zod
      └── 3. `upload.ts` ──────► Lọc định dạng file, kiểm tra giới hạn dung lượng (UC-I02)
      │
      ▼
Controllers Layer (`src/controllers/*`)
      │  [Nhận dữ liệu đã sạch, chuyển params, gọi tầng logic, gửi Response qua apiResponse]
      ▼
Services Layer (`src/services/*`)
      │  [Xử lý nghiệp vụ thuần túy, tính điểm tổng UC-I05, trigger gửi mail thông báo UC-I03]
      ▼
Repositories Layer (`src/repositories/*`)
      │  [Tương tác trực tiếp với Database thông qua Prisma Client]
      ▼
Database Engine (PostgreSQL / MySQL)
```

---

## 4. Thiết Kế Cơ Sở Dữ Liệu Dự Kiến (Prisma Schema Draft)

Dưới đây là thiết kế chi tiết dự kiến cho file `prisma/schema.prisma` hỗ trợ đầy đủ các yêu cầu nghiệp vụ của hệ thống:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Phân quyền vai trò người dùng (Actors)
enum UserRole {
  STUDENT       // Sinh viên
  TEACHER       // Giảng viên
  ACADEMIC_DEPT // Phòng Đào tạo
  ADMIN         // Quản trị hệ thống
}

// 2. Các trạng thái của báo cáo đề tài
enum SubmissionStatus {
  CHUA_NOP      // Chưa nộp bài
  DA_NOP        // Đã nộp bài hợp lệ
  DANG_CHAM     // Giảng viên đang xem & chấm điểm
  YEU_CAU_SUA   // Yêu cầu sinh viên chỉnh sửa lại
  DA_CHAM       // Giảng viên đã chấm xong
  CHO_DUYET     // Chờ Phòng Đào tạo phê duyệt kết quả cuối cùng
  HOAN_THANH    // Đã phê duyệt và công bố điểm
  TU_CHOI       // Từ chối (Vi phạm quy chế, đạo văn, nộp sai file)
}

// 3. Bảng Người Dùng Chung
model User {
  id          String    @id @default(uuid())
  email       String    @unique
  password    String
  fullName    String
  phoneNumber String?
  role        UserRole
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  student     Student?  // Liên kết 1-1 nếu role là STUDENT
  teacher     Teacher?  // Liên kết 1-1 nếu role là TEACHER
  comments    Comment[] // Các bình luận người dùng gửi
  logs        SystemLog[]

  @@map("users")
}

// 4. Bảng Giảng Viên
model Teacher {
  id          String       @id @default(uuid())
  teacherCode String       @unique // Mã giảng viên
  userId      String       @unique
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignments Assignment[] // Các phân công giảng dạy/quản lý lớp
  rubrics     Rubric[]     // Các rubric do giảng viên này thiết lập
  grades      Grade[]      // Các bản chấm điểm giảng viên đã thực hiện

  @@map("teachers")
}

// 5. Bảng Sinh Viên
model Student {
  id          String       @id @default(uuid())
  studentCode String       @unique // MSSV
  userId      String       @unique
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  classId     String
  class       Class        @relation(fields: [classId], references: [id])
  groupId     String?      // Nhóm đề tài sinh viên thuộc về (nếu làm nhóm)
  group       Group?       @relation(fields: [groupId], references: [id], onDelete: SetNull)
  submissions Submission[] // Các báo cáo sinh viên nộp cá nhân hoặc đại diện nhóm

  @@map("students")
}

// 6. Bảng Môn Học
model Subject {
  id          String   @id @default(uuid())
  subjectCode String   @unique // Mã môn học
  name        String
  classes     Class[]

  @@map("subjects")
}

// 7. Bảng Học Kỳ (Academic Term) - Phục vụ quản lý niên khóa và khóa điểm (UC-19)
model AcademicTerm {
  id        String   @id @default(uuid())
  name      String   @unique // Ví dụ: HK1-2025-2026, HK2-2025-2026
  startDate DateTime
  endDate   DateTime
  isLocked  Boolean  @default(false) // Trạng thái khóa điểm toàn học kỳ (UC-19)
  classes   Class[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("academic_terms")
}

// 8. Bảng Lớp Học
model Class {
  id          String       @id @default(uuid())
  classCode   String       @unique // Mã lớp học phần
  subjectId   String
  subject     Subject      @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  termId      String
  term        AcademicTerm @relation(fields: [termId], references: [id], onDelete: Restrict)
  students    Student[]
  assignments Assignment[] // Phân công giảng viên cho lớp này

  @@map("classes")
}

// 9. Bảng Nhóm Đề Tài
model Group {
  id          String       @id @default(uuid())
  name        String       // Tên nhóm (Ví dụ: Nhóm 1)
  topicName   String       // Tên đề tài báo cáo môn học
  classId     String
  students    Student[]
  submissions Submission[] // Báo cáo của nhóm

  @@map("groups")
}

// 10. Bảng Phân Công (Assignment) - Kết nối Giảng viên và Lớp học phần
model Assignment {
  id        String   @id @default(uuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  teacherId String
  teacher   Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([classId, teacherId])
  @@map("assignments")
}

// 11. Bảng Rubric Tiêu Chí Chấm Điểm
model Rubric {
  id          String     @id @default(uuid())
  title       String     // Tên bảng Rubric (Ví dụ: Rubric báo cáo cuối kỳ)
  description String?
  teacherId   String
  teacher     Teacher    @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  criteria    Criteria[] // Danh sách các tiêu chí chi tiết
  grades      Grade[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("rubrics")
}

// 12. Chi tiết tiêu chí thuộc Rubric
model Criteria {
  id          String   @id @default(uuid())
  rubricId    String
  rubric      Rubric   @relation(fields: [rubricId], references: [id], onDelete: Cascade)
  name        String   // Tên tiêu chí (Ví dụ: Bố cục, Nội dung, Thuyết trình)
  description String?  // Mô tả yêu cầu tiêu chí
  maxScore    Float    // Điểm tối đa cho tiêu chí này (Ví dụ: 10.0)
  weight      Float    // Trọng số tiêu chí (%) (Ví dụ: 30.0 tức 30%)
  createdAt   DateTime @default(now())

  @@map("criteria")
}

// 13. Bảng Báo Cáo / Bài Nộp (Submission)
model Submission {
  id              String           @id @default(uuid())
  studentId       String?          // Sinh viên đại diện nộp (nếu làm cá nhân)
  student         Student?         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  groupId         String?          // Hoặc Nhóm nộp bài (nếu làm nhóm)
  group           Group?           @relation(fields: [groupId], references: [id], onDelete: Cascade)
  filePath        String           // Đường dẫn file báo cáo chính (PDF, DOCX)
  attachments     String[]         // Danh sách file đính kèm, minh chứng (Source code, Excel)
  status          SubmissionStatus @default(CHUA_NOP)
  version         Int              @default(1)      // Dùng cho Optimistic Locking (OCC)
  editRequestNote String?          // Ghi chú của giảng viên khi yêu cầu sửa lại (UC-10)
  rejectReason    String?          // Lý do từ chối nếu báo cáo vi phạm (UC-15)
  submittedAt     DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  grades          Grade[]          // Kết quả chấm điểm theo rubric
  comments        Comment[]        // Lịch sử trao đổi bình luận gắn với báo cáo (UC-22)
  statusLogs      SubmissionLog[]  // Lịch sử chuyển đổi trạng thái báo cáo (UC-I04)

  @@map("submissions")
}

// 14. Lịch Sử Trạng Thái Báo Cáo (UC-I04)
model SubmissionLog {
  id           String           @id @default(uuid())
  submissionId String
  submission   Submission       @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  oldStatus    SubmissionStatus
  newStatus    SubmissionStatus
  actorId      String           // ID người thực hiện đổi trạng thái (Student, Teacher, AcademicDept, Admin)
  note         String?          // Ghi chú lý do chuyển đổi trạng thái
  createdAt    DateTime         @default(now())

  @@map("submission_logs")
}

// 15. Bảng Điểm Chấm Chi Tiết
model Grade {
  id           String     @id @default(uuid())
  submissionId String     @unique
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  rubricId     String
  rubric       Rubric     @relation(fields: [rubricId], references: [id])
  teacherId    String
  teacher      Teacher    @relation(fields: [teacherId], references: [id])
  detailedScores Json     // Điểm chi tiết lưu dưới dạng JSON khớp cấu trúc Criteria [{ criteriaId, score }]
  finalScore   Float      // Điểm tổng cuối cùng sau khi nhân trọng số (UC-I05)
  feedback     String?    // Nhận xét chung của giảng viên
  isApproved   Boolean    @default(false) // Trạng thái phê duyệt từ Phòng Đào tạo (UC-16)
  approvedById String?    // ID người phê duyệt thuộc Phòng Đào tạo
  version      Int        @default(1)     // Dùng cho Optimistic Locking (OCC)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@map("grades")
}

// 16. Bảng Bình Luận Trao Đổi (UC-22)
model Comment {
  id           String     @id @default(uuid())
  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  senderId     String
  sender       User       @relation(fields: [senderId], references: [id], onDelete: Cascade)
  content      String     // Nội dung trao đổi bình luận
  createdAt    DateTime   @default(now())

  @@map("comments")
}

// 17. Bảng Cấu Hình Hệ Thống (UC-14)
model SystemConfig {
  id          String   @id @default(uuid())
  key         String   @unique // Ví dụ: MAX_FILE_SIZE_MB, ALLOWED_FILE_EXTENSIONS, DUPLICATE_THRESHOLD_PERCENT
  value       String
  description String?
  updatedAt   DateTime @updatedAt

  @@map("system_configs")
}

// 17. Bảng Nhật Ký Hoạt Động Hệ Thống (UC-21)
model SystemLog {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action      String   // Thao tác (Ví dụ: LOGIN, SUBMIT_REPORT, GRADE_REPORT, LOCK_TERM)
  description String   // Chi tiết thao tác
  ipAddress   String?
  createdAt   DateTime @default(now())

  @@map("system_logs")
}
```

---

## 5. Danh Sách Hệ Thống API Thiết Kế (API Endpoints Specs)

Dưới đây là thiết kế chi tiết danh sách API Endpoint phiên bản 1 (`/api/v1`) bao quát toàn bộ 22 Use Case trong tài liệu:

### 5.1. Phân Hệ Xác Thực (Auth Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | UC-01 | Đăng nhập hệ thống, trả về JWT Token và User Info |
| `POST` | `/api/v1/auth/change-password` | All | UC-02 | Đổi mật khẩu cá nhân |
| `POST` | `/api/v1/auth/reset-password-request` | Public | UC-01 | Gửi yêu cầu cấp lại mật khẩu qua email |

### 5.2. Phân Hệ Người Dùng (User Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/profile` | Student, Teacher | UC-02 | Xem thông tin cá nhân và thông tin nhóm |
| `PUT` | `/api/v1/users/profile` | Student, Teacher | UC-02 | Cập nhật thông tin liên hệ (Email, SĐT) |
| `GET` | `/api/v1/users` | Admin | UC-13 | Xem danh sách tài khoản toàn hệ thống |
| `POST` | `/api/v1/users` | Admin | UC-13 | Tạo tài khoản người dùng mới thủ công |
| `PUT` | `/api/v1/users/:id/role-status` | Admin | UC-13 | Khóa/mở khóa hoặc cập nhật vai trò người dùng |

### 5.3. Phân Hệ Phân Công & Lớp Học (Assignment Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/assignments/import` | Admin | UC-12, UC-I06 | Nhập danh sách phân công môn học/giảng viên từ Excel/CSV |
| `GET` | `/api/v1/assignments/teacher/students` | Teacher | UC-07 | Giảng viên xem danh sách sinh viên/nhóm được phân công |
| `PUT` | `/api/v1/assignments/adjust` | Academic Dept | UC-17 | Phòng Đào tạo điều chỉnh phân công giảng viên |
| `GET` | `/api/v1/assignments/monitoring` | Academic Dept, Admin | UC-18 | Giám sát tiến độ toàn hệ thống |
| `GET` | `/api/v1/assignments/export/class/:classId` | Teacher | UC-11 | Xuất bảng điểm/thống kê lớp ra file Excel/PDF |

### 5.4. Phân Hệ Tiêu Chí Chấm Điểm (Rubric Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/rubrics` | Teacher, Student | UC-08 | Xem danh sách các bảng Rubric hiện có |
| `POST` | `/api/v1/rubrics` | Teacher | UC-08 | Tạo mới một bảng Rubric kèm các tiêu chí chi tiết |
| `PUT` | `/api/v1/rubrics/:id` | Teacher | UC-08 | Cập nhật thông tin/tiêu chí Rubric (Chỉ cho phép nếu chưa chấm) |
| `POST` | `/api/v1/rubrics/clone/:id` | Teacher | UC-08 | Sao chép cấu trúc Rubric từ đề tài/môn học khác |

### 5.5. Phân Hệ Nộp & Chấm Điểm Báo Cáo (Submission Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/submissions` | Student | UC-03, UC-I02 | Tải lên và nộp báo cáo chính thức (Chuyển sang `DA_NOP`) |
| `POST` | `/api/v1/submissions/resubmit` | Student | UC-04, UC-I02 | Nộp lại phiên bản báo cáo mới khi có yêu cầu sửa đổi |
| `GET` | `/api/v1/submissions/progress` | Student | UC-05, UC-I04 | Sinh viên theo dõi lịch sử nộp và lịch sử chuyển trạng thái |
| `GET` | `/api/v1/submissions/result` | Student | UC-06 | Xem điểm tổng và nhận xét chi tiết theo tiêu chí Rubric |
| `PUT` | `/api/v1/submissions/:id/grade` | Teacher | UC-09, UC-I05 | Nhập điểm chi tiết, tự động tính tổng điểm và lưu nhận xét |
| `POST` | `/api/v1/submissions/:id/edit-request` | Teacher | UC-10, UC-I03 | Gửi yêu cầu yêu cầu sinh viên chỉnh sửa lại báo cáo |
| `POST` | `/api/v1/submissions/:id/violation` | Teacher, Admin | UC-15, UC-I03 | Từ chối báo cáo và chuyển sang trạng thái `TU_CHOI` do vi phạm |
| `POST` | `/api/v1/submissions/:id/approve` | Academic Dept | UC-16, UC-I03 | Phê duyệt điểm cuối cùng để công bố, chuyển sang `HOAN_THANH` |
| `POST` | `/api/v1/submissions/:id/reject-grade` | Academic Dept | UC-16, UC-I03 | Phòng Đào tạo từ chối kết quả, yêu cầu giảng viên chấm lại |

### 5.6. Phân Hệ Thảo Luận & Bình Luận (Comment Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/submissions/:id/comments` | Teacher, Student | UC-22 | Xem toàn bộ lịch sử trao đổi bình luận của báo cáo |
| `POST` | `/api/v1/submissions/:id/comments` | Teacher, Student | UC-22, UC-I03 | Gửi bình luận mới gắn liền với báo cáo đề tài |

### 5.7. Phân Hệ Cấu Hình Hệ Thống (Config Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/configs` | Admin | UC-14 | Xem các cấu hình hệ thống hiện tại |
| `PUT` | `/api/v1/configs` | Admin | UC-14 | Cập nhật tham số hệ thống (Dung lượng, định dạng file,...) |

### 5.8. Phân Hệ Học Kỳ & Khóa Điểm (Term Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/terms` | Admin, Teacher, Student, Academic Dept | UC-19 | Xem danh sách học kỳ và trạng thái khóa/mở khóa |
| `POST` | `/api/v1/terms` | Admin | UC-19 | Tạo học kỳ mới trong năm học |
| `PUT` | `/api/v1/terms/:id/lock` | Admin | UC-19 | Khóa điểm số cuối học kỳ (Ngăn chặn mọi thay đổi điểm thuộc học kỳ này) |
| `PUT` | `/api/v1/terms/:id/unlock` | Admin | UC-19 | Mở khóa điểm học kỳ (Khi được phê duyệt xử lý đặc biệt) |

### 5.9. Phân Hệ Sao Lưu & Phục Hồi Dữ Liệu (Backup Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/backups` | Admin | UC-20 | Xem lịch sử các bản sao lưu hiện có trên máy chủ |
| `POST` | `/api/v1/backups` | Admin | UC-20 | Tạo bản sao lưu cơ sở dữ liệu vật lý thủ công |
| `POST` | `/api/v1/backups/restore` | Admin | UC-20 | Khôi phục hệ thống từ một file sao lưu chỉ định |

### 5.10. Phân Hệ Nhật Ký Hoạt Động (System Log Module)
| HTTP Method | Route Path | Quyền Truy Cập (Actors) | Use Case Liên Quan | Mô tả chức năng |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/logs` | Admin | UC-21 | Xem nhật ký hoạt động toàn hệ thống (Hỗ trợ phân trang, bộ lọc) |

---

## 6. Các Điểm Cần Lưu Ý Khi Triển Khai Chi Tiết (Guidelines)

Để đảm bảo bộ khung hoạt động đúng tính năng và đáp ứng tiêu chuẩn chất lượng cao:

1. **Nguyên tắc "Fail-Fast" ở Config**:
   - Khi khởi chạy server (`npm run dev` hoặc `npm start`), tầng `src/config/env.ts` bắt buộc phải được gọi đầu tiên để parse biến môi trường qua `Zod`. Nếu thiếu bất kỳ biến quan trọng nào (như `DATABASE_URL`, `JWT_SECRET`), hệ thống phải crash lập tức kèm thông báo chi tiết để tránh lỗi tiềm ẩn khi chạy.

2. **Middleware Validate Input**:
   - Mọi API nhận dữ liệu từ client (`Body`, `Query`, `Params`) đều phải đi kèm middleware `validate` (sử dụng Zod Schema định nghĩa ở `src/validators/*`) đặt trước Controller. Controller chỉ xử lý khi dữ liệu đã được làm sạch và đúng cấu trúc.

3. **Tính Điểm Tự Động (UC-I05)**:
   - Logic tính điểm tổng kết (`finalScore`) phải được thực thi hoàn toàn ở Backend (`submission.service.ts`) dựa trên công thức tích vô hướng của điểm từng tiêu chí chấm và trọng số tương ứng:
     $$\text{Final Score} = \sum (\text{Score}_i \times \text{Weight}_i)$$
   - Đảm bảo điểm số luôn được lưu trữ chính xác và không cho phép Client tự truyền trường `finalScore` lên API.

4. **Quản Lý Trạng Thái Báo Cáo chặt chẽ**:
   - Mọi hành vi cập nhật trạng thái của báo cáo (`CHUA_NOP` -> `DA_NOP` -> `DANG_CHAM` -> ...) đều phải đi qua Service có kiểm tra điều kiện chuyển đổi trạng thái hợp lệ và bắt buộc phải ghi log lại vào bảng `SubmissionLog` (UC-I04) để phục vụ theo dõi tiến độ.

5. **Gửi Thông Báo Tự Động (UC-I03)**:
   - Tận dụng `notification.service.ts` tích hợp trong luồng xử lý của Service để gửi mail tự động cho sinh viên khi giảng viên gửi "Yêu cầu sửa" (UC-10), "Từ chối do vi phạm" (UC-15) hoặc khi Phòng Đào tạo phê duyệt điểm công bố (UC-16).

---

## 7. Thiết Kế Cơ Chế Concurrency & Locking

Hệ thống quản lý chấm điểm báo cáo hoạt động trong môi trường đa tác nhân (Sinh viên, Giảng viên, Phòng Đào tạo, Admin) tương tác đồng thời trên cùng dữ liệu (Bài nộp, Điểm số, Rubric). Do đó, cơ chế kiểm soát tranh chấp dữ liệu (Concurrency Control) và Khóa (Locking) là bắt buộc ở tầng Service:

### 7.1. Kiểm Soát Giao Dịch Đồng Thời bằng Optimistic Locking (OCC)

#### A. Bài toán race condition thực tế:
- **Tình huống**: Giảng viên A đang mở trang chấm điểm cho Bài nộp X (phiên bản dữ liệu lúc 09:00, `version = 1`). Trong khi giảng viên đang nhập nhận xét kéo dài 5 phút, Sinh viên Y phát hiện sai sót và thực hiện **Nộp lại báo cáo** (UC-04) thành công lúc 09:02 (`status` chuyển từ `DA_NOP` sang `DA_NOP` mới, `version` tăng lên 2). Lúc 09:05, Giảng viên A nhấn lưu điểm.
- **Hệ quả nếu không xử lý**: Điểm số của Giảng viên A sẽ được áp đè lên phiên bản bài nộp mới nộp của sinh viên, gây sai lệch thông tin hoặc ghi đè dữ liệu không nhất quán.

#### B. Giải pháp áp dụng:
- Tích hợp cột `version` kiểu số nguyên tăng tự động trong model `Submission` và `Grade`.
- Khi client lấy dữ liệu để hiển thị, hệ thống bắt buộc gửi kèm trường `version`.
- Khi thực hiện ghi đè hoặc cập nhật (`PUT`), client gửi lại giá trị `version` đã đọc.
- Tầng Service thực hiện lệnh cập nhật bằng điều kiện `where` chứa cả `id` và `version`. Nếu bản ghi đã bị thay đổi bởi luồng khác, điều kiện `where` sẽ không khớp, `updateMany` trả về `count = 0`. Hệ thống sẽ lập tức rollback và trả lỗi `ConflictException` (HTTP 409).

#### C. Mã nguồn thiết kế mẫu ở tầng Service (`submission.service.ts`):
```typescript
import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../utils/apiResponse'; // Định nghĩa lỗi tập trung

const prisma = new PrismaClient();

export class SubmissionService {
  /**
   * Cập nhật thông tin điểm số bài báo cáo kèm Optimistic Locking
   */
  async gradeSubmission(submissionId: string, clientVersion: number, scoreData: any) {
    // Chạy trong một Transaction để đảm bảo tính toàn vẹn (ACID)
    return await prisma.$transaction(async (tx) => {
      // 1. Thực hiện update kết hợp kiểm tra phiên bản (OCC)
      const updateResult = await tx.submission.updateMany({
        where: {
          id: submissionId,
          version: clientVersion // Chỉ cập nhật nếu phiên bản khớp khớp hoàn toàn
        },
        data: {
          status: 'DA_CHAM',
          version: { increment: 1 } // Tự động tăng version lên +1
        }
      });

      // 2. Nếu count === 0 nghĩa là dữ liệu đã bị thay đổi trước đó bởi một tiến trình khác
      if (updateResult.count === 0) {
        throw new ConflictError(
          "Bài báo cáo đã được sinh viên cập nhật phiên bản mới hoặc bị thay đổi bởi người khác trong lúc bạn đang chấm. Vui lòng tải lại trang để lấy dữ liệu mới nhất."
        );
      }

      // 3. Tiến hành cập nhật bảng điểm chi tiết
      const grade = await tx.grade.upsert({
        where: { submissionId },
        update: {
          detailedScores: scoreData.detailedScores,
          finalScore: scoreData.finalScore,
          feedback: scoreData.feedback,
          version: { increment: 1 }
        },
        create: {
          submissionId,
          rubricId: scoreData.rubricId,
          teacherId: scoreData.teacherId,
          detailedScores: scoreData.detailedScores,
          finalScore: scoreData.finalScore,
          feedback: scoreData.feedback,
          version: 1
        }
      });

      return grade;
    });
  }
}
```

---

### 7.2. Kiểm Soát Nghiệp Vụ bằng Pessimistic / State-Level Locking (Business Guards)

Bên cạnh giải pháp kỹ thuật, hệ thống sử dụng các chốt chặn nghiệp vụ (Business Guards) tại tầng Service để ngăn chặn mọi thay đổi trạng thái không hợp lệ dựa trên trạng thái học kỳ hoặc trạng thái hiện tại của thực thể:

#### A. Khóa học kỳ cuối kỳ (Academic Term Lock Guard - UC-19)
- Khi Phòng Đào tạo duyệt toàn bộ điểm và Admin kích hoạt **Khóa kết quả học kỳ** (`isLocked = true` trong bảng `AcademicTerm`), hệ thống phải thực hiện khóa cứng.
- Mọi API sửa đổi dữ liệu (nộp bài, chấm điểm, sửa điểm, đổi trạng thái) liên quan đến lớp học phần thuộc học kỳ đó đều phải đi qua hàm kiểm duyệt trước khi tương tác DB.

#### B. Khóa Rubric khi đã bắt đầu chấm điểm (Rubric Lock Guard - UC-08)
- Khi một bảng Rubric đã được giảng viên liên kết và thực hiện chấm điểm cho ít nhất 1 bài nộp trong lớp học phần đó (đã tồn tại bản ghi trong bảng `Grade` có `rubricId`), hệ thống sẽ khóa chức năng chỉnh sửa tiêu chí hoặc trọng số của Rubric đó để tránh làm sai lệch điểm số đã chấm.

#### C. Mã nguồn thiết kế mẫu Business Lock Guards:
```typescript
import { PrismaClient } from '@prisma/client';
import { ForbiddenError } from '../utils/apiResponse';

const prisma = new PrismaClient();

export class BusinessLockGuard {
  /**
   * Guard 1: Kiểm tra trạng thái khóa của học kỳ dựa trên Class ID
   * Ngăn chặn mọi thao tác cập nhật điểm, nộp bài khi học kỳ đã đóng.
   */
  static async verifyTermActive(classId: string) {
    const classInfo = await prisma.class.findUnique({
      where: { id: classId },
      include: { term: true }
    });

    if (!classInfo) {
      throw new Error("Lớp học phần không tồn tại.");
    }

    if (classInfo.term.isLocked) {
      throw new ForbiddenError(
        `Mọi thao tác bị chặn do học kỳ [${classInfo.term.name}] đã đóng và khóa kết quả điểm số cuối kỳ.`
      );
    }
  }

  /**
   * Guard 2: Kiểm tra Rubric đã chấm điểm chưa trước khi cho phép sửa đổi tiêu chí
   */
  static async verifyRubricEditable(rubricId: string) {
    const activeGradesCount = await prisma.grade.count({
      where: { rubricId }
    });

    if (activeGradesCount > 0) {
      throw new ForbiddenError(
        "Bảng tiêu chí chấm điểm (Rubric) này đã được sử dụng để chấm bài. Không thể sửa đổi tiêu chí hoặc trọng số."
      );
    }
  }
}
```

---

## 8. Hướng Dẫn Khởi Chạy Dự Án Cục Bộ (Developer Setup Guide)

### 8.1. Chuẩn Bị File Môi Trường (`.env`)
Tạo file `.env` ở thư mục gốc của dự án dựa trên file mẫu `.env.example`:
```env
NODE_ENV=development
PORT=5000

# Kết nối cơ sở dữ liệu PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/report_grading_db?schema=public"

# Cấu hình bảo mật JWT
JWT_SECRET="vietnam-education-grading-system-secret-key-2026"
JWT_EXPIRES_IN="7d"
```

### 8.2. Cài Đặt và Khởi Chạy
Chạy các lệnh sau tại terminal thư mục dự án:
```powershell
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi tạo Prisma Client và đồng bộ DB schema
npx prisma generate
npx prisma migrate dev --name init_db_schema

# 3. Chạy Seed dữ liệu mẫu (Tạo Admin, Giảng viên, Sinh viên, Rubric mặc định)
npm run db:seed

# 4. Khởi chạy hệ thống ở môi trường Development (Hot-reload)
npm run dev
```

### 8.3. Các Scripts Hỗ Trợ trong `package.json`
- `npm run dev`: Chạy hot-reload server sử dụng `ts-node-dev`.
- `npm run build`: Biên dịch mã nguồn TypeScript thành Javascript sang thư mục `dist`.
- `npm run start`: Chạy server production từ thư mục `dist`.
- `npm run lint`: Kiểm tra chuẩn code conventions sử dụng ESLint.
- `npm run format`: Tự động format code sử dụng Prettier.
- `npm run test`: Chạy toàn bộ các kịch bản kiểm thử tự động với Jest.
- `npm run db:studio`: Mở giao diện quản trị cơ sở dữ liệu trực quan của Prisma Studio.
