// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./App.css";
import { Canvas, DeepLearningCanvas, Example } from "./components/Canvas";
import { DLGradient } from "./components/DLGradient";
import Propogation from "./components/Propogation";
//Typescript version enum
const DLType = {
  KNN: "KNN",
  DLGradient: "DLGradient",
  DLPropogation: "DLPropogation",
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
          const data = [];
          for (let i = 0; i < json.data.length; i++) {
            data.push({ id: id, data: json.data[i] });
          }
          return data;
        })
    );
    Promise.all(promises).then((data) => {
      var concattedArray = Array.prototype.concat.apply([], data);
      setMninstData(concattedArray);
      // setMnistGroup(data);
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
            setDLView(DLType.DLPropogation);
          }}
        >
          DLPropagation
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
          case DLType.DLPropogation:
            return <Propogation mnistData={mnistData} />;
          default:
            return <h1>hi</h1>;
        }
      })()}
    </div>
  );
}

export default App;
