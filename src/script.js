import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load(
  './textures/door/color.jpg')
// Configure texture properties
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping

/**
 * Debug UI
 */
const gui = new dat.GUI()

const parameters = {
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}

const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({ 
    map: colorTexture
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Position controls
gui.add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')

// Visibility control
gui.add(mesh, 'visible')

// Wireframe control
gui.add(material, 'wireframe')

// Spin function control
gui.add(parameters, 'spin')

// Texture controls
const textureFolder = gui.addFolder('Texture Controls')
textureFolder.add(colorTexture.repeat, 'x').min(1).max(5).step(1).name('Repeat X')
textureFolder.add(colorTexture.repeat, 'y').min(1).max(5).step(1).name('Repeat Y')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()