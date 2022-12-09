
import {Mesh, Vector3, Vector3Tuple } from 'three'

export class ThreeObject {
  mesh: Mesh;

  pos: Vector3Tuple = [0, 0, 0];



  constructor (mesh: Mesh) {
    this.mesh = mesh;
  }

  translate(x: number, y: number, z: number) {
    let currentPos: Vector3 = new Vector3();

    this.mesh.getWorldPosition(currentPos);
    this.mesh.position.set(x + currentPos.x, y + currentPos.y, z + currentPos.z);
    this.mesh.translateOnAxis(new Vector3(1, 0, 0), x);
    this.mesh.translateOnAxis(new Vector3(0, 1, 0), y);
    this.mesh.translateOnAxis(new Vector3(0, 0, 1), z);
  }
}