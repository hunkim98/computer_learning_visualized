export const numerical_gradient = (
  //f should be the loss function
  f: (W: number) => number,
  x: number[][]
) => {
  const h = 0.0001;
  const gradient2d: number[][] = [];
  console.log("gradient processing");
  for (let i = 0; i < x.length; i++) {
    const grad = x[i].map((element) => {
      return (f(element + h) - f(element - h)) * (h * 2);
    });
    gradient2d.push(grad);
  }
  return gradient2d;
};

export const mnistFunc = () => {};
