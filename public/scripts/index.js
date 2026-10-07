import Banner from "./banner.js";

const BannerStyles = new CSSStyleSheet();

// TODO import BannerStyles from "./banner.css" with { type: "css" };
BannerStyles.replaceSync(`
lliwio-banner {
}`);

document.adoptedStyleSheets.push(BannerStyles);
customElements.define("lliwio-banner", Banner);