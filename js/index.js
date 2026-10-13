const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

canvas.width = 1024 * dpr
canvas.height = 576 * dpr
c.imageSmoothingEnabled = false

const MAP_ROWS = 28
const MAP_COLS = 28

const MAP_WIDTH = 16 * MAP_COLS
const MAP_HEIGHT = 16 * MAP_ROWS

const MAP_SCALE = dpr + 3

const VIEWPORT_WIDTH = canvas.width / MAP_SCALE
const VIEWPORT_HEIGHT = canvas.height / MAP_SCALE

const VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2
const VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2

const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH
const MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT

const layersData = {
  l_Terrain: l_Terrain,
  l_Trees_1: l_Trees_1,
  l_Trees_2: l_Trees_2,
  l_Trees_3: l_Trees_3,
  l_Trees_4: l_Trees_4,
  l_Landscape_Decorations: l_Landscape_Decorations,
  l_Landscape_Decorations_2: l_Landscape_Decorations_2,
  l_Houses: l_Houses,
  l_House_Decorations: l_House_Decorations,
  l_Characters: l_Characters,
  l_Collisions: l_Collisions,
}

const frontRendersLayersData = {
  l_Front_Renders: l_Front_Renders,
  l_Front_Renders_2: l_Front_Renders_2,
  l_Front_Renders_3: l_Front_Renders_3,
}

const tilesets = {
  l_Terrain: { imageUrl: './images/terrain.png', tileSize: 16 },
  l_Front_Renders: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Front_Renders_2: { imageUrl: './images/characters.png', tileSize: 16 },
  l_Front_Renders_3: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_1: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_2: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_3: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Trees_4: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Landscape_Decorations: {
    imageUrl: './images/decorations.png',
    tileSize: 16,
  },
  l_Landscape_Decorations_2: {
    imageUrl: './images/decorations.png',
    tileSize: 16,
  },
  l_Houses: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_House_Decorations: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_Characters: { imageUrl: './images/characters.png', tileSize: 16 },
  l_Collisions: { imageUrl: './images/characters.png', tileSize: 16 },
}

// Tile setup
const collisionBlocks = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX = ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize
        const srcY =
          Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16 // destination width, height
        )
      }
    })
  })
}

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas
}
// END - Tile setup

// Change xy coordinates to move player's default position
const player = new Player({
  x: 100,
  y: 100,
  size: 15,
})

const monsterSprites = {
  walkDown: {
    x: 0,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkUp: {
    x: 16,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkLeft: {
    x: 32,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
  walkRight: {
    x: 48,
    y: 0,
    width: 16,
    height: 16,
    frameCount: 4,
  },
}

const monsters = [
  new Monster({
    x: 200,
    y: 150,
    size: 15,
    imageSrc: './images/bamboo.png',
    sprites: monsterSprites,
  }),
  new Monster({
    x: 300,
    y: 150,
    size: 15,
    imageSrc: './images/dragon.png',
    sprites: monsterSprites,
  }),
  new Monster({
    x: 48,
    y: 400,
    size: 15,
    imageSrc: './images/bamboo.png',
    sprites: monsterSprites,
  }),
  new Monster({
    x: 288,
    y: 416,
    size: 15,
    imageSrc: './images/bamboo.png',
    sprites: monsterSprites,
  }),
  new Monster({
    x: 112,
    y: 416,
    size: 15,
    imageSrc: './images/dragon.png',
    sprites: monsterSprites,
  }),
  new Monster({
    x: 400,
    y: 400,
    size: 15,
    imageSrc: './images/dragon.png',
    sprites: monsterSprites,
  }),
]

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastTime = performance.now()
let frontRendersCanvas
const hearts = [
  new Heart({
    x: 10,
    y: 10,
  }),
  new Heart({
    x: 32,
    y: 10,
  }),
  new Heart({
    x: 54,
    y: 10,
  }),
]

const leafs = [
  new Sprite({
    x: 20,
    y: 20,
    velocity: {
      x: 0.08,
      y: 0.08,
    },
  }),
]

let elapsedTime = 0

function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime
  elapsedTime += deltaTime

  if (elapsedTime > 1.5) {
    leafs.push(
      new Sprite({
        x: Math.random() * 150,
        y: Math.random() * 50,
        velocity: {
          x: 0.08,
          y: 0.08,
        },
      })
    )
    elapsedTime = 0
  }

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  const horizontalScrollDistance = Math.min(
    Math.max(0, player.center.x - VIEWPORT_CENTER_X),
    MAX_SCROLL_X
  )

  const verticalScrollDistance = Math.min(
    Math.max(0, player.center.y - VIEWPORT_CENTER_Y),
    MAX_SCROLL_Y
  )

  // Render scene
  c.save()
  c.scale(MAP_SCALE, MAP_SCALE)
  c.translate(-horizontalScrollDistance, -verticalScrollDistance)
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)

  // render out our monsters
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i]
    monster.update(deltaTime, collisionBlocks)
    monster.draw(c)

    // Detect for collision
    if (
      player.attackBox.x + player.attackBox.width >= monster.x &&
      player.attackBox.x <= monster.x + monster.width &&
      player.attackBox.y + player.attackBox.height >= monster.y &&
      player.attackBox.y <= monster.y + monster.height &&
      player.isAttacking &&
      !player.hasHitEnemy
    ) {
      monster.receiveHit()
      player.hasHitEnemy = true

      if (monster.health <= 0) {
        monsters.splice(i, 1)
      }
    }

    if (
      player.x + player.width >= monster.x &&
      player.x <= monster.x + monster.width &&
      player.y + player.height >= monster.y &&
      player.y <= monster.y + monster.height &&
      !player.isInvincible
    ) {
      player.receiveHit()

      const filledHearts = hearts.filter((heart) => heart.currentFrame === 4)

      if (filledHearts.length > 0) {
        filledHearts[filledHearts.length - 1].currentFrame = 0
      }

      if (filledHearts.length <= 1) {
        console.log('game over')
      }
    }
  }

  c.drawImage(frontRendersCanvas, 0, 0)

  for (let i = leafs.length - 1; i >= 0; i--) {
    const leaf = leafs[i]
    leaf.update(deltaTime)
    leaf.draw(c)

    if (leaf.alpha <= 0) {
      leafs.splice(i, 1)
    }
    console.log('leafs')
  }

  c.restore()

  c.save()
  c.scale(MAP_SCALE, MAP_SCALE)
  hearts.forEach((heart) => {
    heart.draw(c)
  })
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers(layersData)
    frontRendersCanvas = await renderStaticLayers(frontRendersLayersData)
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

startRendering()
