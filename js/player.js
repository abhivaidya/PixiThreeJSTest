var Player = /** @class */ (function () {
    function Player(scene, gltfFile, playerTexture) {
        this.walkSpeed = 0;
        this.turnSpeed = 0;
        this.speed = 2;
        this.clock = new THREE.Clock();
        this.currAnimCount = 0;
        this.charModel = gltfFile.scene;
        this.charAnims = gltfFile.animations;
        playerTexture.flipY = false;
        this.charModel.children[0].material.map = playerTexture;
        scene.add(this.charModel);
        var playerScale = 0.06;
        this.charModel.scale.set(playerScale, playerScale, playerScale);
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
        this.mixer = new THREE.AnimationMixer(this.charModel);
        // mixers.push( mixer );
        this.actions = [];
        this.actionNames = [];
        for (var i = 0; i < this.charAnims.length; i++) {
            var clip = this.charAnims[i];
            var action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            this.actionNames.push(clip.name);
        }
        console.log(this.actions);
        // this.actions[this.actionNames[this.currAnimCount]].play();
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
            case 32:
                this.changeAnim();
                break;
        }
    };
    Player.prototype.changeAnim = function () {
        this.actions[this.actionNames[this.currAnimCount]].fadeOut(0.5);
        this.currAnimCount++;
        if (this.currAnimCount > this.charAnims.length - 1)
            this.currAnimCount = 0;
        this.actions[this.actionNames[this.currAnimCount]]
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(0.5)
            .play();
    };
    Player.prototype.update = function () {
        var delta = this.clock.getDelta();
        if (this.mixer)
            this.mixer.update(delta);
        this.charModel.translateZ(this.walkSpeed * delta);
        this.charModel.rotation.y += this.turnSpeed * delta;
    };
    return Player;
}());
