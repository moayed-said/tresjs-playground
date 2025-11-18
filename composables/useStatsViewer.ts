//@ts-nocheck
import Stats from "three/examples/jsm/libs/stats.module.js"

export default () => {
    let stats
    let isContainerExist = document.getElementsByClassName('stats-viewer')[0]
    if (!isContainerExist) {
        stats = new Stats()
        let ctx = stats.dom.children[0].getContext('2d');
    
        stats.dom.style.left = "auto" 
        stats.dom.style.right = "0px"
        stats.dom.className = "stats-viewer"
        stats.dom.statsInstance = stats
        ctx.font  = " bold 18px Pixelify Sans"
        
        document.body.appendChild(stats.dom)
    }else{
        stats = isContainerExist.statsInstance
        isContainerExist.children[0].style.display = "block"
    }

    function disposeStats(){
        let isContainerExist = document.getElementsByClassName('stats-viewer')[0]
        if(isContainerExist) isContainerExist.children[0].style.display = "none"
    }
    
    return{ 
        beginStats: stats.begin,
        endStats: stats.end,
        disposeStats

    }

}
