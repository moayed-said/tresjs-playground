<template>
    <TresMesh ref="runningPlaneAnimted" :position-x="0" :position-y="0">
        <TresPlaneGeometry :args="[5, 5, 1, 1]" />
        <TresMeshBasicMaterial 
            v-bind="runnerTexture"
            transparent="true"
            :side="DoubleSide"
            v-log:material
              />
    </TresMesh>
</template>
<script setup>
  import { watchEffect, toRaw, onMounted, defineOptions } from 'vue';
  import { TextureLoader, DoubleSide, RepeatWrapping, Vector3 , MathUtils } from 'three'
  import { useTexture, vLog, useLoader, useLoop, useRenderLoop } from '@tresjs/core'
  import { TextureAnimator, rotateAboutPoint } from '../utils.js'
  const runningPlaneAnimted = ref(null)

  defineOptions({
    name: 'AnimtedSpriteTexture'
  });

  
  const { renderer } = useTresContext()
  const { onLoop } = useRenderLoop()
  const { onBeforeRender } = useLoop()

  const props = defineProps({
    cardRotateDeg: {
      type: Number,
      default: 0,
    },
  })
  
  renderer.premultipliedAlpha = false
  const runnerTexture = await useTexture({ map: "./textures/run.png",})
  const animtedRunnertexture = new TextureAnimator(runnerTexture.map, 10, 1, 10, 75)

onLoop(({ delta, elapsed, clock }) => {
    if (runningPlaneAnimted.value) {
        animtedRunnertexture.update(1000 * delta)
        // rotateAboutPoint(runningPlaneAnimted.value, new Vector3(0, -20, 0), new Vector3(1, 0, 0), MathUtils.degToRad(100 * delta))
    }
})
onMounted(()=> {
})

watchEffect(() => {
    // if(runningPlaneAnimted.value){
    //     rotateAboutPoint(runningPlaneAnimted.value, new Vector3(0, -20, 0), new Vector3(1, 0, 0), MathUtils.degToRad(90))
    // }
    // if(runningPlaneAnimted.value && props.cardRotateDeg){
    //     rotateAboutPoint(runningPlaneAnimted.value, new Vector3(0, -20, 0), new Vector3(1, 0, 0), MathUtils.degToRad(props.cardRotateDeg))
    // }
})

</script>