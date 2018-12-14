var ShapeFactory = /** @class */ (function () {
    function ShapeFactory(game) {
        this.game = game;
    }
    ShapeFactory.prototype.createRigidBody = function (threeObject, physicsShape, mass, pos, quat) {
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);
        var localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);
        this.game.addPhysicsObject(threeObject, body, mass);
    };
    ShapeFactory.prototype.createParalellepiped = function (sx, sy, sz, mass, pos, quat, material) {
        var threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);
        var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(0.05);
        this.createRigidBody(threeObject, shape, mass, pos, quat);
        return threeObject;
    };
    return ShapeFactory;
}());
