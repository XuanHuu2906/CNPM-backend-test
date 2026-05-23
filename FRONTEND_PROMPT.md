# MASTER PROMPT: XÂY DỰNG FRONTEND CHO HỆ THỐNG CHẤM ĐIỂM BÁO CÁO ĐỀ TÀI MÔN HỌC

Bạn là một chuyên gia lập trình Frontend Senior và UI/UX Designer xuất sắc. Nhiệm vụ của bạn là xây dựng toàn bộ ứng dụng Client-Side (Frontend) hoàn chỉnh, tương thích 100% với hệ thống Backend đã có (được phát triển bằng Express.js + Prisma ORM + SQL Server).

---

## 1. THÔNG TIN CÔNG NGHỆ & YÊU CẦU KIẾN TRÚC

### Stack công nghệ cốt lõi
1. **Framework**: React.js (TypeScript) + Vite để build tối ưu, khởi động nhanh.
2. **Styling & UI Components**: Tailwind CSS + ShadcnUI (sử dụng Radix UI làm nền tảng) + Lucide React (Icons).
3. **State Management & Data Fetching**: React Query (TanStack Query) v5 để quản lý cache, đồng bộ trạng thái server và auto-refetch.
4. **API Client**: Axios được đóng gói thành lớp Service sạch sẽ, tích hợp Interceptors để xử lý JWT Token (`Authorization: Bearer <token>`) và bắt lỗi tập trung (Global Error Handler).
5. **Form & Validation**: React Hook Form kết hợp với Zod Schema nhằm xác thực dữ liệu chặt chẽ ngay tại Client trước khi gửi lên API.
6. **Charts/Visualization**: Recharts để dựng các biểu đồ thống kê trực quan cho Phòng Đào tạo và Admin.

### Quy định kiến trúc mã nguồn (Directory Structure)
Mã nguồn Frontend phải được tổ chức sạch sẽ, dễ bảo trì:
```text
src/
├── assets/             # Hình ảnh tĩnh, logo, CSS toàn cục
├── components/         # Các UI components tái sử dụng (Button, Input, Table, Modal...)
│   └── ui/             # Các ShadcnUI nguyên tử (atom components)
├── config/             # Biến môi trường, hằng số hệ thống, cấu hình Axios
├── contexts/           # AuthContext, ThemeContext (Quản lý trạng thái đăng nhập, Dark/Light mode)
├── hooks/              # Custom hooks (useAuth, useNotification, useLocalStorage...)
├── layouts/            # Layouts theo vai trò (Sidebar, Header kèm Notification Dropdown, MainLayout)
├── pages/              # Các màn hình chính phân loại theo Actor
│   ├── auth/           # Login, ForgotPassword, ResetPassword, ChangePassword
│   ├── student/        # Sinh viên (Nộp bài, Theo dõi tiến độ, Nhóm, Điểm, Trao đổi)
│   ├── teacher/        # Giảng viên (Danh sách lớp, Tiêu chí Rubric, Phòng chấm điểm, Yêu cầu sửa)
│   ├── academic/       # Phòng Đào tạo (Giám sát, Duyệt điểm, Phân công giảng dạy, Học kỳ)
│   └── admin/          # Quản trị viên (Tài khoản, Import dữ liệu, Log, Cấu hình, Backup)
├── services/           # Các hàm gọi API tương ứng 100% với Backend routes (authService, userService, rubricService, submissionService...)
├── types/              # Định nghĩa Interfaces/Types đồng bộ với Prisma schema ở backend
└── utils/              # Tiện ích định dạng ngày tháng, dọn dẹp file, xử lý điểm số
```

---

## 2. THIẾT KẾ UI/UX PREMIUM (WOW AESTHETICS)

