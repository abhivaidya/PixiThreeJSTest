
class ShapeFactory 
{
	private game: Game;

    constructor(game: Game) 
    {
		this.game = game;
	}

    private createRigidBody(threeObject: THREE.Object3D, physicsShape: Ammo.btConvexShape, mass: number, pos: THREE.Vector3, quat: THREE.Quaternion): void 
    {
		var transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
		transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
		const motionState = new Ammo.btDefaultMotionState(transform);

		const localInertia = new Ammo.btVector3(0, 0, 0);
		physicsShape.calculateLocalInertia(mass, localInertia);

		var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
		var body = new Ammo.btRigidBody(rbInfo);

		this.game.addPhysicsObject(threeObject, body, mass);
	}

    public createParalellepiped(sx: number, sy: number, sz: number, mass: number, pos: THREE.Vector3, quat: THREE.Quaternion, material: THREE.Material): THREE.Mesh 
    {
		let threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
		threeObject.position.copy(pos);
		threeObject.quaternion.copy(quat);
		let shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
		shape.setMargin(0.05);

		this.createRigidBody(threeObject, shape, mass, pos, quat);
		return threeObject;
	}
}