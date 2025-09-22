import { ref, readonly } from 'vue'

export default function (){
    const isInLoading = ref(false)

    const triggerPending =  ()=> {
        isInLoading.value = true
    }
    const triggerResolve =  ()=> {
        isInLoading.value = false
    }

    return {
        isInLoading: readonly(isInLoading),
        triggerPending,
        triggerResolve

    }
}