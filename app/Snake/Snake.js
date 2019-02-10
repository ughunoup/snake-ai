const BodyPart = require('./BodyPart.js');
const NeuralNet = require('../Brain/NeuralNet.js');
const directions = require('../Game/Directions.js');
const config = require('../config.js');

class Snake {
    constructor(id) {
        this.setDefaults();
        this.bodySize = 0;
        this.fitness = 0;
        this.moves = 0;
        this.id = id;
        this.directionChanges = 0;
        this.alive = true;
        this.brain = new NeuralNet(config.neuralNetConfig);
        this.calcFitness = config.calcFitness;
    }

    setDefaults(){
        this.direction = null;
        this.head = new BodyPart({
            x: 0,
            y: 0
        })
    }

    move(){
        if(this.head.position === null) throw "There is no head position";
        this.head.move(this.direction);
        this.moves += 1;
        return this;
    }

    setDirection(direction){
        if (this.direction === null) {
            this.direction = direction;
            return this;
        }

        if (this.isWrongDirection(direction)) {
            // console.error("You are trying to move snake in the oposite direction");
        } else {
            this.directionChanges += 1;
            this.direction = direction;
        }

        return this;
    }

    isWrongDirection(direction) {
        return (
            (direction.x === -1 && this.direction.x === 1) ||
            (direction.x === 1 && this.direction.x === -1) ||
            (direction.y === -1 && this.direction.y === 1) ||
            (direction.y === 1 && this.direction.y === -1)
        );
    }

    grow(){
        this.head.recreate();
        this.bodySize += 1;
        return this;
    }

    die() {
        this.alive = false;
    }

    /**
     * @return {Array.<BodyPart>}
     */
    getFullBody(){
        let body = [];
        let actualItem = this.head;
        while(actualItem.next !== null){
            body.push(actualItem);
            actualItem = actualItem.next;
        }

        // push last element
        body.push(actualItem);

        return body;
    }

    calcFitness() {
        this.fitness = this.moves;
    }

    clone() {
        let clone = new Snake(this.id);
        clone.brain = this.brain.clone();
        return clone;
    };

    /**
     * @param {Snake} snake
     * @returns {Snake}
     */
    crossover(snake) {
        let child = this.clone();
        child.brain = this.brain.crossover(snake.brain);
        return child;
    }

    mutate(rate) {
        this.brain.mutate(rate);
        return this;
    }

    decideDirection(input) {
        let brainOutput = this.brain.output(input);
        let maxValue = 0;
        let chosenDirection = null;
        brainOutput.foreach((value) => {
            if (maxValue < value) {
                maxValue = value;
            }
        });

        brainOutput.foreach((value, item, position) => {
            if (maxValue === value) {
                chosenDirection = this.getDirectionByIndex(position.y);
                this.setDirection(chosenDirection);
            }
        });
    }

    getDirectionByIndex(index) {
        if (index === 0) return directions.right;
        if (index === 1) return directions.left;
        if (index === 2) return directions.up;
        if (index === 3) return directions.down;
    }
}

module.exports = Snake;