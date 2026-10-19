import { landingPhotos } from "../photos";

// The photos the client hearted in the walkthrough (all but the third).
const picked = landingPhotos.filter((_, index) => index !== 2).map((photo) => photo.file).join(", ");

export function LightroomBand() {
  return <section className="lp-dark">
    <div className="lp-wrap lp-lightroom">
      <div>
        <h2>Về đến Lightroom, đúng từng tấm.</h2>
        <p>Xuất CSV, dán cột tên file vào Library Filter › Text › Filename › Contains.</p>
      </div>
      <div className="lp-filter-box">
        <span>Filename · Contains</span>
        <span>{picked}</span>
      </div>
    </div>
  </section>;
}
