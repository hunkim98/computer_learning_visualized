export const gradientDescent = () => {};

function euc_dist(x1: number[], x2: number[]) {
  // euclidian distance between to vectors of same length
  // return Math.sqrt()
  let sum = 0;
  const squareDistance = x1.map((element, index) => {
    const addition = Math.pow(element - x2[index], 2);
    sum = sum + addition;
  });
  return Math.sqrt(sum);
}

export const meanSquaredErrorMatrix = (y: number[][], t: number[][]) => {
  //takes in two matrixes and returns the error amount
  //batchSize means the amount of columns
  const batchSize = y.length;
  let totalErrorSum = 0;
  for (let i = 0; i < y.length; i++) {
    const yVector = y[i];
    const tVector = t[i];
    const vectorError = meanSquaredErrorVector(yVector, tVector);
    totalErrorSum += vectorError;
  }
  return totalErrorSum / batchSize;
};

export const meanSquaredErrorVector = (y: number[], t: number[]) => {
  let sum = 0;
  y.map((element, index) => {
    const addition = Math.pow(element - t[index], 2);
    sum += addition;
  });
  return 0.5 * sum;
};

export function multiplyMatrices(m1: number[][], m2: number[][]) {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    const resultRow = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      resultRow.push(sum);
    }
    result.push(resultRow);
  }
  return result;
}

export function transposeMatrix(matrix: number[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export function changeValueOfMatrixAtoB(A: number[][], B: number[][]) {
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      A[i][j] = B[i][j];
    }
  }
}

export function changeValueofVectorAtoB(A: number[], B: number[]) {
  for (let i = 0; i < A.length; i++) {
    A[i] = B[i];
  }
}

export function addMatrices(m1: number[][], m2: number[][], value: number = 1) {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    const resultRow = [];
    for (let j = 0; j < m1[0].length; j++) {
      resultRow.push(m1[i][j] + m2[i][j] * value);
    }
    result.push(resultRow);
  }
  return result;
}

export function addVectors(v1: number[], v2: number[], value: number = 1) {
  const result: number[] = [];
  for (let i = 0; i < v1.length; i++) {
    const element = v1[i] + v2[i] * value;
    result.push(element);
  }
  return result;
}

export function subtractMatrices(m1: number[][], m2: number[][]) {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    const resultRow = [];
    for (let j = 0; j < m1[0].length; j++) {
      resultRow.push(m1[i][j] - m2[i][j]);
    }
    result.push(resultRow);
  }
  return result;
}

export function scalarMatrix(m1: number[][], scalar: number) {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    const resultRow = [];
    for (let j = 0; j < m1[0].length; j++) {
      resultRow.push(scalar * m1[i][j]);
    }
    result.push(resultRow);
  }
  return result;
}

export function divideMatrix(m1: number[][], scalar: number) {
  const result: number[][] = [];
  for (let i = 0; i < m1.length; i++) {
    const resultRow = [];
    for (let j = 0; j < m1[0].length; j++) {
      resultRow.push(m1[i][j] / scalar);
    }
    result.push(resultRow);
  }
  return result;
}

export const sigmoidMatrix = (x: number[][]) => {
  return x.map((row) => {
    return row.map((element) => sigmoid(element));
  });
};
export const sigmoid = (x: number) => {
  return 1 / (1 + Math.exp(-x));
};

export const softmaxMatrix = (x: number[][]) => {
  const max = Math.max(...Array.prototype.concat.apply([], x));
  let sum = 0;
  const newMatrix = x.map((row) => {
    return row.map((element) => {
      const addition = Math.exp(element - max);
      sum += addition;
      return addition;
    });
  });
  return newMatrix.map((row) => {
    return row.map((element) => element / sum);
  });
};

export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const crossEntropyErrorMatrix = (y: number[][], t: number[][]) => {
  const batchSize = y.length;
  let sum = 0;
  t.map((row, rowIndex) => {
    row.map((element, columnIndex) => {
      sum += element * Math.log(y[rowIndex][columnIndex]);
    });
  });
  return -sum / batchSize;
};

export const crossEntropyErrorVector = (y: number[], t: number[]) => {
  const delta = 0.0000001;
  const newY = y.map((element) => Math.log(element + delta));
  let sum = 0;
  t.map((element, index) => {
    sum += element * newY[index];
  });
  return -sum;
};
