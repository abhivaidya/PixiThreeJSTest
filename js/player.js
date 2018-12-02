var Player = /** @class */ (function () {
    function Player(scene, playerModel, playerTexture) {
        this.charModel = playerModel;
        console.log(playerModel);
        playerTexture.flipY = false;
        playerModel.children[0].material.map = playerTexture;
        scene.add(this.charModel);
    }
    Player.prototype.lookAt = function (intersectPoint) {
        this.charModel.lookAt(intersectPoint);
    };
    Player.prototype.update = function () {
    };
    return Player;
}());
