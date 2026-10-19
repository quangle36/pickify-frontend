// Real photos from album 5ec14278-e956-49b2-9c56-02da2d87359f (Glamping).
export const landingPhotos = [
  ["MQG07402", "Ảnh Glamping: ngồi trên ghế dã ngoại cùng ly nước"],
  ["MQG07525", "Ảnh Glamping: ngồi trên xích đu bên hồ"],
  ["MQG07615", "Ảnh Glamping: chân dung dưới ánh nắng chiều"],
  ["MQG07697", "Ảnh Glamping: chân dung góc nghiêng trong nắng vàng"],
].map(([file, alt]) => ({ file, alt, src: `/images/landing/glamping/${file}.webp` }));