Giao diện không được thiết kế sơ sài dạng MVP cơ bản mà phải mang lại cảm giác cực kỳ cao cấp (premium), mượt mà, thu hút người dùng từ cái nhìn đầu tiên:
- **Tông màu chủ đạo**: Sử dụng bảng màu hiện đại. Dark Mode (nền Slate 900, text Gray 100, accent Violet 500) và Light Mode (nền Gray 50, panel trắng tinh khiết, viền mỏng Slate 200, accent Indigo 600).
- **Glassmorphism**: Áp dụng hiệu ứng nền mờ, bo góc lớn (`rounded-2xl`), đổ bóng mịn (`shadow-xl`) cho các Dashboard Widgets và Modals.
- **Micro-Animations**: Sử dụng `framer-motion` để áp dụng chuyển động mượt mà khi đổi trang, hover vào các nút bấm, mở sidebar, mở modal và cập nhật trạng thái tải dữ liệu (Shimmer/Skeleton Loading).
- **Hạn chế Placeholder**: Mọi hình ảnh, trạng thái trống (Empty State) đều phải được dựng bằng hình ảnh SVG sinh động hoặc icon được thiết kế chỉn chu, kèm text hướng dẫn rõ ràng.
- **Tương thích Responsive**: Hoạt động mượt mà trên Mobile (đặc biệt là giao diện của Sinh viên để nộp bài và xem điểm) và tối ưu hiển thị bảng dữ liệu lớn trên Desktop (cho Giáo viên, PDT, Admin).

---

## 3. PHÂN TÍCH ACTORS & PHÂN QUYỀN ROUTING (AUTHENTICATION & AUTHORIZATION)

Hệ thống hỗ trợ 4 vai trò (Roles) tương ứng với 4 Actors chính:
- `STUDENT` (Sinh viên)
- `TEACHER` (Giảng viên)
- `ACADEMIC_DEPT` (Phòng Đào Tạo)
- `ADMIN` (Quản trị hệ thống)

### Luồng Xác thực (Auth Flow)
- **Đăng nhập (UC-01)**: Form đăng nhập bắt mắt, có hiệu ứng chuyển đổi Light/Dark mode. Khi đăng nhập thành công, lưu JWT vào `localStorage` hoặc Secure Cookie. Đồng thời lấy thông tin người dùng (`User` + `Role`) lưu vào `AuthContext`.
- **Đổi mật khẩu (UC-02)**: Đối với tài khoản đăng nhập lần đầu tiên bằng mật khẩu mặc định, bắt buộc hiển thị Modal yêu cầu đổi mật khẩu cá nhân trước khi cho phép vào Dashboard.
- **Quên mật khẩu (UC-I04)**: Luồng gửi email yêu cầu cấp lại mật khẩu -> nhận token qua email -> điền mật khẩu mới kèm xác thực token.
- **Route Guards**:
  - `PublicRoute`: Cho phép truy cập khi chưa đăng nhập (Login, ForgotPassword).
  - `PrivateRoute`: Bắt buộc đăng nhập. Nếu chưa đăng nhập, chuyển hướng về `/login`.
  - `RoleRoute`: Kiểm tra vai trò của người dùng hiện tại có khớp với quyền truy cập trang hay không. Nếu không khớp, hiển thị trang `403 Forbidden` được thiết kế đẹp mắt.

---

## 4. CHI TIẾT CÁC PHÂN HỆ MÀN HÌNH THEO VAI TRÒ (DASHBOARDS & PAGES)

### 4.1. GIAO DIỆN SINH VIÊN (STUDENT WORKSPACE)

#### A. Trang chủ & Dòng thời gian tiến độ (UC-05 - Theo dõi tiến độ)
- **Widget tóm tắt**: Hiển thị tên đề tài, mã nhóm, thông tin lớp học phần, tên giảng viên phụ trách và hạn nộp bài (đếm ngược thời gian thực dạng Countdown Card).
- **Dòng thời gian tương tác (Interactive Timeline)**: Thể hiện chuỗi trạng thái của bài báo cáo trực quan bằng sơ đồ ngang/dọc (Progress Stepper):
  `CHUA_NOP` (Gray) ➔ `DA_NOP` (Blue) ➔ `DANG_CHAM` (Amber) ➔ `YEU_CAU_SUA` (Red) / `DA_CHAM` (Purple) ➔ `CHO_DUYET` (Pink) ➔ `HOAN_THANH` (Green) / `TU_CHOI` (Rose).
  *Mỗi nút trạng thái khi click vào sẽ hiện chi tiết lịch sử (Thời gian, người thực hiện đổi trạng thái, lý do/ghi chú đi kèm - UC-I04).*

