import { LegalPage } from "../../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Chính sách quyền riêng tư">
      <p>
        Lumipic dùng thông tin tài khoản Google để xác thực người dùng và chỉ
        truy cập các thư mục Google Drive mà người dùng chủ động kết nối.
      </p>
      <p>
        Dữ liệu ảnh được xử lý để tạo album và bản xem trước. Thông tin xác thực
        được mã hóa khi lưu trữ và không được bán cho bên thứ ba.
      </p>
      <p>
        Người dùng có thể thu hồi quyền truy cập trong phần bảo mật của Tài
        khoản Google và yêu cầu xóa dữ liệu qua email mqevoto@gmail.com.
      </p>
    </LegalPage>
  );
}
