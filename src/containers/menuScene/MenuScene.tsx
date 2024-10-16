import React, { useMemo } from "react";
import chroma from "chroma-js";

import Button from "../../atoms/button/Button";
import Switch from "../../atoms/switch/Switch";

import {
  ColorMode,
  GameRound,
  GameState,
} from "../sceneContainer/SceneContainer";

import { outputFormat } from "../gameScene/GameScene";

import "./MenuScene.css";

interface Props {
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}

const rows = 6;
const cols = 6;

const centerRow = Math.floor(rows / 2);
const centerCol = Math.floor(cols / 2);
const maxDistance = Math.sqrt(centerRow ** 2 + centerCol ** 2);

const calculateShade = (distanceFromCenter: number, maxDistance: number) => {
  const shadeFactor = distanceFromCenter / maxDistance;
  const minLightness = 75;
  const maxLightness = 100;
  const lightness = maxLightness - shadeFactor * (maxLightness - minLightness);
  const hslRandom = chroma.random().hsl();
  return chroma(`hsl(${hslRandom[0]}, 85%, ${lightness}%)`).hex().toUpperCase();
};

const MenuScene: React.FC<Props> = (props) => {
  const { gameState, updateGameState } = props;

  const paletteGridColorsMatrix = useMemo(() => {
    const colorsMatrix: Record<string, string> = {};
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const distanceFromCenter = Math.sqrt(
          Math.pow(row + 0.5 - centerRow, 2) +
            Math.pow(col + 0.5 - centerCol, 2),
        );
        colorsMatrix[[row, col].join(",")] = calculateShade(
          distanceFromCenter,
          maxDistance,
        );
      }
    }
    return colorsMatrix;
  }, []);

  const colorPaletteGrid = useMemo(() => {
    return Object.entries(paletteGridColorsMatrix).map(
      ([coordinates, color]) => {
        const [row, col] = coordinates.split(",");
        return (
          <div key={`${row}-${col}`} className={"color-block"}>
            <div
              className={"color-block__inner"}
              style={{ backgroundColor: color }}
            >
              <div
                className={"color-block__front"}
                style={{ backgroundColor: color }}
              />
              <div className="color-block__back">
                <h3 className={"color-block__back-text"}>
                  {outputFormat[gameState.colorMode](color)}
                </h3>
              </div>
            </div>
          </div>
        );
      },
    );
  }, [gameState.colorMode, paletteGridColorsMatrix]);

  return (
    <div className={"menu-scene"}>
      <div className="grid-container">{colorPaletteGrid}</div>
      <div className={"menu-scene__form"}>
        <h1 className={"menu-scene__title"}>Color quiz</h1>
        <p className="menu-scene__description">
          Guess the correct color code from the options to challenge yourself
        </p>
        <Switch
          label={"Color mode"}
          onCheck={(value: string) => {
            updateGameState({
              ...gameState,
              colorMode: value as ColorMode,
            });
          }}
          options={[
            {
              value: "hex",
              label: "Hex",
            },
            {
              value: "rgb",
              label: "RGB",
            },
            {
              value: "hsv",
              label: "HSV",
            },
            {
              value: "hsl",
              label: "HSL",
            },
          ]}
        />
        <Switch
          label={"Game rounds"}
          onCheck={(value: string) => {
            updateGameState({
              ...gameState,
              totalRounds: value as GameRound,
            });
          }}
          options={[
            {
              value: "10",
              label: "10",
            },
            {
              value: "20",
              label: "20",
            },
            {
              value: "endless",
              label: "Endless",
            },
          ]}
        />
        <Button
          className={"menu-scene__button"}
          onClick={() => {
            updateGameState({
              ...gameState,
              currentScene: "game",
            });
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default MenuScene;
