import ObservedElement from "../../src/utils/ObservedElement.js";
import Logger from "../utils/Logger.js";

const logger = new Logger('Banner');

export default class Banner extends ObservedElement {
  #title;

  constructor() {
    super();
  }

  connectedCallback() {
    const log = logger.entering('connectedCallback');
    super.connectedCallback();
    this.render();
    log.exiting();
  }

  disconnectedCallback() {
    const log = logger.entering('disconnectedCallback');
    super.disconnectedCallback();
    log.exiting();
  }

  render() {
    const log = logger.entering('render');

    window.title = `${this.#title}`;

    log.exiting();
  }

  attributeChangedCallback(key, oldValue, newValue) {
    void key;
    void oldValue;
    void newValue;
  }

  // custom methods

  set title(value) {
    this.#title = value;
    this.render();
  }
}