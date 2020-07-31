export default (A, B) => {
  if (A === B) {
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

  return !keysA.some(keyA => (A[keyA] !== B[keyA]) || !Object.hasOwnProperty.call(B, keyA));
};