import Stats from "three/examples/jsm/libs/stats.module.js"

//@ts-nocheck
export default () => {
    const stats = new Stats()
    stats.dom.style.left = "auto" 
    stats.dom.style.right = "0px"
    document.body.appendChild(stats.dom)
    
    return{ 
        beginStats: stats.begin,
        endStats: stats.end,
    }

}
