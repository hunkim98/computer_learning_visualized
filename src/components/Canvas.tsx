import Sketch from "react-p5";
import p5Types from "p5";
import MinHeap from "../algorithms/MinHeap";
import { MnistClassifier } from "../dto/mnist.dto";
import { useEffect, useState } from "react";
import {
  addMatrixToReference,
  addVectorToReference,
  multiplyToMatrixReference,
  transposeMatrixReference,
} from "../common/matrix";
import {
  addMatrices,
  shuffleArray,
  transposeMatrix,
} from "../common/functions";

var grid = 10;
// MNIST database is 28*28
const canvasWidth = grid * 28;
const canvasHeight = grid * 28;
var show = false;
let colorPicker: any;
let clearButton: any;
const colorPickerWidth = 50;
const colorPickerHeight = 28;
let canvasArray: number[][] = new Array(28)
  .fill(0)
  .map(() => new Array(28).fill(0));
let minHeap = new MinHeap();

interface Props {
  mnistData: MnistClassifier[];
}

function createGrid(p5: p5Types) {
  let l = 0;
  p5.strokeWeight(1);
  p5.stroke(150);
  while (l < p5.width || l < p5.height) {
    p5.line(0, l, p5.width, l);
    p5.line(l, 0, l, p5.height);
    l += grid;
  }
}

function snap(p: any) {
  // subtract offset (to center lines)
  // divide by grid to get row/column
  // round to snap to the closest one
  var cell = Math.round((p - grid / 2) / grid);
  // multiply back to grid scale
  // add offset to center
  return cell * grid;
}

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

function compareKNN(heap: MinHeap, test: number[], train: MnistClassifier[]) {
  for (let i = 0; i < train.length; i++) {
    heap.insert({
      id: train[i].id,
      value: euc_dist(test, train[i].data),
      index: i,
    });
  }
}

let arrayChangeUpdated = false;
let [currentPixelX, currentPixelY] = [0, 0];

export const Canvas: React.FC<Props> = (props: Props) => {
  const [isArrayChanged, setIsArrayChanged] = useState(false);
  useEffect(() => {
    minHeap = new MinHeap();
    let concattedArray: number[] = Array.prototype.concat.apply(
      [],
      canvasArray
    );
    compareKNN(minHeap, concattedArray, props.mnistData);
    console.log(minHeap.peek());
  }, [isArrayChanged]);
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.background(255);
    colorPicker = p5.createColorPicker("black");
    colorPicker.position(0, p5.height + 10);
    colorPicker.size(colorPickerWidth, colorPickerHeight);
    clearButton = p5.createButton("CLEAR");
    clearButton.position(p5.width / 2, p5.height + 150);
    clearButton.size(clearButton.width, 32);
    clearButton.mousePressed(() => {
      p5.clear();
      p5.background(255);
      canvasArray = new Array(28).fill(0).map(() => new Array(28).fill(0));
    });
  };

  const draw = (p5: p5Types) => {
    if (p5.mouseIsPressed) {
      let x = snap(p5.mouseX);
      let y = snap(p5.mouseY);
      if (x / grid < 28 && x / grid >= 0 && y / grid < 28 && y / grid >= 0) {
        // drawing a line
        p5.stroke(0, 0, 0, 255);
        p5.strokeWeight(15);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        // draw a line

        // update the array
        // if (currentPixelX !== x && currentPixelY !== y) {
        //   canvasArray[y / grid][x / grid] =
        //     canvasArray[y / grid][x / grid] + 1 <= 1
        //       ? canvasArray[y / grid][x / grid] + 1
        //       : canvasArray[y / grid][x / grid];
        //   canvasArray[y / grid][x / grid - 1] =
        //     canvasArray[y / grid][x / grid - 1] + 0.2 <= 1
        //       ? canvasArray[y / grid][x / grid - 1] + 0.2
        //       : canvasArray[y / grid][x / grid - 1];
        //   canvasArray[y / grid][x / grid + 1] =
        //     canvasArray[y / grid][x / grid + 1] + 0.2 <= 1
        //       ? canvasArray[y / grid][x / grid + 1]
        //       : canvasArray[y / grid][x / grid + 1] + 0.2;
        //   canvasArray[y / grid + 1][x / grid] =
        //     canvasArray[y / grid + 1][x / grid] + 0.2 <= 1
        //       ? canvasArray[y / grid + 1][x / grid] + 0.2
        //       : canvasArray[y / grid + 1][x / grid];
        //   canvasArray[y / grid - 1][x / grid] =
        //     canvasArray[y / grid - 1][x / grid] + 0.2 <= 1
        //       ? canvasArray[y / grid - 1][x / grid] + 0.2
        //       : canvasArray[y / grid - 1][x / grid];
        // }

        //update array

        // p5.fill(colorPicker.color());
        // p5.square(x, y, grid);
        // p5.fill([150, 150, 150]);
        // p5.square(x - grid, y - grid, grid);
        arrayChangeUpdated = true;
        setIsArrayChanged(false);
      }
    } else {
      if (arrayChangeUpdated) {
        for (let i = 0; i < p5.width; i++) {
          for (let j = 0; j < p5.height; j++) {
            let x = snap(j);
            let y = snap(i);
            const brightness = (255 - p5.get(j, i)[0]) / 255;
            canvasArray[y / grid][x / grid] += brightness / grid;
          }
        }
        arrayChangeUpdated = false;
      }
      setIsArrayChanged(true);
    }
    // createGrid(p5);
  };

  return (
    <Sketch style={{ border: "1px solid black" }} setup={setup} draw={draw} />
  );
};

