import { Matrix } from "ml-matrix";
import p5Types from "p5";
import React, { useEffect } from "react";
import Sketch from "react-p5";
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

let network: TwoLayerNetPropagation;
interface Props {
  mnistData: MnistClassifier[];
}

const iterrationTotal = 100;
let iterrationCount = 0;
const batchSize = 100;
const learningRate = 0.1;
const loss_list = [];
let rectWidth = 0;
let rectHeight = 0;

const Propogation: React.FC<Props> = ({ mnistData }) => {
  useEffect(() => {
    async function setNetwork() {
      network = new TwoLayerNetPropagation({
        inputSize: mnistData[0].data.length,
        hiddenSize: 50,
        // output 0~9
        outputSize: 10,
      });
      const loss_list = [];
      // const testImg = mnistData.slice(0, 1000).map((element) => element.data);
      // const testLabel = mnistData.slice(0, 1000).map((element) => {
      //   const temp: number[] = Array(10).fill(0);
      //   temp[element.id] = 1;
      //   return temp;
      // });
    }
    setNetwork();
  }, []);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    network = new TwoLayerNetPropagation({
      inputSize: mnistData[0].data.length,
      hiddenSize: 50,
      // output 0~9
      outputSize: 10,
    });
    p5.createCanvas(1000, 1000).parent(canvasParentRef);
    p5.background(255);
    rectWidth = p5.width / network.w1.length;
    rectHeight = p5.height / network.w1[0].length;
    console.log("width, height", rectWidth, rectHeight);
  };

  const draw = (p5: p5Types) => {
    if (iterrationCount <= iterrationTotal) {
      console.log("batch test", iterrationCount);
      const batch = mnistData.slice(0, batchSize);
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
      const max = Math.max(...grad.w1.flat());

      const min = Math.min(...grad.w1.flat());
      const loss = network.loss(xBatch, tBatch);
      shuffleArray(mnistData);
      const testImg = mnistData.slice(0, 300).map((element) => element.data);
      const testLabel = mnistData.slice(0, 300).map((element) => {
        const temp: number[] = Array(10).fill(0);
        temp[element.id] = 1;
        return temp;
      });
      console.log("accuracy: ", network.accuracy(testImg, testLabel));
      for (let i = 0; i < network.w1.length; i++) {
        for (let j = 0; j < network.w1[0].length; j++) {
          p5.fill(p5.map(grad.w1[i][j], min, max, 0, 255));
          p5.noStroke();
          p5.rect(i * rectWidth, j * rectHeight, rectWidth, rectHeight);
        }
      }
      iterrationCount++;
    }
  };
  return <Sketch setup={setup} draw={draw} />;
};

export default Propogation;