#### B. Thành lập nhóm & Đăng ký đề tài (UC-05, UC-06)
- **Trường hợp tự quản lý nhóm**: Nút "Thành lập nhóm", cho phép sinh viên tìm kiếm MSSV của các bạn khác cùng lớp học phần để thêm vào danh sách nhóm (tối đa theo tham số cấu hình hệ thống).
- **Form đăng ký đề tài**: Ô nhập Tên đề tài nghiên cứu (`topicName`). Cho phép cập nhật/sửa tên đề tài (nếu chưa bị khóa bởi Giảng viên/PDT).
- **Sự can thiệp của Giảng viên/PDT (UC-07)**: Ngoài sinh viên, giao diện Giảng viên và Phòng Đào tạo cũng có quyền thay đổi, thêm/bớt sinh viên vào nhóm trong các trường hợp đặc biệt.

#### C. Khu vực nộp báo cáo (UC-03, UC-04 - Nộp & Nộp lại)
- **Kéo thả tệp tin (Drag & Drop Zone)**: Sử dụng thư viện dạng `react-dropzone`.
  - Kiểm tra dung lượng file (tối đa 50MB hoặc theo config) và định dạng mở rộng (PDF, Word, ZIP) trực tiếp tại Client trước khi upload (UC-I02).
  - Hiển thị thanh tiến trình upload trực quan (File Upload Progress Bar).
  - Cho phép đính kèm tài liệu minh chứng phụ (Source code, Excel dữ liệu) dạng danh sách tệp đính kèm.
- **Cơ chế nộp lại (Resubmit)**: Khi trạng thái là `YEU_CAU_SUA`, hiển thị nổi bật hộp thoại "Ghi chú yêu cầu sửa từ Giảng viên" (`editRequestNote`), nút "Tải lên phiên bản mới" để tự động tăng chỉ số `version` và lưu lịch sử phiên bản cũ để so sánh chéo.

#### D. Trang xem kết quả chấm điểm & Thảo luận (UC-06, UC-22)
- **Bảng điểm Rubric chi tiết**: Khi trạng thái là `HOAN_THANH`, hiển thị bảng điểm trực quan. Hiển thị danh sách tiêu chí con, điểm tối đa, trọng số, điểm đạt được của sinh viên và nhận xét riêng của giảng viên cho từng tiêu chí đó.
- **Tổng điểm quy đổi**: Hiển thị điểm tổng kết cuối cùng (`finalScore`) siêu lớn ở trung tâm, đi kèm huy hiệu đánh giá học lực (Ví dụ: Xuất sắc, Giỏi, Khá, Trung bình).
- **Khung thảo luận trực tuyến (Comment Chat Box)**: Khung chat dạng Messenger đặt ngay bên cạnh bài nộp báo cáo. Sinh viên và giảng viên có thể bình luận qua lại, đính kèm file ảnh/tài liệu hỗ trợ. Tích hợp Real-time (hoặc polling định kỳ) để tự động hiển thị bình luận mới.

---

### 4.2. GIAO DIỆN GIẢNG VIÊN (TEACHER EVALUATION HUB)

#### A. Trang quản lý lớp học phần & Sinh viên (UC-07)
- **Menu chọn lớp**: Danh sách các lớp học phần được phân công dạy trong học kỳ hiện tại.
- **Bảng danh sách Nhóm/Sinh viên**:
  - Cột thông tin: Tên nhóm, Tên đề tài, Sinh viên đại diện, MSSV, Trạng thái bài nộp (Badge màu sắc tương ứng), Ngày nộp gần nhất, Điểm số (nếu có).
  - **Bộ lọc thông minh**: Lọc nhanh danh sách sinh viên theo Trạng thái báo cáo (Ví dụ: Đã nộp chưa chấm, Đang chấm, Yêu cầu sửa, Đã hoàn thành).
  - Thanh tìm kiếm theo Tên sinh viên, MSSV hoặc Tên đề tài.

