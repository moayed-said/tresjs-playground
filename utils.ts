import { RepeatWrapping, Vector3, Mesh, Texture} from 'three'

interface TextureAnimatorInstance {
    new (texture: Texture, tilesHoriz: number, tilesVert: number, numTitles: number, tileDispDuration: number ): TextureAnimatorInstance;
    tilesHorizontal: number;
    tilesVertical: number;
    numberOfTiles: number; 
    tileDisplayDuration: number;
    currentDisplayTime: number;
    currentTile: number;
    update(milliSec: number): void
}

export const TextureAnimator = function( this: TextureAnimatorInstance, texture: Texture, tilesHoriz: number, tilesVert: number, numTiles: number, tileDispDuration: number){	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
} as any as TextureAnimatorInstance

export async function getFoldersFromPattren() {
    return import.meta.glob<{ default: Record<string, string> }>(
        "./projects/**/index.vue", 
        {eager: true,}
    );         
}


export function _l(...args: any[]){
    console.log(...args)
}


export function rotateAboutPoint(obj: Mesh, point: Vector3, axis: Vector3, theta: number, pointIsWorld = false){
  
    if(pointIsWorld){
        obj.parent?.localToWorld(obj.position); // compensate for world coordinate
    }
  
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset
  
    if(pointIsWorld){
        obj.parent?.worldToLocal(obj.position); // undo world coordinates compensation
    }
  
    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
