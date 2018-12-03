var Player = /** @class */ (function () {
    function Player(scene, playerModel, playerTexture) {
        this.walkSpeed = 0;
        this.turnSpeed = 0;
        this.speed = 2;
        this.clock = new THREE.Clock();
        this.charModel = playerModel;
        // console.log(playerModel);
        playerTexture.flipY = false;
        playerModel.children[0].material.map = playerTexture;
        scene.add(this.charModel);
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
    }
    Player.prototype.lookAt = function (intersectPoint) {
        // this.charModel.lookAt(intersectPoint);
    };
    Player.prototype.startMoving = function (eventKeyCode) {
        switch (eventKeyCode) {
            case 87:
                this.walkSpeed = this.speed;
                break;
            case 83:
                this.walkSpeed = -this.speed;
                break;
            case 65:
                this.turnSpeed = this.speed;
                break;
            case 68:
                this.turnSpeed = -this.speed;
                break;
        }
    };
    Player.prototype.stopMoving = function (eventKeyCode) {
        switch (eventKeyCode) {
            case 87:
                this.walkSpeed = 0;
                break;
            case 83:
                this.walkSpeed = 0;
                break;
            case 65:
                this.turnSpeed = 0;
                break;
            case 68:
                this.turnSpeed = 0;
                break;
        }
    };
    Player.prototype.update = function () {
        var delta = this.clock.getDelta();
        this.charModel.translateZ(this.walkSpeed * delta);
        this.charModel.rotation.y += this.turnSpeed * delta;
    };
    return Player;
}());
