const waitTill = async (ms) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, ms)
  );
};

module.exports = {
  waitTill,
};