#### B. Thiết lập bảng tiêu chí chấm điểm - Rubric Designer (UC-08)
- **Trình tạo Rubric tương tác**:
  - Giảng viên có thể thêm/bớt các tiêu chí chấm điểm (`Criteria`).
  - Mỗi tiêu chí gồm: Tên tiêu chí, Mô tả hướng dẫn chấm, Điểm số tối đa, Trọng số (%).
  - **Trình giám sát thời gian thực**: Khi giảng viên gõ, hệ thống tự động cộng dồn tổng trọng số (%) và hiển thị cảnh báo lỗi bằng màu đỏ nếu tổng khác 100%. Nút "Lưu bảng điểm" chỉ mở khóa (Enable) khi tổng trọng số đúng bằng 100%.
  - **Chức năng sao chép (Clone)**: Nút "Chọn từ Rubric mẫu" hoặc "Sao chép từ lớp khác" để tái sử dụng nhanh cơ cấu điểm.
  - *Bảo vệ nghiệp vụ*: Nếu Rubric đã được dùng để chấm điểm cho ít nhất 1 bài nộp, khóa cứng form sửa đổi tiêu chí, hiển thị thông báo "Rubric này đã được áp dụng, không thể chỉnh sửa".

#### C. Phòng chấm điểm trực quan - Dual-Panel Evaluation Workshop (UC-09, UC-10, UC-15)
Giao diện chấm điểm được chia đôi màn hình cực kỳ chuyên nghiệp (Split Screen Layout):
- **Bên trái (Document Viewer)**: Trình xem tệp PDF trực tiếp (hoặc Iframe nhúng văn bản đọc trực tuyến). Danh sách các file đính kèm phụ (Source code, Excel) để tải về nhanh chỉ bằng một cú click.
- **Bên phải (Interactive Grading Form)**:
  - Form nhập điểm chi tiết dựa trên Rubric đã cấu hình cho lớp đó. Mỗi tiêu chí có một ô nhập điểm (hoặc thanh trượt Slider mượt mà) kèm hướng dẫn chấm hiện ra khi hover.
  - Ô nhập nhận xét chung của giảng viên (`feedback`).
  - **Bộ máy tính điểm tự động**: Hiển thị tổng điểm tạm tính thời gian thực (Live Final Score Calculator) theo công thức nhân trọng số: `DiemTong = Sum(Diem_i * TrongSo_i)`.
  - **Hệ thống nút hành động**:
    - `Lưu nháp (Draft)`: Lưu tạm điểm và nhận xét lên server mà chưa khóa trạng thái (bài nộp chuyển sang hoặc giữ ở `DANG_CHAM`).
    - `Xác nhận chấm xong`: Khóa điểm, tự động tính toán và gửi kết quả chờ duyệt lên Phòng Đào tạo (chuyển sang `CHO_DUYET`).
    - `Yêu cầu sửa (Request Edit)`: Mở Modal yêu cầu sinh viên sửa lại, nhập ghi chú sửa (`editRequestNote`), bài nộp chuyển sang `YEU_CAU_SUA`.
    - `Từ chối do vi phạm (Reject/Violation)`: Mở Modal xử lý vi phạm, nhập lý do từ chối (đạo văn, sai đề tài...), bài nộp chuyển sang `TU_CHOI`.

#### D. Xuất báo cáo & Bảng điểm (UC-11)
- Nút "Xuất dữ liệu lớp học phần" cho phép giảng viên tải xuống file Excel hoặc PDF chứa danh sách sinh viên, tên đề tài, điểm chi tiết từng tiêu chí, điểm tổng kết và nhận xét đã được định dạng chuyên nghiệp để nộp về khoa.

---

