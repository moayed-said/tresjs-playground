<script setup>
    import { useTresContext } from '@tresjs/core'
    const {camera, scene} = useTresContext()
    camera.value.position.z = 5;
    camera.value.position.x = 0;
    camera.value.position.y = 0;

</script>

