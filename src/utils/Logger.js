export default function Logger(...context) {
  return Object.keys(console)
    .filter((k) => typeof console[k] === 'function')
    .reduce((logger, k) => {
      logger[k] = console[k].bind(console, `[${context.join(':')}]`);
      return logger;
    }, {
      entering: function (nestedContext) {
        this.context = [...context, nestedContext];
        const nestedLogger = new Logger(...this.context);
        nestedLogger.debug('entering');
        return nestedLogger;
      },
      exiting: function (result) {
        this.debug('exiting', result);
        return result;
      }
    });
}
