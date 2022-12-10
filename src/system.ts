import { PhysicsBox } from "./physics";

export class System {
    collisionObjects: Array<PhysicsBox> = new Array<PhysicsBox>();
    
    update () {
        for (var object of this.collisionObjects) {
            object.updateBoundingBox();
        }

        this.checkCollisions();
    }

    addObject(box: PhysicsBox) {
        this.collisionObjects.push(box);
    }

    checkCollisions() {
        for (let i = 0; i < this.collisionObjects.length; i++) {
            for (let j = i + 1; j < this.collisionObjects.length; j++) {
                this.collisionObjects[i].checkCollision(this.collisionObjects[j]);
            }
        }
    }
}