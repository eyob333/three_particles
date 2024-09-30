import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/12.png')

/**
 * Buffer Geomety
 * 
 */

const particleGeometry = new THREE.BufferGeometry()
const count = 20000

const position = new Float32Array(count * 3)
const color = new Float32Array(count * 3)

for (let i= 0; i < count * 3; i++){
    position[i] = (Math.random()- 0.5) * 10
    color[i] = Math.random()
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(position, 3)
)

particleGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(color, 3) 
)

// material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
})

// particleMaterial.color = new THREE.Color('#ff88cc')
particleMaterial.transparent = true
particleMaterial.alphaMap= particleTexture
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false
particleMaterial.depthWrite = false 
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.vertexColors = true
gui.add( particleMaterial, 'size').min(0).max(4).step(0.0001)


// points
const particle = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particle)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //particle

    // particle.rotation.y = elapsedTime 

    for (let i= 0; i < count * 3; i++){
        const i3 = i * 3 
        const x = particleGeometry.attributes.position.array[i3] 
        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)

    }

    particleGeometry.attributes.position.needsUpdate = true


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()