import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapTileDataSource,
  YMapLayer,
} from "@yandex/ymaps3-types"
import type { FetchedTile } from "@yandex/ymaps3-types"
import "./styles.css"

const tileSize = 256

const realPixels = (x: number) => {
  return x * window.devicePixelRatio
}

/**
 * Создаёт canvas с текущим временем
 * и возвращает его как { image: canvas }
 */
const fetchTile = async (
  tileX: number,
  tileY: number,
  tileZ: number,
  scale: number,
  signal: AbortSignal
): Promise<FetchedTile> => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = realPixels(tileSize)
  canvas.height = realPixels(tileSize)

  let currentDate = new Date();
  let hours = String(currentDate.getHours()).padStart(2, '0');
  let minutes = String(currentDate.getMinutes()).padStart(2, '0');
  let seconds = String(currentDate.getSeconds()).padStart(2, '0');

  ctx.font="30px Georgia"
  ctx.fillStyle = "#000000"
  ctx.fillText(`${hours}:${minutes}:${seconds}`, realPixels(10), realPixels(15))

  return { image: canvas }
}

const ds = new YMapTileDataSource({
  id: "tileDS",
  raster: {
    type: "tiles",
    fetchTile: fetchTile,
    transparent: true,
    size: tileSize,
  },
})

const map = new YMap(
  document.getElementById("root"),
  { location: { center: [34.321359, 61.783364], zoom: 13 } },
  [
    new YMapDefaultSchemeLayer({}),
    ds,
    new YMapLayer({
      zIndex: 2000,
      source: "tileDS",
      type: "tiles",
    })
  ]
)

/**
 * Обновляет тайлы каждую секунду.
 * Должно, но не работает.
 */
const update = () => {
  console.log("update fired")
  // @ts-ignore
  ds.update({raster: {...ds.raster, fetchTile: fetchTile}})
}

let timerId = setInterval(update, 1000);