export const DeepLearningCanvas: React.FC<Props> = (props: Props) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.background(255);
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    console.log(transposeMatrix(matrix));
    console.log(JSON.parse(JSON.stringify(matrix)));
    const vector = [1, 1, 1];
    addVectorToReference(vector, [2, 2, 2]);
    console.log(vector);

    addMatrixToReference(matrix, matrix);
    console.log(JSON.parse(JSON.stringify(matrix)));
    multiplyToMatrixReference(matrix, 1 / 2);
    console.log(JSON.parse(JSON.stringify(matrix)));
    console.log(addMatrices(matrix, matrix, -1));
    const newMatrix = [...Array.prototype.concat.apply([], matrix)];
    shuffleArray(newMatrix);
    shuffleArray(newMatrix);
    console.log(newMatrix);
    // transposeMatrixReference(matrix);
  };

  const draw = (p5: p5Types) => {
    if (props.mnistData.length > 0) {
      p5.background(255);
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          p5.fill(p5.color(255 - canvasArray[i][j] * 255));
          p5.square(j * grid, i * grid, grid);
        }
      }
      // for (let i = 0; i < 28; i++) {
      //   for (let j = 0; j < 28; j++) {
      //     if (canvasArray[j][i] == 1) {
      //       p5.fill(p5.color("black"));
      //       p5.square(j * grid, i * grid, grid);
      //     }
      //   }
      // }
    }

    createGrid(p5);
  };

  return <Sketch setup={setup} draw={draw} />;
};

export const Example: React.FC<Props> = (props: Props) => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.background(255);
  };

  const draw = (p5: p5Types) => {
    if (props.mnistData.length > 0) {
      p5.background(255);
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          if (props.mnistData[3000].data[28 * i + j] > 0) {
            p5.fill(
              p5.color(255 - props.mnistData[3000].data[i * 28 + j] * 255)
            );
            p5.square(j * grid, i * grid, grid);
          }
        }
      }
    }
    if (minHeap.peek()) {
      const index = minHeap.peek().index;
      const data = props.mnistData[index].data;
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          p5.fill(p5.color(255 - data[28 * i + j] * 255));
          p5.square(j * grid, i * grid, grid);
        }
      }
    }
    createGrid(p5);
  };

  return <Sketch setup={setup} draw={draw} />;
};
