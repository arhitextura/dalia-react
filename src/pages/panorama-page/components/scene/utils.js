import { Vector2, Vector3, Raycaster, Frustum, Matrix4 } from "three";

export const toScreenPosition = (obj, _camera, _renderer, _scene) => {
  let { x, y, z } = obj.position;
  var objVector = new Vector3(x, y, z);
  let rect = _renderer.domElement.getBoundingClientRect();
  // var widthHalf = 0.5 * _renderer.getContext().canvas.width;
  // var heightHalf = 0.5 * _renderer.getContext().canvas.height;
  //TODO Ceva es in neregul cu prostia asta
  
  var widthHalf = 0.5 * (rect.width - rect.left)
  var heightHalf = 0.5 * (rect.bottom - rect.top)
  obj.updateMatrix();
  obj.updateMatrixWorld();
  if (_scene.autoUpdate === true) _scene.updateMatrixWorld();
  if (_camera.parent === null) _camera.updateMatrixWorld();
  let vector = objVector.project(_camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -vector.y * heightHalf + heightHalf;

  //FRUSTUM
  const frustum = new Frustum()
  frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(_camera.projectionMatrix, _camera.matrixWorldInverse))
  const isVisible = frustum.containsPoint(obj.position) ? "" : "none";


  return { posX: vector.x, posY: vector.y, visibility: isVisible };
};

export const normalizeMouseCoordinates = (_mouse, _renderer) => {
  console.log("Normalized");
  const rect = _renderer.domElement.getBoundingClientRect();
  const x = ((_mouse.x - rect.left) / (rect.width - rect.left)) * 2 - 1;
  const y = - ((_mouse.y - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
  return new Vector2(x, y)
}

export const to3DPosition = (obj, _mouse, _camera, _sphere) => {
  const raycaster = new Raycaster();
  let mouse = _mouse;
  if (_mouse.x === parseInt(_mouse.x) && _mouse.y === parseInt(_mouse.y) && _mouse.x !== 0) {
    mouse = normalizeMouseCoordinates(_mouse)
  }
  raycaster.setFromCamera(mouse, _camera)

  let intersects = raycaster.intersectObject(_sphere)
  // console.log(intersects[0].point)
  if (intersects.length > 0) {
    obj.position.copy(intersects[0].point)
  }
};

export const screenToWorld = (_obj, _camera, _mouse) => {
  let mouse = _mouse;
  let toPosition = new Vector3()
  if (_mouse.x === parseInt(_mouse.x) && _mouse.y === parseInt(_mouse.y) && _mouse.x !== 0) {
    mouse = normalizeMouseCoordinates(_mouse)
  }
  toPosition.set(mouse.x, mouse.y, 0.5)
  toPosition.unproject(_camera)
  toPosition.sub(_camera.position).normalize()
  let distance = - _camera.position.z / toPosition.z;

  _obj.position.copy(_camera.position).add(toPosition.multiplyScalar(450));
}