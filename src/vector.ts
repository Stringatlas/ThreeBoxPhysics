
import { Vector2 as THREEVector2, Vector3 as THREEVector3} from 'three'

interface Vector {
    getNormalized: Function
    dot: Function

}
export class Vector2 implements Vector {
    x: number
    y: number
    constructor(x: number=0, y: number=0) {
      this.x = x;
      this.y = y;
    }
    
    getNormalized() {
      let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
      if (magnitude == 0) {
        return new Vector2(this.x, this.y)
      }
      return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    add(otherVector: Vector2) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    subtract(otherVector: Vector2) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }

    multiply(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    toThreeVector() {
        return new THREEVector2(this.x, this.y);
    }

    dot(otherVector: Vector2) {
        return otherVector.x * this.x + otherVector.y * this.y
    }  

    isEqualTo(v: Vector2) {
        if (v.x == this.x && v.y == this.y) return true;

        return false;
    }

    static zero = new Vector2(0, 0);
    static one = new Vector2(1, 1);

    static x = new Vector2(1, 0);
    static y = new Vector2(0, 1);

    static convertThreeVector = (vector: THREEVector2) => new Vector2(vector.x, vector.y);
    
}

export class Vector3 implements Vector{
    x: number
    y: number
    z: number

    constructor(x: number=0, y: number=0, z: number=0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
      
    getNormalized() {
        let magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        
        if (magnitude == 0) {
            return new Vector3();
        }

        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }

    add(otherVector: Vector3) {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    }

    subtract(otherVector: Vector3) {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    }

    multiply(scalar: number) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    divide(scalar: number) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    toThreeVector() {
        return new THREEVector3(this.x, this.y, this.z);
    }

    dot(otherVector: Vector3) {
        return otherVector.x * this.x + otherVector.y * this.y + otherVector.z + this.z
    }

    isEqualTo(v: Vector3) {
        if (v.x == this.x && v.y == this.y && v.z == this.z) return true;

        return false;
    }

    static zero = new Vector3(0, 0, 0);
    static one = new Vector3(1, 1, 1);
    
    static x = new Vector3(1, 0, 0);
    static y = new Vector3(0, 1, 0);
    static z = new Vector3(0, 0, 1);

    static convertThreeVector = (vector: THREEVector3) => new Vector3(vector.x, vector.y, vector.z);
}