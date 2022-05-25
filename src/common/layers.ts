import {
  addMatrices,
  addVectors,
  crossEntropyErrorMatrix,
  meanSquaredErrorMatrix,
  multiplyMatrices,
  scalarMatrix,
  softmaxMatrix,
  subtractMatrices,
  transposeMatrix,
} from "./functions";
import { addMatrixToReference, multiplyToMatrixReference } from "./matrix";
export class Relu {
  mask: boolean[][];
  constructor() {
    this.mask = [];
  }

  forward(x: number[][]) {
    this.mask = [...Array(x.length)].map((element) =>
      Array(x[0].length).fill(false)
    );
    const out = x.map((row, rowIndex) => {
      return row.map((value, columnIndex) => {
        if (value > 0) {
          this.mask[rowIndex][columnIndex] = true;
          return value;
        } else {
          this.mask[rowIndex][columnIndex] = false;
          return 0;
        }
      });
    });
    return out;
  }

  backward(dout: number[][]) {
    dout.map((row, rowIndex) => {
      row.map((element, columnIndex) => {
        if (this.mask[rowIndex][columnIndex]) {
          dout[rowIndex][columnIndex] = element;
        } else {
          dout[rowIndex][columnIndex] = 0;
        }
      });
    });
    return dout;
  }
}

export class Affine {
  W: number[][];
  b: number[];
  x?: number[][];
  dW?: number[][];
  db?: number[];
  constructor(W: number[][], b: number[]) {
    this.W = W;
    this.b = b;
  }
  forward(x: number[][]) {
    this.x = x;
    const out_1 = multiplyMatrices(x, this.W);
    const out_2 = out_1.map((row) => {
      return addVectors(row, this.b);
    });
    return out_2;
  }

  backward(dout: number[][]) {
    const dx = multiplyMatrices(dout, transposeMatrix(this.W));
    this.dW = multiplyMatrices(transposeMatrix(this.x as number[][]), dout);
    const tempDb: number[] = Array(dout[0].length).fill(0);
    dout.map((row) => {
      row.map((element, columnIndex) => {
        tempDb[columnIndex] += element;
      });
    });
    this.db = tempDb;
    return dx;
  }
}

export class SoftMaxWithLoss {
  t?: number[][]; // t is one hot vector
  y?: number[][];
  loss?: number;
  constructor() {}
  forward(x: number[][], t: number[][]) {
    this.t = t;
    this.y = softmaxMatrix(x);
    this.loss = meanSquaredErrorMatrix(this.y, this.t);
    return this.loss;
  }
  backward(dout = 1) {
    const batchSize = (this.t as number[][]).length;
    const dx = addMatrices(this.y as number[][], this.t as number[][], -1);
    multiplyToMatrixReference(dx, 1 / batchSize);
    return dx;
  }
}
