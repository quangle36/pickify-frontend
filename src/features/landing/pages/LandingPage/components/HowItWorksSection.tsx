const steps = [
  ["01", "Dán link Google Drive", "Tạo album từ thư mục ảnh. Lumipic tự quét và tạo preview."],
  ["02", "Khách thả tim chọn ảnh", "Gửi link, khách nhập mật khẩu và chạm tim ảnh ưng ý."],
  ["03", "Lấy đúng ảnh để hậu kì", "Lọc file RAW trên máy hoặc xuất danh sách cho Lightroom."],
];
export function HowItWorksSection() {
  return <section id="how-it-works" className="landing-section">
    <div className="landing-container">
      <div className="landing-section-head"><h2>Ba bước.<br />Một luồng rõ ràng.</h2><p>Từ folder ảnh trên Drive đến danh sách ảnh cần hậu kì.</p></div>
      <div className="landing-steps">{steps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </div>
  </section>;
}
export default HowItWorksSection;
