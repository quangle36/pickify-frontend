import { initAnalytics } from "./lib/analytics/analytics";
import "./index.css";
import "./features/landing/pages/LandingPage/LandingPage.css";

const root = document.getElementById("root")!;
const pathname = root.dataset.prerenderPath;
if (pathname) {
  void import("./app/mountPublic").then(({ mountPublic }) => mountPublic(root, pathname));
} else {
  void import("./app/mountApp").then(({ mountApp }) => mountApp(root));
}

if (document.readyState === "complete") initAnalytics();
else window.addEventListener("load", initAnalytics, { once: true });
