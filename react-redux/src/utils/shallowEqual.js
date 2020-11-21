function is(A, B) {
  if (A === B) {
    //-Infinite and +Infinite
    return A !== 0 || B !== 0 || 1/A === 1/B;
  } else {
    //NaN
    return A !== A && B !== B;
  }
}

export default (A, B) => {
  if (is(A, B)) {
    return true;
  }

  if (typeof A !== 'object' || typeof B !== 'object') {
    return false;
  }

  const keysA = Object.keys(A);
  const keysB = Object.keys(B);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return !keysA.some(keyA => !is(A[keyA], B[keyA]) || !Object.hasOwnProperty.call(B, keyA));
};