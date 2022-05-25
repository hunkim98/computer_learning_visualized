export function addMatrixToReference(
  m1: number[][],
  m2: number[][],
  value: number = 1
) {
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m1[0].length; j++) {
      m1[i][j] += m2[i][j] * value;
    }
  }
}

export function addVectorToReference(
  v1: number[],
  v2: number[],
  value: number = 1
) {
  for (let i = 0; i < v1.length; i++) {
    v1[i] += v2[i] * value;
  }
}

export function transposeMatrixReference(matrix: number[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i; j < matrix[0].length; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}

export function addScalarToMatrixReference(matrix: number[][], scalar: number) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      matrix[i][j] += scalar;
    }
  }
}

export function multiplyToMatrixReference(
  matrix: number[][],
  multiplier: number
) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      matrix[i][j] *= multiplier;
    }
  }
}
