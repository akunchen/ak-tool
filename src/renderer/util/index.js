/**
 * 简单转换
 * @param {Function} func callback方法
 * @returns {Promise}
 */
export const singleParse = func => {
  return new Promise((success, fail) => {
    func((...args) => {
      success(...args);
    })
  });
};