import { FC } from 'react';
import { XCircle, CheckCircle2, AlertOctagon, Sparkles, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ProblemSolution: FC = () => {
  return (
    <section id="problem-solution" className="py-16 sm:py-24 bg-stone-100/70 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="brand" className="mb-2 uppercase tracking-widest font-bold">
            Tại sao lại cần Pickify?
          </Badge>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Nỗi ám ảnh mang tên: "Khách gửi mã ảnh qua Zalo"
          </h3>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Nếu bạn là thợ chụp cưới, tiệc, phóng sự hay sự kiện, bạn chắc chắn đã từng phát ngấy với cảnh này:
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Painful Old Way */}
          <Card className="rounded-3xl p-6 sm:p-8 border-red-200 shadow-xs relative overflow-hidden flex flex-col justify-between bg-white">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-50 text-red-600 font-bold text-xs rounded-bl-2xl border-l border-b border-red-200">
              Cách truyền thống
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-stone-900">Gửi link Drive thô & chờ Zalo</h4>
                  <p className="text-xs text-stone-500">Mất 30–60 phút mò mẫm mỗi album</p>
                </div>
              </div>

              {/* Chat bubble simulation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-mono space-y-2 mb-6">
                <p className="text-stone-400 font-sans font-semibold text-[11px] uppercase tracking-wider">Tin nhắn của khách:</p>
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-stone-700 shadow-2xs leading-relaxed">
                  "Dạ em chọn các ảnh này ạ: IMG_0142, IMG_0145, IMG_0188 (chụp với mẹ), IMG_0219 (ảnh cười tươi nha anh), DSC_0411, 0412... với cả chú rể có chọn thêm 5 cái nữa mà em quên chưa lưu..."
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Google Drive load trên điện thoại rất nặng, hay giật lag và dễ nhầm thứ tự ảnh.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Khách gõ nhầm mã file, phải chụp màn hình khoanh tròn gửi qua lại rối rắm.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Cô dâu chú rể chọn 2 máy khác nhau, không có danh sách tim chung dẫn đến xung đột.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Photographer phải ngồi copy-paste từng tên file vào ô tìm kiếm Lightroom rất mệt mỏi.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-red-100 text-xs font-semibold text-red-600 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>Tiêu tốn trung bình 2–3 giờ làm việc mỗi tuần chỉ để gỡ rối mã ảnh.</span>
            </div>
          </Card>

          {/* The Pickify Way */}
          <Card className="bg-gradient-to-br from-white to-brand-50/40 rounded-3xl p-6 sm:p-8 border-2 border-brand-500 shadow-lg shadow-brand-500/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-600 text-white font-bold text-xs rounded-bl-2xl shadow-xs">
              Trải nghiệm Pickify
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-stone-900">1 Link Chọn Ảnh Thông Minh</h4>
                  <p className="text-xs text-brand-700 font-semibold">Khách chạm tim ❤️ — Xuất CSV trong 3 giây</p>
                </div>
              </div>

              {/* Demo preview bubble */}
              <div className="p-4 rounded-2xl bg-white border border-brand-200/80 text-xs space-y-2 mb-6 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 text-[11px] font-medium">
                  <span>Album: Tiệc cưới Tuấn & Trang</span>
                  <Badge variant="brand" className="font-bold">
                    ❤️ 42 / 78 đã chọn
                  </Badge>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-stone-800 text-xs">TuanTrang_ChonAnh_2026.csv</span>
                  </div>
                  <Badge variant="success" className="font-bold text-[11px]">
                    Sẵn sàng cho Lightroom
                  </Badge>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-stone-800 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Khách mở điện thoại không cần đăng nhập tài khoản Google hay tạo mật khẩu phức tạp.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Giao diện mượt mà: chạm tim ảnh to, lướt nhanh, xem toàn màn hình (lightbox) sắc nét.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Một danh sách tim chung thời gian thực (SSE), cô dâu và chú rể thả tim đồng thời không bao giờ lệch.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Xuất file CSV chuẩn UTF-8 BOM, nhập thẳng vào Lightroom Library Filter chỉ 1 click.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-100 text-xs font-bold text-brand-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chuyên nghiệp hóa hình ảnh studio và tiết kiệm 95% thời gian xử lý file.</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default ProblemSolution;
