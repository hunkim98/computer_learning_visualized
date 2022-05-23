import Sketch from "react-p5";
import p5Types from "p5";
import { MnistClassifier } from "../dto/mnist.dto";
import { useEffect } from "react";
import { TwoLayerNet } from "../model/GradientModel";
import { addMatrices, scalarMatrix } from "../common/functions";
var grid = 10;
// MNIST database is 28*28
const canvasWidth = grid * 28;
const canvasHeight = grid * 28;

interface Props {
  mnistData: MnistClassifier[];
}

export const TrainCanvas: React.FC<Props> = (props: Props) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.background(255);
    // console.log(numericalGradient(eucDistErr, [[0, 1]]));
  };

  const draw = (p5: p5Types) => {
    if (props.mnistData.length > 0) {
      p5.background(255);
    }
    // for (let i = 0; i < 28; i++) {
    //   for (let j = 0; j < 28; j++) {
    //     if (canvasArray[j][i] == 1) {
    //       p5.fill(p5.color("black"));
    //       p5.square(j * grid, i * grid, grid);
    //     }
    //   }
    // }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export const DLGradient: React.FC<Props> = ({ mnistData }: Props) => {
  useEffect(() => {
    const testInstance = new TwoLayerNet({
      inputSize: mnistData[0].data.length,
      hiddenSize: 50,
      // output 0~9
      outputSize: 10,
    });
    const iterrationCount = 30;
    const batchSize = 100;
    const learningRate = 0.1;
    for (let i = 0; i < iterrationCount; i++) {
      console.log("batch test", i);
      const batch = mnistData
        .slice()
        .sort(() => Math.random() - Math.random())
        .slice(0, batchSize);
      const xBatch = batch.map((element) => element.data);
      const tBatch = batch.map((element) => {
        const temp: number[] = Array(10).fill(0);
        temp[element.id - 1] = 1;
        return temp;
      });

      const grad = testInstance.numericalGradient(xBatch, tBatch);
      testInstance.w1 = addMatrices(
        testInstance.w1,
        scalarMatrix(grad.w1, -learningRate)
      );
      testInstance.w2 = addMatrices(
        testInstance.w2,
        scalarMatrix(grad.w2, -learningRate)
      );
      testInstance.b1 = testInstance.b1.map((element, index) => {
        return element - learningRate * grad.b1[index];
      });
      testInstance.b2 = testInstance.b2.map((element, index) => {
        return element - learningRate * grad.b2[index];
      });
      console.log(testInstance.accuracy(xBatch, tBatch));
    }
  }, []);
  return (
    <div>
      <h1>DLGradient</h1>
      <TrainCanvas mnistData={mnistData} />
    </div>
  );
};
