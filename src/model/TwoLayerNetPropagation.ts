import { Affine, Relu, SoftMaxWithLoss } from "../common/layers";

interface TwoLayerNetProps {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
}

export class TwoLayerNetPropagation {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  w1: number[][]; //rows: inputSize, columns: hiddenSize
  w2: number[][]; //rows: hiddenSize, columns: outputSize
  b1: number[];
  b2: number[];
  layers: { type: string; class: Affine | Relu }[] = [];
  lastlayer: SoftMaxWithLoss;
  weightInitStd = 0.01;
  constructor(props: TwoLayerNetProps) {
    this.inputSize = props.inputSize;
    this.hiddenSize = props.hiddenSize;
    this.outputSize = props.outputSize;
    this.w1 = [...Array(this.inputSize)].map((x) =>
      Array(this.hiddenSize)
        .fill(0)
        .map(() => gaussianRandom() * this.weightInitStd)
    );

    this.w2 = [...Array(this.hiddenSize)].map((x) =>
      Array(this.outputSize)
        .fill(0)
        .map(() => gaussianRandom() * this.weightInitStd)
    );

    this.b1 = Array(this.hiddenSize).fill(0);
    this.b2 = Array(this.outputSize).fill(0);
    this.layers.push({ type: "Affine1", class: new Affine(this.w1, this.b1) });
    this.layers.push({ type: "Relu1", class: new Relu() });
    this.layers.push({ type: "Affine2", class: new Affine(this.w2, this.b2) });
    this.lastlayer = new SoftMaxWithLoss();
  }

  predict(x: number[][]) {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i].class;
      x = layer.forward(x);
    }
    //softmax 바로 이전단계를 도출
    return x;
  }

  loss(x: number[][], t: number[][]) {
    const y = this.predict(x);
    return this.lastlayer.forward(y, t);
  }

  accuracy(x: number[][], t: number[][]) {
    const y = this.predict(x);
    let accuracy = 0;
    for (let i = 0; i < y.length; i++) {
      const yMax = Math.max(...y[i]);
      const yMaxIndex = y[i].indexOf(yMax);
      if (t[i][yMaxIndex]) {
        accuracy += 1 / x.length;
      }
    }
    return accuracy;
  }

  // numericalGradient(x: number[][], t: number[][]) {
  //   const lossW = (W: number) => {
  //     return this.loss(x, t);
  //   };
  //   const grad_w1 = numerical_gradient(lossW, this.w1);
  //   //b1 is 1 dimensional
  //   const grad_b1 = numerical_gradient(lossW, [this.b1])[0];
  //   const grad_w2 = numerical_gradient(lossW, this.w2);
  //   const grad_b2 = numerical_gradient(lossW, [this.b2])[0];
  //   return {
  //     w1: grad_w1,
  //     b1: grad_b1,
  //     w2: grad_w2,
  //     b2: grad_b2,
  //   };
  // }

  gradient(x: number[][], t: number[][]) {
    //compute last layer
    this.loss(x, t);
    let dout: any = 1;
    dout = this.lastlayer.backward(dout);
    const layers = this.layers.map((element) => element.class);
    const reversedLayers = layers.reverse();
    reversedLayers.map((element) => {
      dout = element.backward(dout);
    });
    //Affine 1
    const grad_w1 = (this.layers[0].class as Affine).dW as number[][];
    const grad_b1 = (this.layers[0].class as Affine).db as number[];
    //Affine 2
    const grad_w2 = (this.layers[this.layers.length - 1].class as Affine)
      .dW as number[][];
    const grad_b2 = (this.layers[this.layers.length - 1].class as Affine)
      .db as number[];
    return {
      w1: grad_w1,
      b1: grad_b1,
      w2: grad_w2,
      b2: grad_b2,
    };
  }
}

function gaussianRandom() {
  let v1, v2, s;
  do {
    v1 = 2 * Math.random() - 1; // -1.0 ~ 1.0 까지의 값
    v2 = 2 * Math.random() - 1; // -1.0 ~ 1.0 까지의 값
    s = v1 * v1 + v2 * v2;
  } while (s >= 1 || s == 0);
  s = Math.sqrt((-2 * Math.log(s)) / s);
  return v1 * s;
}
