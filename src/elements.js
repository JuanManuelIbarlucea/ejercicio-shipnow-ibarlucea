import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  height:100%;
`;

export const Button = styled.button`
  background-color: ${({ running }) => (running !== undefined) ? ((!running) ? "green" : "red") : "white"} ;
  color: ${({ running }) => (running !== undefined) ? "white" : "black"};
  width: 80%;
  height: 50px;
  overflow: hidden;
  margin: 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.3);
`;

export const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(${({ numCols }) => (numCols ? numCols : '10')}, auto);
    grid-template-rows: repeat(${({numRows }) => (numRows ? numRows : '10')}, auto);
    align-items: center;
    justify-content: flex-start;
    border: solid 1px black;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    max-width: 70%;
`;

export const Cell = styled.div`
    min-width: 10px;
    min-height: 10px;
    width: 100%;
    max-width: 80px;
    max-height: 80px;
    background-color: ${({ alive }) => (alive ? "violet" : undefined)};
    border-radius: 50%;
    border: solid 1px black;
    margin: auto;
`;


