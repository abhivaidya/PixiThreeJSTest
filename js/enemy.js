var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Enemy = /** @class */ (function () {
    function Enemy() {
    }
    Enemy.prototype.update = function () {
    };
    Enemy.prototype.setPosition = function (position) {
        this.charModel.position.set(position.x, position.y, position.z);
    };
    return Enemy;
}());
var Zombie = /** @class */ (function (_super) {
    __extends(Zombie, _super);
    function Zombie(scene) {
        var _this = _super.call(this) || this;
        _this.leftArmAngle = 0;
        _this.rightArmAngle = 0;
        _this.charModel = Game.enemyModels[0].scene.children[0].clone();
        scene.add(_this.charModel);
        _this.charModel.children[1].rotateX(-Math.PI / 2);
        _this.charModel.children[2].rotateX(-Math.PI / 2);
        return _this;
    }
    Zombie.prototype.update = function () {
        this.leftArmAngle += Math.random() * 0.04;
        this.rightArmAngle += Math.random() * 0.04;
        this.charModel.children[1].rotateX(Math.sin(this.leftArmAngle) * 0.00625);
        this.charModel.children[2].rotateX(Math.sin(this.rightArmAngle) * 0.00625);
    };
    return Zombie;
}(Enemy));
var Skeleton = /** @class */ (function (_super) {
    __extends(Skeleton, _super);
    function Skeleton(scene) {
        var _this = _super.call(this) || this;
        _this.charModel = Game.enemyModels[1].scene.children[0].clone();
        scene.add(_this.charModel);
        _this.charModel.children[1].rotateX(-Math.PI / 2);
        _this.charModel.children[2].rotateX(-Math.PI / 2);
        return _this;
    }
    Skeleton.prototype.update = function () {
    };
    return Skeleton;
}(Enemy));
var Ghost = /** @class */ (function (_super) {
    __extends(Ghost, _super);
    function Ghost(scene) {
        var _this = _super.call(this) || this;
        _this.angle = 0;
        _this.charModel = Game.enemyModels[2].scene.children[0].clone();
        scene.add(_this.charModel);
        _this.charModel.children[1].rotateX(-Math.PI / 2);
        _this.charModel.children[2].rotateX(-Math.PI / 2);
        _this.charModel.position.y += 0.25;
        return _this;
    }
    Ghost.prototype.update = function () {
        this.angle += 0.04;
        this.charModel.position.y += Math.sin(this.angle) * 0.00625;
        // this.charModel.children[1].rotateX()
    };
    return Ghost;
}(Enemy));
