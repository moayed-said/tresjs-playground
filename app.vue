<template>
  <div>
    <!-- Project Selector -->
    <div class="fixed top-0 left-0 h-16 w-full flex z-50 p-4">
      <UiSelect v-model="selectedProject" placehodler="Select Project" :options="projectsListOptions"></UiSelect>
      <span  v-if="isInLoading" class=" text-teal-600 text-3xl leading-6 mx-2">
        <Icon name="pixelarticons:loader" style="font-size: 32px" class="step-spining-loader"></Icon>
        loading ...
      </span>
    </div>

    <!-- <div class="fixed top-0 left-1/2" id="project-title">
    </div>  -->

    <TresCanvas shadows window-size alpha  power-preference="high-performance" :clear-color="'#18181B'" >
      <TresPerspectiveCamera ref="cameraRef" :position="[10, 10, 10]" :lookat="[0, 0, 0]" />
      <OrbitControls />
        <Suspense  @pending="triggerPending" @resolve="triggerResolve">
          <component :is="asyncProjectComponent"></component>
        </Suspense>

        <TresMesh v-if="!asyncProjectComponent" :position-x="0" :position-y="0" :rotation-x="MathUtils.degToRad(270)">
          <TresPlaneGeometry :args="[20, 20, 10, 10]"/>
          <TresMeshBasicMaterial 
            :wireframe="true"
            />
        </TresMesh>
      <TresDirectionalLight :position="[10, 10 , 4]" :intensity="10" cast-shadow visible />
      <TresDirectionalLight :position="[10, 10 , 4]" :intensity="10" cast-shadow visible  />
      <TresAmbientLight color="teal" /> 
      <TresAxesHelper />
    </TresCanvas>
  </div>
</template>
<script setup>
  import { watchEffect, onMounted, ref, computed, defineAsyncComponent, hydrateOnVisible } from 'vue'; 
  import { AmbientLight, TextureLoader, Vector3, DirectionalLightHelper, MathUtils } from 'three'
  import { useTresContext, useLoop, useLoader, useTexture, vLog} from '@tresjs/core'
  import { OrbitControls, GLTFModel } from '@tresjs/cientos'
  import { gsap } from "gsap";
  
  import { getFoldersFromPattren } from './utils.ts'

  const { triggerPending, triggerResolve, isInLoading } = useProjectViewerState()


  let projectsListOptions = ref([]);
  let selectedProject = ref(null)

  let asyncProjectComponent = computed(()=> {
    if(selectedProject.value){
      return defineAsyncComponent({
        loader: ()=> import( /* @vite-ignore */ selectedProject.value),
      })
    }
  })

  const getProjectsListOptions = async () => {
    const projectsPathList = await getFoldersFromPattren()
    return Object.keys(projectsPathList).map((ppl) => {
      return {
        label: ppl.split('/')[2],
        value: ppl
      }
    })
  }

  onMounted( async ()=> {
    projectsListOptions.value = await getProjectsListOptions()
  })

</script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');

  :root{
    font-family: "Pixelify Sans", sans-serif;
  }
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  #canvas {
    height: 100%;
    width: 100%;
  }

  .step-spining-loader {
    animation: step-spining 2s steps(3) infinite;
  }

  @keyframes step-spining {
    to {
      transform: rotate(360deg);
    }
  }
</style>

