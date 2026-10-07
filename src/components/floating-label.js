import Logger from "../utils/Logger.js";
import ObservedElement from "../utils/ObservedElement.js";

const logger = new Logger('FloatingLabel');

export default class FloatingLabel extends ObservedElement {
  inputEl;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.inputEl) {
      this.inputEl.removeEventListener('input', onInput);
    }
  }

  render() {
    const log = logger.entering('render');
    const labelEl = this.querySelector('label');

    if (!labelEl) {
      const innerHTML = this.innerHTML;
      this.innerHTML = `<label class="lliwio floating">${innerHTML}</label>`;
    }

    const inputEl = this.querySelector('input');

    if (this.inputEl !== inputEl) {
      log.info('rendering', this.inputEl, inputEl);
      inputEl.addEventListener('input', onInput);
      this.inputEl?.removeEventListener('input', onInput);
      this.inputEl = inputEl;

      if (!this.inputEl.value) {
        this.inputEl.classList.add('FloatingLabel__input--empty');
      }
    }

    log.exiting();
  }

  attributeChangedCallback(key, oldValue, newValue) {
    void key;
    void oldValue;
    void newValue;
  }

  // custom methods
}

function onInput(event) {
  const log = logger.entering('onInput');
  const currentTarget = event.currentTarget;
  const value = currentTarget.value;

  if (!value) {
    log.info('onInput add', currentTarget, value);
    currentTarget.classList.add('FloatingLabel__input--empty');
  } else {
    log.info('onInput remove', currentTarget, value);
    currentTarget.classList.remove('FloatingLabel__input--empty');
  }

  log.exiting();
}