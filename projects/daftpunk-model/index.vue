<script setup >
    import { useGLTF } from '@tresjs/cientos'
    import { useTexture } from '@tresjs/core'
    import { MeshBasicMaterial } from 'three'

    const { scene, nodes } = await useGLTF('/models/scene.gltf', { draco: true })
    let helmtEyeShieldTexture = await useTexture({ map: "/textures/output.png",})

    nodes['The_tall_one_3'].children[0].material.map = helmtEyeShieldTexture.map
    nodes['The_tall_one_3'].position.x = 0;

    console.log(nodes['The_tall_one_3'])
</script>

<template>
  <primitive :object="scene" />
</template>