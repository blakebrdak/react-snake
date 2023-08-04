import React, { useEffect, useCallback, useState } from "react";

import "../css/Game.css";

import Player from "./Player.js";
import Item from "./Item.js";
import Scoring from "./Scoring";

// Globals for sizing and speed
const BOARD_SIZE = 16;
const TICK = 170;

export default function Game() {
  // Initialize the Items array
  const [start, setStart] = useState(false);
  const [score, setScore] = useState(1);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("snake-high-score")
  );
  const [gameOver, setGameOver] = useState(false);
  const [tailPrev, setTailPrev] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState("start");
  const [prevDir, setPrevDir] = useState("null");
  const [itemArr, setItemArr] = useState([{ x: 1, y: 1, show: true }]);
  const [playerArr, setPlayerArr] = useState([{ x: 1, y: 0 }]);

  //handler for updating items
  const eatitem = (idx) => {
    setTimeout(() => {
      let temp = itemArr.slice(0);
      temp[idx].show = false;
      let newItem = {
        x: 0,
        y: 0,
        show: true,
      };
      let idx2 = -2;
      // Verify new item is not inside the snake
      let verified = false;
      while (!verified) {
        newItem = {
          x: Math.floor(Math.random() * BOARD_SIZE),
          y: Math.floor(Math.random() * BOARD_SIZE),
          show: true,
        };
        idx2 = playerArr.findIndex((item) => item.x === newItem.x && item.y === newItem.y);
        if(idx2 === -1) {
          verified = true;
        }
      }

      setItemArr([newItem]);
      setScore((prevState) => {
        return prevState + 1;
      });
      // Add new segment
      console.log("tail-prev: ", tailPrev);
      playerArr.push(tailPrev);
    }, 100);
  };

  // keypress logic
  const handleKeyPress = useCallback(
    (event) => {
      if (!start) {
        setStart(true);
      }
      if (event.keyCode === 87 && prevDir !== "down") {
        // w
        setDirection("up");
      } else if (event.keyCode === 83 && prevDir !== "up") {
        // s
        setDirection("down");
      } else if (event.keyCode === 65 && prevDir !== "right") {
        // a
        setDirection("left");
      } else if (event.keyCode === 68 && prevDir !== "left") {
        //d
        setDirection("right");
      }
    },
    [prevDir]
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Timer for the tick
  useEffect(() => {
    const interval = setInterval(() => {
      // EVERYTHING INSIDE THIS WILL HAPPEN EVERY SECOND
      let temp = playerArr.slice(0);
      let temp2 = { ...temp[temp.length - 1] };
      setTailPrev(temp2);
      for (let i = playerArr.length - 1; i > 0; --i) {
        console.log("!");
        temp[i] = { ...temp[i - 1] };
      }

      if (direction === "up") {
        if (temp[0].y > 0) {
          temp[0].y = temp[0].y - 1;
        }
      } else if (direction === "down") {
        if (temp[0].y < BOARD_SIZE - 1) {
          temp[0].y = temp[0].y + 1;
        }
      } else if (direction === "left") {
        if (temp[0].x > 0) {
          temp[0].x = temp[0].x - 1;
        }
      } else if (direction === "right") {
        if (temp[0].x < BOARD_SIZE - 1) {
          temp[0].x = temp[0].x + 1;
        }
      } ///
      setPlayerArr(temp);
      setPrevDir(direction)
      console.log("x = ", playerArr[0].x, " y = ", playerArr[0].y);
    }, TICK);
    // check for game over
    if (gameOver) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [direction, playerArr]);

  useEffect(() => {
    // check if anything in player array is equal
    let idx = playerArr
      .slice(1)
      .findIndex(
        (item) => item.x === playerArr[0].x && item.y === playerArr[0].y
      );
    if (idx !== -1) {
      console.log("intersect!");
      setGameOver(true);
    }
    idx = itemArr.findIndex(
      (item) => item.x === playerArr[0].x && item.y === playerArr[0].y
    );
    if (idx !== -1 && itemArr[idx].show) {
      eatitem(idx);
    }
  }, [playerArr]);

  const toRender = itemArr.map((item) => {
    return <Item x={item.x} y={item.y} show={item.show} board={BOARD_SIZE} />;
  });

  const playerRender = playerArr.map((player) => {
    return (
      <Player
        x={player.x}
        y={player.y}
        gameOver={gameOver}
        board={BOARD_SIZE}
      />
    );
  });

  if (gameOver) {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snake-high-score", score);
    }
  }

  return (
    <div>
      <p className={`game-over ${!gameOver ? "over-hidden" : ""}`}>
        Game Over!
      </p>
      <p className={`start ${start ? "over-hidden" : ""}`}>
        W, S, A and D are the controls. Press to begin!
      </p>
      <div className="game">
        {playerRender}
        {toRender}
      </div>
      <Scoring score={score} highScore={highScore} />
    </div>
  );
}
