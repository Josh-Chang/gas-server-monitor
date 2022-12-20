// an excerpt from https://www.npmjs.com/package/validator
const Util = (() => {
  const assertString = (input) => {
    const isString = typeof input === 'string' || input instanceof String;

    if (!isString) {
      let invalidType = typeof input;
      if (input === null) invalidType = 'null';
      else if (invalidType === 'object') invalidType = input.constructor.name;

      throw new TypeError(`Expected a string but received a ${invalidType}`);
    }
  };

  const merge = (
    obj = { },
    defaults,
  ) => {
    for (const key in defaults) {
      if (typeof obj[key] === 'undefined') {
        obj[key] = defaults[key];
      }
    }

    return obj;
  };

  return {
    assertString,
    merge,
  };
})();
