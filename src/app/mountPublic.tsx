import { hydrateRoot } from "react-dom/client";
import { PublicPage } from "./PublicPage";

export function mountPublic(root: HTMLElement, pathname: string) {
  hydrateRoot(root, <PublicPage pathname={pathname} />);
}
