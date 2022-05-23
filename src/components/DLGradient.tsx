import Sketch from "react-p5";
import p5Types from "p5";
import { MnistClassifier } from "../dto/mnist.dto";
import { numericalGradient } from "../common/functions";
import { useEffect } from "react";
import { TwoLayerNet } from "../model/GradientModel";
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

export const DLGradient: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    const testInstance = new TwoLayerNet({
      inputSize: 3,
      hiddenSize: 4,
      outputSize: 2,
    });
    console.log(testInstance.w1);
  }, []);
  return (
    <div>
      <h1>DLGradient</h1>
      <TrainCanvas mnistData={props.mnistData} />
    </div>
  );
};
