import { Vector2, Vector3, Mesh}  from "three"

export type calculate = (position: Vector3, velocity: Vector3) => void;


export type physicsObjects = Array<Mesh>