var Player = /** @class */ (function () {
    function Player(scene, playerModel, playerTexture) {
        this.charModel = playerModel;
        console.log(playerModel);
        playerTexture.flipY = false;
        playerModel.children[0].material.map = playerTexture;
        scene.add(this.charModel);
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
    }
    Player.prototype.lookAt = function (intersectPoint) {
        this.charModel.lookAt(intersectPoint);
    };
    Player.prototype.move = function (eventKeyCode) {
        switch (eventKeyCode) {
            case 87:
                this.charModel.position.setZ(this.charModel.position.z + 0.05);
                break;
            case 65:
                console.log('a');
                break;
            case 83:
                console.log('s');
                break;
            case 68:
                console.log('d');
                break;
        }
    };
    Player.prototype.update = function () {
    };
    return Player;
}());
