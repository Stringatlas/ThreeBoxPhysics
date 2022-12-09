const horizontalKeys = [
    ["a", "ArrowLeft"],
    ["d", "ArrowRight"]
]

const verticalKeys = [
    ["s", "ArrowDown"],
    ["w", "ArrowUp"]
]


export class InputManager {
    static horizontal: number;
    
    static vertical: number;

    static keyPresses: Map<string, boolean> = new Map<string, boolean>();

    static updateKeyUp(event: KeyboardEvent) {
        const key = event.key;
        this.keyPresses.set(key, false);
    }

    static updateKeyDown(event: KeyboardEvent) {
        const key = event.key;
        this.keyPresses.set(key, true);
    }

    static getHorizontal() {
        var value = 0;

        for (let key of horizontalKeys[0]) {
            if (this.keyPresses.has(key) && this.keyPresses.get(key)) {
                value -= 1;
                break;
            }
        }
        
        for (let key of horizontalKeys[1]) {
            if (this.keyPresses.has(key) && this.keyPresses.get(key)) {
                value += 1;
                break;
            }
        }   
        return value;
    }

    static getVertical() {
        var value = 0;

        for (let key of verticalKeys[0]) {
            if (this.keyPresses.has(key) && this.keyPresses.get(key)) {
                value -= 1;
                break;
            }
        }
        
        for (let key of verticalKeys[1]) {
            if (this.keyPresses.has(key) && this.keyPresses.get(key)) {
                value += 1;
                break;
            }
        }  
        return value;
    }

}