### 4.3. GIAO DIỆN PHÒNG ĐÀO TẠO (ACADEMIC DEPARTMENT WORKSPACE)

#### A. Màn hình giám sát tiến độ toàn khoa - Analytical Dashboard (UC-18)
- **Hệ thống biểu đồ trực quan (Dashboard Cards & Graphs)**:
  - Thống kê tổng số lớp học phần, tổng số giảng viên, tổng số sinh viên trong kỳ học hiện tại.
  - Biểu đồ tròn (Pie Chart) thể hiện tỷ lệ phân bố trạng thái báo cáo (Bao nhiêu % chưa nộp, đã nộp, đang chấm, chờ duyệt, hoàn thành).
  - Biểu đồ cột (Bar Chart) so sánh tiến độ chấm điểm giữa các môn học hoặc các lớp học phần.
  - Biểu đồ đường (Line Chart) thể hiện lượng bài nộp qua các ngày cận deadline.

#### B. Không gian phê duyệt kết quả bảng điểm (UC-16)
- **Danh sách chờ phê duyệt (Pending Approvals)**: Liệt kê các lớp học phần hoặc các bài nộp đơn lẻ đã được giảng viên chấm xong và gửi lên (`CHO_DUYET`).
- **Màn hình kiểm duyệt chi tiết**:
  - Xem chi tiết thông tin bài nộp, tệp báo cáo, bảng điểm Rubric đã chấm, điểm tổng và nhận xét của giáo viên.
  - **Nút hành động nhanh**:
    - `Phê duyệt (Approve)`: Đồng ý công bố kết quả. Chuyển trạng thái sang `HOAN_THANH` (sinh viên sẽ lập tức xem được điểm và nhận email thông báo).
    - `Trả về chấm lại (Reject Grade)`: Nhập lý do trả về cụ thể (Ví dụ: Chấm sai tiêu chí, nhận xét chưa thỏa đáng). Trạng thái quay về `DANG_CHAM`, gửi thông báo cho giảng viên chấm lại.

#### C. Điều phối & Phân công giảng dạy (UC-17)
- Hiển thị danh sách các lớp học phần và giảng viên phụ trách hiện tại.
- Cho phép thay đổi giảng viên phụ trách lớp học phần bằng giao diện kéo thả (Drag and Drop) hoặc form chọn nhanh.
- Hiển thị lịch sử điều chỉnh phân công (Giảng viên cũ, giảng viên mới, lý do thay đổi, thời gian, người thực hiện).

#### D. Quản lý học kỳ & Niên khóa (UC-19)
- Tạo mới học kỳ (`AcademicTerm`) kèm ngày bắt đầu và kết thúc.
- Danh sách các học kỳ hiện tại. Có công cụ Toggle Switch để **Khóa kết quả học kỳ** (`isLocked = true`).
- *Cảnh báo trực quan*: Khi học kỳ bị khóa, hiển thị banner màu đỏ đậm toàn cục trên tất cả tài khoản liên quan "Học kỳ này đã bị khóa điểm, mọi chức năng nộp bài, chỉnh sửa điểm số đều bị vô hiệu hóa".

#### E. Quản lý Môn học & Lớp học phần (UC-13)
- Giao diện tra cứu danh sách Môn học và Lớp học phần trong hệ thống.
- Form tạo mới thủ công Môn học (Mã môn, Tên môn) và Lớp học phần (Mã lớp, Môn học, Học kỳ) dành cho các trường hợp phát sinh không qua Import hàng loạt.

---

### 4.4. GIAO DIỆN QUẢN TRỊ HỆ THỐNG (ADMIN CONTROL PANEL)

#### A. Quản lý tài khoản toàn hệ thống (UC-13)
- Bảng Grid chứa danh sách tài khoản toàn hệ thống hỗ trợ phân trang, tìm kiếm và bộ lọc theo vai trò (`Role`) và trạng thái hoạt động (`isActive`).
- Form thêm mới tài khoản thủ công: Nhập email, họ tên, số điện thoại, chọn vai trò và điền mã số định danh tương ứng (MSSV cho Student, Mã giảng viên cho Teacher, Mã nhân viên cho PDT).
- Công cụ đặt lại mật khẩu mặc định nhanh cho người dùng khi được yêu cầu.
- Toggle Switch để Khóa/Mở khóa tài khoản ngay lập tức.

