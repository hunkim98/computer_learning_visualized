import { Matrix } from "ml-matrix";
import React, { useEffect } from "react";
import {
  addMatrices,
  addVectors,
  changeValueOfMatrixAtoB,
  changeValueofVectorAtoB,
  shuffleArray,
  subtractMatrices,
} from "../common/functions";
import { MnistClassifier } from "../dto/mnist.dto";
import { TwoLayerNetPropagation } from "../model/TwoLayerNetPropagation";

interface Props {
  mnistData: MnistClassifier[];
}

const Propogation: React.FC<Props> = ({ mnistData }) => {
  useEffect(() => {
    const network = new TwoLayerNetPropagation({
      inputSize: mnistData[0].data.length,
      hiddenSize: 50,
      // output 0~9
      outputSize: 10,
    });
    const iterrationCount = 50;
    const batchSize = 100;
    const learningRate = 0.1;
    shuffleArray(mnistData);
    const train = mnistData.slice(0, 10000);
    // const testImg = mnistData.slice(0, 1000).map((element) => element.data);
    // const testLabel = mnistData.slice(0, 1000).map((element) => {
    //   const temp: number[] = Array(10).fill(0);
    //   temp[element.id] = 1;
    //   return temp;
    // });
    for (let i = 0; i < iterrationCount; i++) {
      console.log("batch test", i);
      shuffleArray(train);
      const batch = train.slice(0, batchSize);
      const xBatch = batch.map((element) => element.data);
      const tBatch = batch.map((element) => {
        const temp: number[] = Array(10).fill(0);
        temp[element.id] = 1;
        return temp;
      });
      const grad = network.gradient(xBatch, tBatch);
      changeValueOfMatrixAtoB(
        network.w1,
        addMatrices(network.w1, grad.w1, -learningRate)
      );
      changeValueOfMatrixAtoB(
        network.w2,
        addMatrices(network.w2, grad.w2, -learningRate)
      );
      changeValueofVectorAtoB(
        network.b1,
        addVectors(network.b1, grad.b1, -learningRate)
      );
      changeValueofVectorAtoB(
        network.b2,
        addVectors(network.b2, grad.b2, -learningRate)
      );
      //   network.w1 = addMatrices(network.w1, grad.w1, -learningRate);
      //   network.w2 = addMatrices(network.w2, grad.w2, -learningRate);
      //   network.b1 = addVectors(network.b1, grad.b1, -learningRate);
      //   network.b2 = addVectors(network.b2, grad.b2, -learningRate);
      const testImg = train.map((element) => element.data);
      const testLabel = train.map((element) => {
        const temp: number[] = Array(10).fill(0);
        temp[element.id] = 1;
        return temp;
      });
      console.log("accuracy: ", network.accuracy(testImg, testLabel));
    }
  }, []);
  return <div>Propogation</div>;
};

export default Propogation;
