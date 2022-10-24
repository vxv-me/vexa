import * as path from 'path';

export const isPackage = (name?: string, cwd?: string): boolean => {

  if (!name) return false;
  try {
    const resolvePackage = require.resolve(name);

    if (!!resolvePackage === false) {
      return false
    }

    // if CWD not set
    if (!cwd) {
      return true;
    }


    const currentCwd = process.cwd();
    const currentCwdArr = currentCwd.split(path.sep);
    const inputCwdArr = cwd.split(path.sep);

    if (inputCwdArr.length > currentCwdArr.length) {
      return false;
    }

    for (let i = 0; i < inputCwdArr.length; i++) {
      if (currentCwdArr[i] !== inputCwdArr[i]) {
        return false;
      }
    }
  
    return true;
  } catch (error) {
    return false;
  }
};