#### B. Nhập dữ liệu phân công hàng loạt - Batch Importer (UC-12)
- Khu vực tải lên tệp tin Excel/CSV để nhập hàng loạt: Học kỳ, Môn học, Lớp học phần, Danh sách Sinh viên, Danh sách Giảng viên và bảng Phân công.
- Tải về file biểu mẫu Excel chuẩn (Download Template).
- **Trình xem trước dữ liệu (Data Previewer)**: Khi import file, Frontend hiển thị dữ liệu dạng bảng lưới để Admin kiểm tra trước khi xác nhận. Đánh dấu đỏ nổi bật tại các dòng dữ liệu bị lỗi (Ví dụ: Mã lớp bị trống, MSSV trùng lặp) kèm mô tả lỗi cụ thể tại Client.

#### C. Nhật ký hoạt động hệ thống - System Audit Trail (UC-21)
- Bảng hiển thị nhật ký lịch sử thao tác của tất cả người dùng trong hệ thống.
- Hỗ trợ phân trang, lọc theo Khoảng thời gian (Date Range), lọc theo Thao tác (Ví dụ: LOGIN, SUBMIT_REPORT, GRADE_REPORT, LOCK_TERM) hoặc lọc theo tên tài khoản thực hiện.

#### D. Sao lưu & Khôi phục dữ liệu (UC-20)
- Nút "Tạo bản sao lưu ngay lập tức (Backup Now)": Gọi API backend để kết xuất database thành file JSON dự phòng và tải trực tiếp về máy Admin.
- Danh sách các bản sao lưu đã có trên máy chủ kèm thông tin kích thước file, thời gian tạo, loại sao lưu (Tự động/Thủ công).
- Nút "Khôi phục dữ liệu (Restore)": Mở hộp thoại cảnh báo rủi ro cao, yêu cầu Admin nhập chữ xác nhận "KHOI_PHUC" trước khi cho phép tải lên file sao lưu và kích hoạt tiến trình khôi phục.

#### E. Cấu hình tham số hệ thống (UC-14)
- Giao diện quản lý các tham số vận hành:
  - Dung lượng file tối đa cho phép (`MAX_FILE_SIZE_MB`).
  - Các định dạng file báo cáo hợp lệ (`ALLOWED_FILE_EXTENSIONS`).
  - Ngưỡng phần trăm cảnh báo trùng lặp đạo văn tối đa (`DUPLICATE_THRESHOLD_PERCENT`).
- Cho phép chỉnh sửa giá trị cấu hình trực tiếp và lưu lại áp dụng tức thì.

---

### 4.5. CÁC THÀNH PHẦN DÙNG CHUNG (UNIVERSAL COMPONENTS)

#### A. Hệ thống Thông báo toàn cục (Global Notification Feed)
- Chuông thông báo (Bell Icon) đặt trên thanh Header, có bộ đếm số lượng thông báo chưa đọc (badge nổi bật).
- Dropdown hiển thị danh sách thông báo mới nhất (được fetch từ API `/api/v1/notifications`).
- Thể hiện các loại thông báo: Đến hạn nộp bài, Giảng viên yêu cầu sửa bài, Điểm đã được phê duyệt, v.v.
- Khi click vào thông báo, tự động gọi API đánh dấu đã đọc (`isRead = true`) và điều hướng người dùng đến trang chi tiết bài nộp tương ứng.

---

## 5. CƠ CHẾ KIỂM SOÁT TRANH CHẤP DỮ LIỆU ĐỒNG THỜI (OPTIMISTIC LOCKING - OCC)

Đây là yêu cầu kỹ thuật vô cùng quan trọng để hệ thống đạt chuẩn chất lượng cao, ngăn ngừa ghi đè dữ liệu sai lệch khi nhiều người cùng thao tác (ví dụ: sinh viên nộp lại bài đúng lúc giáo viên đang chấm):

