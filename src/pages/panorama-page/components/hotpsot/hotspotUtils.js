import { Vector2, Vector3, Raycaster, Frustum, Matrix4 } from "three";

export function normalizeMouseVector(vec2, renderer) {
  let rect = renderer.getBoundingClientRect();
  const x = (vec2.x / (rect.width - rect.left)) * 2 - 1;
  const y = -(vec2.y / (rect.bottom - rect.top)) * 2 + 1;
  return new Vector2(x, y);
}

export const toScreenPosition = (obj, _camera, _renderer, _scene) => {
  let { x, y, z } = obj.position;
  var objVector = new Vector3(x, y, z);
  let rect = _renderer.domElement.getBoundingClientRect();

  var widthHalf = 0.5 * (rect.width - rect.left);
  var heightHalf = 0.5 * (rect.bottom - rect.top);
  obj.updateMatrix();
  obj.updateMatrixWorld();
  if (_scene.autoUpdate === true) _scene.updateMatrixWorld();
  if (_camera.parent === null) _camera.updateMatrixWorld();
  let vector = objVector.project(_camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -vector.y * heightHalf + heightHalf;

  //FRUSTUM
  const frustum = new Frustum();
  frustum.setFromProjectionMatrix(
    new Matrix4().multiplyMatrices(
      _camera.projectionMatrix,
      _camera.matrixWorldInverse
    )
  );
  const isVisible = frustum.containsPoint(obj.position) ? "" : "none";

  return {
    x: parseInt(vector.x),
    y: parseInt(vector.y),
    visibility: isVisible,
  };
};


export const to3DPosition = (obj, _mouse, _camera, _sphere) => {
  const raycaster = new Raycaster();
  raycaster.setFromCamera(_mouse, _camera);
  let intersects = raycaster.intersectObject(_sphere);
  // console.log(intersects[0].point)
  if (intersects.length > 0) {
    obj.position.copy(intersects[0].point);
  }
};

export const screenToWorld = (_obj, _camera, _mouse) => {
  let mouse = _mouse;
  let toPosition = new Vector3();
  if (
    _mouse.x === parseInt(_mouse.x) &&
    _mouse.y === parseInt(_mouse.y) &&
    _mouse.x !== 0
  ) {
    mouse = normalizeMouseVector(_mouse);
  }
  toPosition.set(mouse.x, mouse.y, 0.5);
  toPosition.unproject(_camera);
  toPosition.sub(_camera.position).normalize();

  _obj.position.copy(_camera.position).add(toPosition.multiplyScalar(450));
};


export function dragElement(elmnt, anchor, camera, sphere, renderer) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onpointerdown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onpointerdown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onpointerup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onpointermove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    
    document.onpointerup = null;
    document.onpointermove = null;
  }
}
