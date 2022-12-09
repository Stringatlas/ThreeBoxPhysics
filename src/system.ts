import { PhysicsBox } from "./physics";

export class System {
    collisionObjects: Array<PhysicsBox> = new Array<PhysicsBox>();

    addObject(box: PhysicsBox) {
        this.collisionObjects.push(box);
    }   
}