export default class ObservedElement extends HTMLElement {
  constructor() {
    super();

    this.observer = new MutationObserver(() => {
      try {
        this.observer.disconnect();
        this.render();
      } finally {
        this.observer.observe(this, { childList: true });
      }
    });
  }

  connectedCallback() {
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }
}