import {
  meanSquaredErrorMatrix,
  multiplyMatrices,
  sigmoidMatrix,
  softmaxMatrix,
} from "../common/functions";
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
    console.log(this.w1);
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

  numericalGradient(x: [][], t: [][]) {}
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
