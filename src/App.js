import React, { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import _ from "lodash";
import {
  PageWrapper,
  ButtonWrapper,
  Button,
  GridWrapper,
  Cell,
} from "./elements";

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

function App() {
  const [numRows, setNumRows] = useState(30);
  const [numCols, setNumCols] = useState(30);
  const [generation, setGeneration] = useState(1);
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    return Array.from(Array(numRows), () => Array(numCols).fill(0));
  });

  const [gridStates, setGridStates] = useState([]);
  const [gridStateIndex, setGrisdStateIndex] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  useEffect(() => {
    if (localStorage.getItem("gridState")) {
      const { grid, generation, numCols, numRows } = JSON.parse(
        localStorage.getItem("gridState")
      );
      setGrid(grid);
      setGeneration(generation);
      setNumCols(numCols);
      setNumRows(numRows);
    }
  }, []);

  useEffect(() => {
    if (runningRef.current) {
      setGeneration(generation + 1);
    }

    const gridState = {
      generation,
      grid,
      numCols,
      numRows,
    };

    localStorage.setItem("gridState", JSON.stringify(gridState));

    if (running) {
      const newGridState = [...gridStates];
      const newIndex = gridStateIndex + 1;
      newGridState.splice(newIndex,0,gridState);
      setGridStates(newGridState);
      setGrisdStateIndex(newIndex);
    }
  }, [grid]);

  //useCallback devolverá una versión memorizada del callback que solo cambia si una de las dependencias ha cambiado
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const newGrid = _.cloneDeep(g);

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          //primero necesito encontrar los vecinos
          let neighbors = 0;

          //por cada operacion encuentro a los vecinos en la grilla
          // [(-1,-1)  (-4, 0)  (-1, 1)]
          // [(0, -1)  [celula] (0, 1)]
          // [(1, -1)   (1, 0)   (1, 1)]

          operations.forEach(([x, y]) => {
            const neighborI = i + x;
            const neighborJ = j + y;

            //me aseguro que los vecinos no esten en la otra punta de la grilla
            if (
              neighborI >= 0 &&
              neighborI < numRows &&
              neighborJ >= 0 &&
              neighborJ < numCols
            ) {
              //Si esta viv es un '1' por ende se suma
              neighbors += g[neighborI][neighborJ];
            }
          });

          //Una célula viva con menos de 2 células vecinas vivas muere de “soledad”
          //Una célula viva con más de 3 células vecinas vivas muere por “sobrepoblación”
          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }

      if (_.isEqual(newGrid, g)) {
        return g;
      }

      return newGrid;
    });

    setTimeout(runSimulation, 500);
  }, [numCols, numRows, gridStateIndex, gridStates]);

  const runSimulationOnce = useCallback(() => {
    setGrid((g) => {
      const newGrid = _.cloneDeep(g);

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          //primero necesito encontrar los vecinos
          let neighbors = 0;

          //por cada operacion encuentro a los vecinos en la grilla
          // [(-1,-1)  (-4, 0)  (-1, 1)]
          // [(0, -1)  [celula] (0, 1)]
          // [(1, -1)   (1, 0)   (1, 1)]

          operations.forEach(([x, y]) => {
            const neighborI = i + x;
            const neighborJ = j + y;

            //me aseguro que los vecinos no esten en la otra punta de la grilla
            if (
              neighborI >= 0 &&
              neighborI < numRows &&
              neighborJ >= 0 &&
              neighborJ < numCols
            ) {
              //Si esta viv es un '1' por ende se suma
              neighbors += g[neighborI][neighborJ];
            }
          });

          //Una célula viva con menos de 2 células vecinas vivas muere de “soledad”
          //Una célula viva con más de 3 células vecinas vivas muere por “sobrepoblación”
          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }

      if (_.isEqual(newGrid, g)) {
        return g;
      }

      const gridState = {
        generation,
        grid,
        numCols,
        numRows,
      };

      const newIndex = gridStateIndex + 1;
      const newGridState = [...gridStates];
      newGridState.splice(newIndex,0,gridState);
      setGridStates(newGridState);
      setGrisdStateIndex(newIndex);

      return newGrid;
    });
  }, [numCols, numRows, gridStateIndex, gridStates]);

  //Activa celulas de forma aleatoria
  const randomSort = () => {
    if (running) {
      return;
    }

    setGridStates([]);
    setGrisdStateIndex(0);
    setGeneration(1);
    const newGrid = _.cloneDeep(grid);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        newGrid[i][j] = Math.floor(Math.random() * (2 - 0) + 0);
      }
    }

    setGrid(newGrid);
  };

  const clearGrid = () => {
    if (running) {
      return;
    }

    setGridStates([]);
    setGrisdStateIndex(0);
    setGeneration(1);
    const newGrid = _.cloneDeep(grid);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        newGrid[i][j] = 0;
      }
    }

    setGrid(newGrid);
  };

  const modifyCell = (i, j) => {
    if (running) {
      return;
    }

    //De esta forma no se muta el array ya existente
    const newGrid = _.cloneDeep(grid);
    newGrid[i][j] = grid[i][j] ? 0 : 1;
    setGrid(newGrid);
  };

  const checkIfGridIsZero = () => {
    return grid.every((col) => col.every((cell) => cell === 0));
  };

  const addRow = () => {
    if (running) {
      return;
    }

    const newRow = _.clamp(numRows + 1, 10, 60);

    if (numRows === newRow) return;
    setNumRows(newRow);
    const newGrid = _.cloneDeep(grid);

    newGrid.push(Array(numCols).fill(0));
    setGrid(newGrid);
  };

  const removeRow = () => {
    if (running) {
      return;
    }

    const newRow = _.clamp(numRows - 1, 10, 60);
    if (numRows === newRow) return;
    setNumRows(newRow);
    const newGrid = _.cloneDeep(grid);
    newGrid.pop();
    setGrid(newGrid);
  };

  const addColumn = () => {
    if (running) {
      return;
    }

    const newCol = _.clamp(numCols + 1, 10, 60);
    if (numCols === newCol) return;
    setNumCols(newCol);
    const newGrid = _.cloneDeep(grid);
    newGrid.forEach((col) => col.push(0));
    setGrid(newGrid);
  };

  const removeColumn = () => {
    if (running) {
      return;
    }

    const newCol = _.clamp(numCols - 1, 10, 60);
    if (numCols === newCol) return;
    setNumCols(newCol);
    const newGrid = _.cloneDeep(grid);
    newGrid.forEach((col) => col.pop());
    setGrid(newGrid);
  };

  const nextState = () => {
    runSimulationOnce();
  };

  const prevState = () => {
    const newIndex = _.clamp(gridStateIndex - 1, 0, gridStates.length);
    setGrisdStateIndex(newIndex);
    const newGridState = gridStates[newIndex];

    setGeneration(newGridState.generation);
    setGrid(newGridState.grid);
    setNumCols(newGridState.numCols);
    setNumRows(newGridState.numRows);
  };

  return (
    <PageWrapper>
      <div
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          height: "100%",
          alignItems: "center",
        }}
      >
        <ButtonWrapper>
          <p>Generation: {generation}</p>
          <Button
            running={running}
            onClick={() => {
              setRunning(!running);

              if (!running && checkIfGridIsZero) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {!running ? "Play" : "Stop"}
          </Button>
          <Button onClick={randomSort}>Random</Button>
          <Button onClick={clearGrid}>Clear</Button>
        </ButtonWrapper>
        <>
          <h4>Rows</h4>
          <div style={{ display: "flex" }}>
            <button style={{ height: "20px" }} onClick={() => removeRow()}>
              {"<"}
            </button>
            {numRows}
            <button style={{ height: "20px" }} onClick={() => addRow()}>
              {">"}
            </button>
          </div>

          <h4>Columns</h4>
          <div style={{ display: "flex" }}>
            <button style={{ height: "20px" }} onClick={() => removeColumn()}>
              {"<"}
            </button>
            {numCols}
            <button style={{ height: "20px" }} onClick={() => addColumn()}>
              {">"}
            </button>
          </div>
        </>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
        >
          <button disabled={gridStateIndex === 0} onClick={() => prevState()}>
            Prev State
          </button>
          <button onClick={() => nextState()}>Next State</button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GridWrapper numCols={numCols} numRows={numRows}>
          {grid.map((rows, i) =>
            rows.map((col, j) => (
              <Cell
                key={`${i}-${j}`}
                numCols={numCols}
                numRows={numRows}
                alive={grid[i][j]}
                onClick={() => modifyCell(i, j)}
              />
            ))
          )}
        </GridWrapper>
      </div>
    </PageWrapper>
  );
}

export default App;
