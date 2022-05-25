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
import { addMatrixToReference, addVectorToReference } from "../common/matrix";
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
    const iterrationCount = 100;
    const batchSize = 100;
    const learningRate = 0.1;
    shuffleArray(mnistData);
    const train = mnistData;
    const loss_list = [];
    // const testImg = mnistData.slice(0, 1000).map((element) => element.data);
    // const testLabel = mnistData.slice(0, 1000).map((element) => {
    //   const temp: number[] = Array(10).fill(0);
    //   temp[element.id] = 1;
    //   return temp;
    // });
    for (let i = 0; i < iterrationCount; i++) {
      console.log("batch test", i);

      const batch = train.slice(0, batchSize);
      const xBatch = batch.map((element) => element.data);
      const tBatch = batch.map((element) => {
        const temp: number[] = Array(10).fill(0);
        //id is from 0~9
        temp[element.id] = 1;
        return temp;
      });
      const grad = network.gradient(xBatch, tBatch);
      addMatrixToReference(network.w1, grad.w1, -learningRate);
      addMatrixToReference(network.w2, grad.w2, -learningRate);
      addVectorToReference(network.b1, grad.b1, -learningRate);
      addVectorToReference(network.b2, grad.b2, -learningRate);
      //   network.w1 = addMatrices(network.w1, grad.w1, -learningRate);
      //   network.w2 = addMatrices(network.w2, grad.w2, -learningRate);
      //   network.b1 = addVectors(network.b1, grad.b1, -learningRate);
      //   network.b2 = addVectors(network.b2, grad.b2, -learningRate);
      const loss = network.loss(xBatch, tBatch);
      loss_list.push(loss);
      shuffleArray(train);
      const testImg = train.slice(0, 300).map((element) => element.data);
      const testLabel = train.slice(0, 300).map((element) => {
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
