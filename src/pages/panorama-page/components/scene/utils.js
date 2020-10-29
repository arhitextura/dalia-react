import { Vector2, Vector3, Raycaster, Frustum, Matrix4 } from "three";

export const toScreenPosition = (obj, _camera, _renderer, _scene) => {
  let { x, y, z } = obj.position;
  var objVector = new Vector3(x, y, z);

  var widthHalf = 0.5 * _renderer.getContext().canvas.width;
  var heightHalf = 0.5 * _renderer.getContext().canvas.height;
  obj.updateMatrix();
  obj.updateMatrixWorld();
  if (_scene.autoUpdate === true) _scene.updateMatrixWorld();
  if (_camera.parent === null) _camera.updateMatrixWorld();
  let vector = objVector.project(_camera);
  // const isVisible =
  //   obj.visible && vector.z >= -1 && vector.z <= 1 ? "" : "none";
  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -vector.y * heightHalf + heightHalf;
  
  //FRUSTUM
  const frustum = new Frustum()
  frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices( _camera.projectionMatrix, _camera.matrixWorldInverse ))
  const isVisible = frustum.containsPoint(obj.position)?"" : "none";


  return { posX: vector.x, posY: vector.y, visibility: isVisible };
};

export const normalizeMouseCoordinates = (_mouse) => {
  const tempX = ( _mouse.x / window.innerWidth ) * 2 - 1;
  const tempY = - ( _mouse.y / window.innerHeight ) * 2 + 1;
  return new Vector2(tempX, tempY)
}

export const to3DPosition = (obj, _mouse, _camera, _sphere) => {
  const raycaster = new Raycaster();
  let mouse = _mouse;
  if(_mouse.x === parseInt(_mouse.x) && _mouse.y === parseInt(_mouse.y) && _mouse.x !== 0){
    mouse = normalizeMouseCoordinates(_mouse)
  } 
  raycaster.setFromCamera(mouse, _camera)
  
  let intersects = raycaster.intersectObject(_sphere)
  // console.log(intersects[0].point)
  if(intersects.length >0){
    obj.position.copy(intersects[0].point)
  }
};

export const screenToWorld = (_obj, _camera, _mouse) =>{
  let mouse = _mouse;
  let toPosition = new Vector3()
  if(_mouse.x === parseInt(_mouse.x) && _mouse.y === parseInt(_mouse.y) && _mouse.x !== 0){
    mouse = normalizeMouseCoordinates(_mouse)
  } 
  toPosition.set(mouse.x, mouse.y, 0.5)
  toPosition.unproject(_camera)
  toPosition.sub(_camera.position).normalize()
  let distance = - _camera.position.z / toPosition.z;
  
  _obj.position.copy(_camera.position ).add( toPosition.multiplyScalar( 450 ) );
}