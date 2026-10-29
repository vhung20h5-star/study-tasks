# Study Tasks

Ứng dụng quản lý việc học bằng HTML, CSS và JavaScript thuần. Không cần framework, npm, backend, API ngoài hoặc kết nối mạng.

## Cách chạy

1. Giữ `index.html`, `style.css` và `app.js` trong cùng thư mục.
2. Nhấp đúp `index.html` để mở bằng trình duyệt hiện đại (Chrome, Edge, Firefox hoặc Safari).
3. Nhập tên công việc và môn học, sau đó nhấn **Thêm công việc** hoặc Enter.

Tích ô cạnh công việc để đổi trạng thái, nhấn **Xóa** để xóa ngay. Ba nút lọc giúp xem tất cả, chưa hoàn thành hoặc đã hoàn thành. Công việc mới xuất hiện đầu danh sách và tự chuyển bộ lọc về **Tất cả**.

## Các file

| File | Vai trò |
| --- | --- |
| `index.html` | Cấu trúc giao diện tiếng Việt, biểu mẫu, bộ lọc và danh sách. Nạp script thông thường bằng `defer`. |
| `style.css` | Màu sắc, bố cục responsive, trạng thái hoàn thành và hiển thị focus bàn phím. |
| `app.js` | Kiểm tra dữ liệu, thêm/xóa/đổi trạng thái, lọc, thống kê và lưu/đọc localStorage. |
| `README.md` | Hướng dẫn chạy, mô tả và danh sách kiểm tra thủ công. |
| `.gitignore` | Bỏ qua file tạm, log và file riêng của hệ điều hành/trình soạn thảo. |

## Dữ liệu và hiển thị an toàn

- Cả tên công việc và môn học đều bắt buộc; khoảng trắng đầu/cuối được loại bỏ. Tên tối đa 200 ký tự, môn học tối đa 80 ký tự.
- Nội dung nhập được gán qua `textContent`, không chèn thành HTML và không thực thi mã.
- Dữ liệu được lưu tại khóa `study-tasks.v1` trong localStorage của trình duyệt. Không gửi dữ liệu ra ngoài và không đồng bộ giữa thiết bị/trình duyệt.
- Ứng dụng thông báo nếu không đọc hoặc ghi được dữ liệu; khi ghi thất bại, vẫn thao tác được trong phiên đang mở nhưng thay đổi có thể mất khi tải lại.
- Dữ liệu đã lưu sai cấu trúc được bỏ qua kèm thông báo. Dữ liệu mới được ghi khi bạn thêm, xóa hoặc đổi trạng thái công việc.
- Chính sách localStorage với URL `file://` có thể khác nhau giữa trình duyệt. Hãy dùng cùng trình duyệt và giữ nguyên vị trí file; di chuyển thư mục, xóa dữ liệu trình duyệt hoặc dùng chế độ riêng tư có thể làm dữ liệu không còn. Nếu trình duyệt chặn lưu trữ cho file cục bộ, thử trình duyệt khác cho phép tính năng này.

## Tự kiểm tra trên trình duyệt

1. Mở `index.html`: thấy thông báo danh sách trống; không có lỗi trong Console.
2. Thêm vài công việc ở các môn khác nhau; thử Enter để gửi biểu mẫu. Kiểm tra tên/môn học hiển thị đúng và số lượng, tiến độ được cập nhật.
3. Thử tên rỗng, chỉ có dấu cách, và môn học trống: không được thêm, có thông báo và focus vào ô cần sửa.
4. Tích/bỏ tích công việc; thử cả ba bộ lọc, kể cả khi một bộ lọc không có kết quả. Thêm việc khi đang xem **Đã hoàn thành** để kiểm tra việc mới xuất hiện.
5. Tải lại trang sau khi thêm/đổi trạng thái/xóa: kiểm tra dữ liệu vẫn đúng. Xóa hết để kiểm tra trạng thái trống.
6. Nhập `<img src=x onerror=alert(1)>` hoặc `<script>alert(1)</script>` làm tên và môn học: chỉ thấy văn bản, không có ảnh hoặc hộp thoại bật lên.
7. Kiểm tra ở cửa sổ laptop và màn hình điện thoại (320–390 px): không tràn ngang, tên dài tự xuống dòng, nút dễ bấm. Dùng Tab, Enter và Space để thao tác bằng bàn phím.
8. Nếu cần kiểm tra lỗi lưu trữ, chặn quyền lưu trữ trong trình duyệt rồi thử thêm công việc: ứng dụng phải cảnh báo thay vì ngừng hoạt động. Thử trên hồ sơ trình duyệt riêng để tránh ảnh hưởng dữ liệu đang dùng.
