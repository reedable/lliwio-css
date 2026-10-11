import FloatingLabel from "./floating-label.js";

const FloatingLabelStyles = new CSSStyleSheet();

// TODO import FloatingLabelStyles from "./floating-label.css" with { type: "css" };
FloatingLabelStyles.replaceSync(`
lliwio-floating-label {
  label.lliw.floating {
    &:has(input.FloatingLabel__input--empty:not(:focus)) {
      /* font-size: var(--label__font-size--big); */
      font-size: inherit;
      font-weight: inherit;
      padding-top: var(--paddingTop);
    }
  }
}`);

document.adoptedStyleSheets.push(FloatingLabelStyles);
customElements.define("lliwio-floating-label", FloatingLabel);