1. **Lưu trữ biến `version`**:
   - Khi Frontend fetch thông tin chi tiết của một bài nộp (`Submission`) hoặc điểm số (`Grade`), bắt buộc phải lấy và lưu trữ biến số nguyên `version` đi kèm vào state của component.
2. **Gửi kèm `version` trong API request**:
   - Khi gửi yêu cầu cập nhật trạng thái bài nộp (duyệt, nộp lại) hoặc lưu điểm, Frontend bắt buộc phải đóng gói trường `version` này vào trong Body của request gửi lên Backend.
3. **Xử lý lỗi Tranh Chấp (HTTP 409 Conflict)**:
   - Viết một hàm bắt lỗi tập trung trong Axios Interceptor hoặc hàm xử lý của React Query.
   - Khi Backend trả về mã lỗi `409 Conflict` (Ví dụ: do sinh viên nộp bài bản mới làm sai lệch số `version` mà giảng viên đang mở), Frontend phải hiển thị một Dialog cảnh báo thiết kế nổi bật màu đỏ:
     > **"Dữ liệu đã bị thay đổi bởi người khác!"**
     > "Bài báo cáo này đã được cập nhật phiên bản mới nhất bởi sinh viên (hoặc trạng thái đã thay đổi) trong lúc bạn đang thực hiện chấm điểm. Để tránh mất dữ liệu, vui lòng tải lại trang để cập nhật thông tin mới nhất."
   - Đi kèm nút "Tải lại trang (Reload)" để tự động refetch dữ liệu mới nhất.

---

## 6. KỊCH BẢN KIỂM THỬ FRONTEND & ĐẢM BẢO CHẤT LƯỢNG (QA)

Hãy đảm bảo code Frontend được viết bao phủ các kịch bản kiểm thử sau:
1. **Kiểm thử Luồng Sinh viên**: Đăng nhập ➔ Vào Timeline thấy `CHUA_NOP` ➔ Chọn file PDF > 50MB hệ thống báo lỗi ➔ Chọn file 10MB nộp thành công ➔ Timeline chuyển sang `DA_NOP` ➔ Chat thử bình luận ➔ Xem điểm số khi trạng thái hoàn thành.
2. **Kiểm thử Luồng Giảng viên**: Đăng nhập ➔ Chọn lớp ➔ Tạo Rubric có tổng trọng số 90% hệ thống báo lỗi đỏ, sửa lại thành 100% lưu thành công ➔ Mở Dual-panel chấm điểm một bài nộp ➔ Nhập điểm vượt thang điểm tối đa hệ thống báo lỗi ➔ Nhập điểm hợp lệ bấm Lưu nháp ➔ Bấm chấm xong gửi lên chờ duyệt.
3. **Kiểm thử Luồng Phòng Đào tạo**: Đăng nhập ➔ Xem biểu đồ tiến độ ➔ Mở bài nộp chờ duyệt ➔ Bấm Trả về bắt nhập lý do ➔ Bấm Duyệt thành công ➔ Vào Học kỳ bấm Khóa học kỳ ➔ Xác nhận tài khoản Giảng viên và Sinh viên bị vô hiệu hóa các nút sửa đổi dữ liệu.
4. **Kiểm thử Đồng thời (OCC)**: Mở hai tab trình duyệt giả lập. Tab 1: Giảng viên mở trang chấm điểm (lấy `version = 1`). Tab 2: Sinh viên nộp lại bài (lên `version = 2`). Tab 1: Giảng viên lưu điểm ➔ Hệ thống hiện Modal báo lỗi Tranh chấp dữ liệu (Conflict 409) thành công và không cho ghi đè điểm.

---

Hãy tiến hành sinh mã nguồn Frontend chi tiết, cấu trúc gọn gàng, giao diện đẹp đẽ, viết các dịch vụ API logic kết nối chuẩn xác theo hướng dẫn trên!
