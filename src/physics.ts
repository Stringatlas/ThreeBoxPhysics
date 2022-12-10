import { Object3D, Mesh, Vector3 as THREEVector3, ArrayCamera} from 'three'
import * as THREE from 'three'
import { Vector3, Vector2} from './vector'

export class Collider {
  mesh: Mesh;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
  }
}

export class PhysicsObject implements Collider{
  velocity: Vector3;
  position: THREEVector3;
  mesh: Mesh;
  mass: number = 1; 

  force: Vector3; 
  acceleration: Vector3;

  gravity: number;
  useGravity: boolean;

  constructor (mesh: Mesh, mass: number=1, startingVelocity: Vector3=Vector3.zero, 
    startingForce: Vector3=Vector3.zero, startingAcceleration: Vector3=Vector3.zero, 
    useGravity: boolean = true, gravity: number=9.8) {
    this.velocity = startingVelocity;
    this.position = mesh.position;
    this.mesh = mesh;
    this.mass = mass;
    this.force = startingForce;
    this.acceleration = startingAcceleration;
    this.useGravity = useGravity;
    this.gravity = gravity;
  }

  addForce(force: Vector3): void {
    this.force = this.force.add(force);
  }

  update(deltaTime: number, force: Vector3 = Vector3.zero): void {
    if (deltaTime === 0) {
      return;
    }

    if (this.useGravity) {
      force = force.add(Vector3.y.multiply(-this.gravity * this.mass));
    }

    // UAM
    var initialVelocity = this.velocity;

    this.acceleration = force.multiply(deltaTime).divide(this.mass);

    // var velocityChange = this.acceleration.multiply(deltaTime);
    this.velocity = this.velocity.add(this.acceleration);

    var displacement = this.acceleration.multiply(deltaTime / 2).add(initialVelocity.multiply(deltaTime)); // triangle + rectangle
    // var displacement2 = this.velocity.add(initialVelocity).multiply(deltaTime / 2);  // trapezoid


    // console.log("velocity", this.velocity);
    // console.log("dispalcement", displacement);
    var futurePos: Vector3 = displacement.add(Vector3.convertThreeVector(this.position));

    this.position = this.position.add(displacement.toThreeVector());
    this.force = force;
    this.acceleration = Vector3.zero;
  }
}

export interface VectorTwo {
  x: number, 
  y: number
}

export class PhysicsBox extends PhysicsObject {
  width: number;
  height: number;
  length: number;

  collisionObjects: Array<PhysicsBox>;

  private lastPosition: Vector3 = new Vector3();
  private xMin: number;
  private xMax: number;
  private yMin: number;
  private yMax: number;
  private zMin: number;
  private zMax: number;

  private boundingBox: Mesh | undefined = undefined;

  constructor(width:number , height: number, length: number, collisionObjects: Array<PhysicsBox>, ...args: ConstructorParameters<typeof PhysicsObject>) {
    super(...args)
    this.width = width;
    this.height = height;
    this.length = length;
    this.collisionObjects = collisionObjects;
    this.collisionObjects.push(this);

    const objectPos = this.mesh.position;
    [this.xMin, this.xMax] = [objectPos.x - (width / 2), objectPos.x + (width / 2)];
    [this.yMin, this.yMax] = [objectPos.y - (height / 2), objectPos.y + (height / 2)];
    [this.zMin, this.zMax] = [objectPos.z - (length / 2), objectPos.z + (length / 2)];
  }

  updateBoundingBox(): void { 
    const objectPos = Vector3.convertThreeVector(this.mesh.position);

    if (objectPos.isEqualTo(this.lastPosition)) return;

    // const deltaPos = objectPos.subtract(this.lastPosition);
    [this.xMin, this.xMax] = [objectPos.x - (this.width / 2), objectPos.x + (this.width / 2)];
    [this.yMin, this.yMax] = [objectPos.y - (this.height / 2), objectPos.y + (this.height / 2)];
    [this.zMin, this.zMax] = [objectPos.z - (this.length / 2), objectPos.z + (this.length / 2)];
    
    if (this.boundingBox != undefined) {
      this.boundingBox.position.set(...this.mesh.position.toArray());
    }

    this.lastPosition = objectPos;
  }

  // collisions should be handled by the system class
  checkCollision(object: PhysicsBox) {
    if (PhysicsBox.checkBoxCollision(this, object)) {
      console.log("COLLISION", this, object);
      PhysicsBox.calcCollision(this, object);
    }
  }


  // @todo -- find the point of incidence if intersects, subtract the time it takes for that displacement to current position
  // from deltatime, use remaining time to move in the opposite direction - for more accurate velocity and position on slow framerates
  // should use raycast in current velocity to predict future frame if will intersect
  static calcCollision(object1: PhysicsBox, object2: PhysicsBox) {
    var [o1m, o2m, o1v, o2v]: [number, number, Vector3, Vector3] = [object1.mass, object2.mass, object1.velocity, object2.velocity];
    var object1FinalVelocity: Vector3 = o1v.multiply(o1m - o2m).add(o2v.multiply(2 * o2m)).divide(o1m + o2m);
    var object2FinalVelocity: Vector3 = o2v.multiply(o2m - o1m).add(o1v.multiply(2 * o1m)).divide(o1m + o2m);

    object1.velocity = object1FinalVelocity;
    object2.velocity = object2FinalVelocity;
    console.log("VELOCITIES", object1.velocity, object2.velocity);
  }

  showBoundingBox(scene: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10ff22,
      wireframe: true,
    })
    
    this.boundingBox = new THREE.Mesh(geometry, material);
    this.boundingBox.position.set(...this.mesh.position.toArray());
    scene.add(this.boundingBox);
  }

  static checkBoxCollision(object1: PhysicsBox, object2: PhysicsBox): boolean {
    if (!this.isAxisIntersect(object1.xMin, object1.xMax, object2.xMin, object2.xMax)) return false;
    if (!this.isAxisIntersect(object1.yMin, object1.yMax, object2.yMin, object2.yMax)) return false;
    if (!this.isAxisIntersect(object1.zMin, object1.zMax, object2.zMin, object2.zMax)) return false;

    return true
  }

  static isAxisIntersect(o1MinX: number, o1MaxX: number, o2MinX: number, o2MaxX: number): boolean {
    if (o2MinX < o1MinX && o1MinX < o2MaxX) return true;
    if (o2MinX < o1MaxX && o1MaxX < o2MaxX) return true;

    if (o1MinX < o2MinX && o2MinX < o1MaxX) return true;
    if (o1MinX < o2MinX && o2MaxX < o1MaxX) return true;

    return false
  }
}

export class PhysicsSphere extends PhysicsObject {
  radius: number;

  constructor(radius: number, ...args: ConstructorParameters<typeof PhysicsObject>) {
    super(...args)
    this.radius = radius;
  }
}


