// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./App.css";
import { Canvas, DeepLearningCanvas, Example } from "./components/Canvas";
import { DLGradient } from "./components/DLGradient";
//Typescript version enum
const DLType = {
  KNN: "KNN",
  DLGradient: "DLGradient",
} as const;
type DLType = typeof DLType[keyof typeof DLType];

const digitArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function App() {
  const [mnistGroup, setMnistGroup] = useState<{ id: number; data: any[] }[][]>(
    []
  );
  const [mnistData, setMninstData] = useState<{ id: number; data: any[] }[]>(
    []
  );
  const [DLView, setDLView] = useState<DLType>(DLType.KNN);

  useEffect(() => {
    // accessing json data in public folder
    const promises = digitArray.map((id) =>
      fetch(`./digits/${id}.json`)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          const chunkSize = 28 * 28;
          const data = [];
          for (let i = 0; i < json.data.length; i += chunkSize) {
            const chunk = json.data.slice(i, i + chunkSize);
            data.push({ id: id, data: chunk });
            // do whatever
          }
          return data;
        })
    );
    Promise.all(promises).then((data) => {
      var concattedArray = Array.prototype.concat.apply([], data);
      setMninstData(concattedArray);
      console.log("data", data);
      setMnistGroup(data);
    });
  }, []);

  return (
    <div className="App">
      <div style={{ fontSize: 25, paddingTop: 20, paddingBottom: 20 }}>
        Pixel Vision
      </div>
      <nav>
        <button
          onClick={() => {
            setDLView(DLType.KNN);
          }}
        >
          knn
        </button>
        <button
          onClick={() => {
            setDLView(DLType.DLGradient);
          }}
        >
          DLGradient
        </button>
      </nav>
      {(() => {
        switch (DLView) {
          case DLType.KNN:
            return (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Canvas mnistData={mnistData} />
                  <DeepLearningCanvas mnistData={mnistData} />
                </div>
                <Example mnistData={mnistData} />
              </>
            );
          case DLType.DLGradient:
            return <DLGradient mnistData={mnistData} />;
          default:
            return <h1>hi</h1>;
        }
      })()}
    </div>
  );
}

export default App;
