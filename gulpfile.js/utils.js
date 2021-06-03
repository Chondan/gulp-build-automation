const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 *
 * @param {Array<string>}  directories
 * @returns {string} Absolute path by resolving from directories array
 */
const getDir = (...directories) => path.resolve(...directories);

module.exports = { ROOT_DIR, getDir };
