<template>
    <!-- <Teleport defer to="#project-title">
        <h2>Interactive Rubic Cube Example</h2>
    </Teleport> -->
    <template v-for="cubicMesh in cubicMeshs">
        <primitive :object="cubicMesh" :dispose="true" />
    </template>
</template>
<script setup async>
import { ref } from 'vue'
import { BoxGeometry, Mesh, MeshBasicMaterial, Color, Float32BufferAttribute, Vector2, Vector3, Raycaster, MathUtils, Quaternion, Box3 } from 'three'
import { useRenderLoop, useTresContext } from '@tresjs/core'
import { rotateAboutPoint } from '../utils.js'
import useStatsViewer from '~/composables/useStatsViewer.ts'
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

const {beginStats, endStats} = useStatsViewer()


const CUBIC_COLOR_ENUM = ['red', 'green', 'blue', 'yellow', 'orange', 'purple']
const CUBIC_DIRECTION_ENUM = ['up', 'down', 'left', 'right', 'front', 'back']
const CUBIC_DIRECTION_OFFSET = [[0,1,0], [0,-1,0], [-1,0,0], [1,0,0], [0,0,-1], [0,0,1]]


let cubicMeshs = []
let cubicMeshsBB = []
let cubeSections = {
    oneface: [0, 1, 2, 3, 4, 5],
    twofaces: [[0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,4], [2,5], [3,4], [3,5]],
    threeFaces: [[0,4,3], [0,4,2], [0,5,3], [0,5,2], [1,4,3], [1,4,2], [1,5,3], [1,5,2]]
}

const windowHalfX = window.innerWidth / 2;
const windowHalfY =  window.innerHeight / 2;

let mousePointer = new Vector2()
let raycaster = new Raycaster()

let targetRotation = 0;
let targetRotationOnPointerDown = 0;
let pointerX = 0;
let pointerXOnPointerDown = 0;
let isPointerDown = false;


const { onLoop } = useRenderLoop()
const { camera, scene, renderer } = useTresContext()

camera.value.position.set(100,100,100)

onLoop(({ delta, elapsed, clock }) => {
    beginStats()
    raycaster.setFromCamera( mousePointer, camera.value );
    const intersects = raycaster.intersectObjects( scene.value.children );

    cubicMeshs.forEach((cubicMesh) => {
        // const collisionedMeshIndex = cubicMeshs.findIndex((cm) => cm.uuid === cubicMeshBB.referenceMeshUuid)
        if(checkBoundingBoxCollision(intersectorYMesh,cubicMesh) || checkBoundingBoxCollision(intersectorXMesh,cubicMesh)){
            cubicMesh.material.opacity = 0.5;
            let newRotationDegree = (( targetRotation - cubicMesh.rotation.y ) * 0.05 )
            rotateAboutPoint(cubicMesh, new Vector3(0, 0, 0), new Vector3(0, 1, 0), newRotationDegree)
        } 
    })
    endStats()
})

function checkBoundingBoxCollision(mesh1, mesh2) {
  // Update world matrices
  mesh1.updateMatrixWorld();
  mesh2.updateMatrixWorld();
  
  // Get bounding boxes in world coordinates
  const box1 = new Box3().setFromObject(mesh1);
  const box2 = new Box3().setFromObject(mesh2);
  
  return box1.intersectsBox(box2);
}

function onPointerDown( event ) {
    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {
    mousePointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    pointerX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

}

function onPointerUp( event ) {
    isPointerDown= false;
    document.removeEventListener( 'pointermove', onPointerMove );
    document.removeEventListener( 'pointerup', onPointerUp );

}

window.addEventListener( 'pointerdown', onPointerDown );

Object.keys(cubeSections).forEach((key, i) => {
    for(let j = 0 ; j < cubeSections[key].length; j++){
        if(i === 0){
            let cubicColors = []
            let cubicGeometry = new BoxGeometry(10,10,10).toNonIndexed()
            let cubicMesh = new Mesh(cubicGeometry, new MeshBasicMaterial({vertexColors:true, transparent: true}))
            let cubicMeshBB = new Box3(new Vector3(), new Vector3()).setFromObject(cubicMesh)
            cubicMeshBB.referenceMeshUuid = cubicMesh.uuid
            cubicColors = getCubicColor(new Array(6).fill(0).map((_, cfi) => cfi === j ? new Color(CUBIC_COLOR_ENUM[j]) : 0))
            cubicGeometry.setAttribute('color', new Float32BufferAttribute(cubicColors, 3));

            let cubicPosition = CUBIC_DIRECTION_OFFSET[j].map((d) => d * (10 + 1))
            cubicMesh.position.set(...cubicPosition)
            cubicMesh.rotation.y = Math.PI * 2
            cubicMeshs.push(cubicMesh)
            cubicMeshsBB.push(cubicMeshBB)
        }
        if(i >= 1){
            let cubicColors = []
            let cubicGeometry = new BoxGeometry(10,10,10).toNonIndexed()
            let cubicMesh = new Mesh(cubicGeometry, new MeshBasicMaterial({vertexColors:true, transparent: true}))
            let cubicMeshBB  = new Box3(new Vector3(), new Vector3()).setFromObject(cubicMesh)
            cubicMeshBB.referenceMeshUuid = cubicMesh.uuid
            let cubicPosition = new Array(3).fill(0)
            cubeSections[key][j].map((faceDirectionIndex) => {
                CUBIC_DIRECTION_OFFSET[faceDirectionIndex].map((offsetPositionArray, OffsetPositionindex) => {
                    if(offsetPositionArray !== 0){
                        cubicPosition[OffsetPositionindex] = offsetPositionArray * (10 + 1)
                    } 
                })
            })
            cubicColors = getCubicColor(new Array(6).fill(null).map((_, cfi) => 
                cubeSections[key][j].find((pi)=> pi === cfi) !== null
                    ? new Color(CUBIC_COLOR_ENUM[cubeSections[key][j][(cubeSections[key][j].findIndex((pi)=> pi === cfi))]]) 
                    : 0
                )
            )            
            cubicGeometry.setAttribute('color', new Float32BufferAttribute(cubicColors, 3));
            cubicMesh.position.set(...cubicPosition)
            cubicMesh.rotation.y = Math.PI * 2
            cubicMeshs.push(cubicMesh)
            cubicMeshsBB.push(cubicMeshBB)
        }
    }
})

let intersectorYGeom = new BoxGeometry(4,32,32)
let intersectorXGeom = new BoxGeometry(32,4,32)

let intersectorYMesh = new Mesh(intersectorYGeom, new MeshBasicMaterial({color:'red'}))
let intersectorXMesh = new Mesh(intersectorXGeom, new MeshBasicMaterial({color:'red'}))






function getCubicColor(facesColor){
    let colorBufferAttribute = new Array(108).fill(0)
    let facesByDircetionMapper = {
        0: 2,
        1: 3,
        2: 1,
        3: 0,
        4: 5,
        5: 4
    }
    facesColor.map((faceColor, i)=> {
        if(faceColor){
            let color = new Color(faceColor)
            let bufferArrayColor = new Array(6).fill(0).flatMap((_)=> [color.r, color.g, color.b] )
            colorBufferAttribute.splice(facesByDircetionMapper[i] * 18, 18, ...bufferArrayColor)
        }else{
            let offestColor = new Color('white') 
            let bufferArrayColor = new Array(6).fill(0).flatMap((_)=> [offestColor.r, offestColor.g, offestColor.b] )
            colorBufferAttribute.splice(facesByDircetionMapper[i] * 18, 18, ...bufferArrayColor)
        }
    })
    return colorBufferAttribute

}



</script>