var expect = require("chai").expect;
const Snake = require('../../app/Snake/Snake.js');
const directions = require('../../app/Game/Directions.js');

describe('Snake', function(){
    let snake = null;

    beforeEach(function(){
        snake = new Snake(1);
        snake.setDirection(directions.right);
        snake.head.setPosition({x: 0, y: 0});
        snake
            .grow()
            .grow()
            .grow()
            .move()
            .move()
            .move();

        fullBody = snake.getFullBody();
    });

    describe('Body parts from getFullBody()', function(){
        it('Have different positions after move', function(){
            expect(fullBody[0].position).to.be.not.eql(fullBody[1].position);
        });

        it('Have size 4 after 3 times grow', function(){
           expect(fullBody.length).to.be.equal(4);
        });
    })

    it('Clones', () => {
        let clone = snake.clone();
        expect(snake.brain).to.be.eql(clone.brain);
    });

    it('Choose direction correctly', () => {
        snake.setDirection(directions.right);
        expect(snake.getDirectionByIndex(0)).to.be.eql(directions.up);
        expect(snake.getDirectionByIndex(1)).to.be.eql(directions.right);
        expect(snake.getDirectionByIndex(2)).to.be.eql(directions.down);


        snake.setDirection(directions.up);
        expect(snake.getDirectionByIndex(0)).to.be.eql(directions.left);
        expect(snake.getDirectionByIndex(1)).to.be.eql(directions.up);
        expect(snake.getDirectionByIndex(2)).to.be.eql(directions.right);


        snake.setDirection(directions.left);
        expect(snake.getDirectionByIndex(0)).to.be.eql(directions.down);
        expect(snake.getDirectionByIndex(1)).to.be.eql(directions.left);
        expect(snake.getDirectionByIndex(2)).to.be.eql(directions.up);


        snake.setDirection(directions.down);
        expect(snake.getDirectionByIndex(0)).to.be.eql(directions.right);
        expect(snake.getDirectionByIndex(1)).to.be.eql(directions.down);
        expect(snake.getDirectionByIndex(2)).to.be.eql(directions.left);
    });
});