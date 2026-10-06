import { renderToString } from "react-dom/server";
import { PublicPage } from "./PublicPage";
export { publicPages, getPageSeo, SITE_ORIGIN } from "./seo";

export function renderPage(pathname: string) {
  return renderToString(<PublicPage pathname={pathname} />);
}
