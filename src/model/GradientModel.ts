import {
  meanSquaredErrorMatrix,
  multiplyMatrices,
  sigmoidMatrix,
  softmaxMatrix,
} from "../common/functions";

import { numerical_gradient } from "../common/gradient";
interface TwoLayerNetProps {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
}
export class TwoLayerNet {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  w1: number[][]; //rows: inputSize, columns: hiddenSize
  w2: number[][]; //rows: hiddenSize, columns: outputSize
  b1: number[];
  b2: number[];
  weightInitStd = 0.01;
  constructor(props: TwoLayerNetProps) {
    this.inputSize = props.inputSize;
    this.hiddenSize = props.hiddenSize;
    this.outputSize = props.outputSize;

    this.w1 = [...Array(this.inputSize)].map((x) =>
      Array(this.hiddenSize)
        .fill(0)
        .map(() => gaussianRandom())
    );
    this.w2 = [...Array(this.hiddenSize)].map((x) =>
      Array(this.outputSize)
        .fill(0)
        .map(() => gaussianRandom())
    );
    this.b1 = Array(this.hiddenSize).fill(0);
    this.b2 = Array(this.outputSize).fill(0);
    console.log("weight initialized");
  }
  //x should be size inputSize * 1
  predict(x: number[][]) {
    const a1_1 = multiplyMatrices(x, this.w1);
    const a1_2 = a1_1.map((row) => {
      return row.map((element, index) => element + this.b1[index]);
    });
    const z1 = sigmoidMatrix(a1_2);
    const a2_1 = multiplyMatrices(z1, this.w2);
    const a2_2 = a2_1.map((row) => {
      return row.map((element, index) => element + this.b2[index]);
    }); // a2_2 size is hiddenSize * outputSize
    const y = softmaxMatrix(a2_2);
    return y;
  }

  loss(x: number[][], t: number[][]) {
    const y = this.predict(x);
    return meanSquaredErrorMatrix(y, t);
  }

  numericalGradient(
    x: number[][],
    t: number[][]
  ): { w1: number[][]; b1: number[]; w2: number[][]; b2: number[] } {
    const lossW = (W: number) => {
      return this.loss(x, t);
    };
    console.log("numerical gradient start");
    const grad_w1 = numerical_gradient(lossW, this.w1);
    console.log("grad_w1");
    //b1 is 1 dimensional
    const grad_b1 = numerical_gradient(lossW, [this.b1])[0];
    console.log("grad_b1");
    const grad_w2 = numerical_gradient(lossW, this.w2);
    console.log("grad_w2");
    const grad_b2 = numerical_gradient(lossW, [this.b2])[0];
    console.log("grad_b2");
    return {
      w1: grad_w1,
      b1: grad_b1,
      w2: grad_w2,
      b2: grad_b2,
    };
  }

  accuracy(x: number[][], t: number[][]) {
    const y = this.predict(x);
    let accuracy = 0;
    for (let i = 0; i < y.length; i++) {
      const yMax = Math.max(...y[i]);
      const yMaxIndex = y[i].indexOf(yMax);
      const tMax = Math.max(...t[i]);
      const tMaxIndex = t[i].indexOf(tMax);
      if (yMaxIndex === tMaxIndex) {
        accuracy += 1 / x.length;
      }
    }
    return accuracy;
  }
}

function gaussianRandom() {
  var v1, v2, s;
  do {
    v1 = 2 * Math.random() - 1; // -1.0 ~ 1.0 까지의 값
    v2 = 2 * Math.random() - 1; // -1.0 ~ 1.0 까지의 값
    s = v1 * v1 + v2 * v2;
  } while (s >= 1 || s == 0);
  s = Math.sqrt((-2 * Math.log(s)) / s);
  return v1 * s;
}
