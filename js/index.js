var sw = 20,  //方块的宽
    sh = 20,  //方块的高
    tr = 30,  //方块的行数
    td = 30;   //方块的列数

var snake = null,
    food = null,
    game = null;

var score = 0;
function Square (x, y, classname) {
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;
    this.viewContent = document.createElement('div');
    this.viewContent.className = this.class;
    this.parent = document.getElementById('snakeWrap');
}
Square.prototype.create =  function () {
	this.viewContent.style.position='absolute';
	this.viewContent.style.width=sw+'px';
	this.viewContent.style.height=sh+'px';
	this.viewContent.style.left=this.x+'px';
	this.viewContent.style.top=this.y+'px';

	this.parent.appendChild(this.viewContent);
};
Square.prototype.remove =  function () {
    this.parent.removeChild(this.viewContent);
}
directionNum = {	//存储蛇走的方向，用一个对象来表示
    left:{
        x:-1,
        y:0,
        rotate:180	//蛇头在不同的方向中应该进行旋转，要不始终是向右
    },
    right:{
        x:1,
        y:0,
        rotate:0
    },
    up:{
        x:0,
        y:-1,
        rotate:-90
    },
    down:{
        x:0,
        y:1,
        rotate:90
    }
}
function createFood () {
    var x,y;
    while(true) {
        x = Math.round(Math.random() * (td - 1));
        y = Math.round(Math.random() * (tr - 1));
        var flag =  false;
        for(var i = 0; i < snake.pos.length; i ++) {
            if (snake.pos[i][0] == x && snake.pos[i][1] == y) {
                flag = true;
                break
            }
        }
        if(!flag) {
            break;
        }
    }
    food = new Square(x,y,'food')
}
function Snake () {
    this.head = null;
    this.tail = null;
    this.pos = [];
    this.direction = 'right';//当前方向
}
Snake.prototype.init = function () {
    var snakeHead = new Square(3,0,'snakeHead');
    var snakeBody1 = new Square(2,0,'snakeBody');
    var snakeBody2 = new Square(1,0,'snakeBody');
    snakeHead.last = null;
    snakeHead.next = snakeBody1;
    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;
    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;
    this.head = snakeHead;
    this.tail =  snakeBody2;
    this.pos = [[1,0],[2,0],[3,0]]
}
Snake.prototype.getNextPos =  function () {
    var nextPosX = Math.round(this.head.x/sw) + directionNum[this.direction]["x"];
    var nextPosY = Math.round(this.head.y/sh) + directionNum[this.direction]["y"];
    //1.normal move
    console.log(food);
    if(nextPosX == food.x && nextPosY == food.y) {
        this.eat();
        createFood();
    }
    else {
        var flag = false;
        if(nextPosX >= td || nextPosX < 0 ||nextPosY >= tr || nextPosY < 0) {
            flag = true;
        }
        this.pos.forEach(function(element) {
            if(element[0] == nextPosX && element[1] == nextPosY) {
                flag = true;
            }
        })
        if(!flag) {
            this.move();
            //normal move
        }
        else {
            this.die();
            //die
        }
    }
    //2.eat
    //3.die
}
Snake.prototype.die = function () {
    console.log('死了')
}
Snake.prototype.eat = function () {
    game.score ++;
    var nextPosX = this.head.x + directionNum[this.direction]["x"];
    var nextPosY = this.head.y + directionNum[this.direction]["y"];
    var oldHead = new Square(snake.head.x,snake.head.y,'snakeBody');
    var newNode = new Square(nextPosX,nextPosY,'snakeHead');
    oldHead.next = snake.head.next;
    snake.head.next.last = oldHead;
    snake.head = oldHead;
    snake.head.last = newNode;
    newNode.last = null;
    newNode.next = snake.head;
    snake.head = newNode;
    snake.pos.push([nextPosX,nextPosY])
}

Snake.prototype.move = function () {
    var nextPosX = this.head.x + directionNum[this.direction]["x"];
    var nextPosY = this.head.y + directionNum[this.direction]["y"];
    var oldHead = new Square(snake.head.x,snake.head.y,'snakeBody');
    var newNode = new Square(nextPosX,nextPosY,'snakeHead');
    oldHead.next = snake.head.next;
    snake.head.next.last = oldHead;
    snake.head = oldHead;
    snake.head.last = newNode;
    newNode.last = null;
    newNode.next = snake.head;
    snake.head = newNode;
    snake.pos.push([nextPosX,nextPosY])
    snake.pos.shift()
    snake.tail = snake.tail.last;
    snake.next = null;
}
function Game () {
    this.timer = null;
    this.score = 0;
}
Game.prototype.init = function () {
    createFood();
    snake.init();
    document.onkeydown=function(ev){
		if(ev.which==37 && snake.direction!="right"){	//用户按下左键的时候，这条蛇不能是正下往右走
			snake.direction="left";
		}else if(ev.which==38 && snake.direction!="down"){
			snake.direction="up";
		}else if(ev.which==39 && snake.direction!="left"){
			snake.direction="right";
		}else if(ev.which==40 && snake.direction!="up"){
			snake.direction="down";
		}
    }
    this.start();
}
Game.prototype.start = function () {
    this.timer = setInterval(function () {
        snake.getNextPos();
    },200);
}
snake = new Snake();
game = new Game();
var startBtn = document.querySelector('.startBtn')
startBtn.addEventListener('click', function (e) {
    console.log('开始')
    startBtn.display = 'none';
    game.init();
})
