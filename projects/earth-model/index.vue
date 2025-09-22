<template>
    <TresMesh ref="sphereModal">
        <TresSphereGeometry :args="[2, 32, 100]" />
        <TresMeshBasicMaterial 
            v-bind="earthTextures"
            color= "#b10ae8"
            transparent= "true"
            :side= "DoubleSide", 
            :alphaTest= "0.5" 
            v-log:material
              />
    </TresMesh>
</template>
<script setup>
  import { watchEffect, toRaw, defineOptions } from 'vue';
  import { TextureLoader, DoubleSide, RepeatWrapping } from 'three'
  import { useTexture, vLog, useLoader, useLoop, useRenderLoop } from '@tresjs/core'
  
  defineOptions({
    name: 'EarthModel'
  });
  const { onLoop } = useRenderLoop()
  const sphereModal = ref(null)
  const { onBeforeRender } = useLoop()

  watchEffect(()=>{
    if (sphereModal.value) {
      sphereModal.value.rotation.z = -Math.PI/4;
      sphereModal.value.material.alphaMap.repeat.y = 1
      sphereModal.value.material.alphaMap.wrapT = RepeatWrapping
    }
  })
  onLoop(({ delta, elapsed, clock }) => {
    if (sphereModal.value) {
      sphereModal.value.material.alphaMap.offset.y = elapsed*0.02;
    }
  })
//   const earthAlphaMap = useLoader(TextureLoader, '../assets/textures/earthspec1k.jpg')
  const earthTextures = await useTexture({
    // map: "/textures/0.png",
    alphaMap: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg=="
  })
</script>