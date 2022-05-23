export const gradientDescent = () => {};

export const numericalGradient = (
  //f should be the loss function
  f: (vector: number) => number,
  x: number[][]
) => {
  const h = 0.0001;
  const gradient2d = [];
  for (let i = 0; i < x.length; i++) {
    const grad = x[i].map((element) => {
      return (f(element + h) - f(element - h)) * (h * 2);
    });
    gradient2d.push(grad);
  }
  return gradient2d;
};

export const predict = () => {};

export const loss = (x: number[][], t: number[][]) => {};

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
  if (y.length == 1 && t.length == 1) {
    //y, t both a simple vector
  }
  //batchSize means the amount of columns
  const batchSize = y.length;
  let totalErrorSum = 0;
  for (let i = 0; i < y.length; i++) {
    const yVector = y[i];
    const tVector = t[i];
    const vectorError = meanSquaredErrorVector(yVector, tVector);
    totalErrorSum += vectorError;
  }
  return -totalErrorSum;
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
  var result: number[][] = [];
  for (var i = 0; i < m1.length; i++) {
    result[i] = [];
    for (var j = 0; j < m2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
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
  const max = Math.max(...x.flat());
  let sum = 0;
  const newMatrix = x.map((row) => {
    return row.map((element) => {
      const addition = Math.exp(element - max);
      sum += addition;
      return addition;
    });
  });
  return newMatrix.map((row) => {
    return row.map((element) => Math.exp(element) / sum);
  });
};
