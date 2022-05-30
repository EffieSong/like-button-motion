const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1200 / 1600, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  alpha: true
}); //<canvas> element
renderer.setSize(1200, 1600);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.className = "canvas-3d";
renderer.domElement.style.width = "600px";
renderer.domElement.style.height = "800px";
renderer.domElement.style.left = "-110px";
renderer.domElement.style.top = "-14px";
let canvasContainer = document.querySelector(".canvas-container");
canvasContainer.append(renderer.domElement);
camera.position.z = 6;
camera.position.x = 0;
camera.position.y = 0;



let unit = 0.15;


const GROUP = new THREE.Group();

let group_sphere = new THREE.Group();
let EMOJIGROUP = [];

function test() {
  for (let i = 0; i < 2; i++) {
    let emojiMaterial = new THREE.SpriteMaterial({
      map: getRandomTexture('👍'), //'🥰', '🌟', '😍', '🥳', '👏', '👍', '🥳'),
    });

    let emoji = new THREE.Sprite(emojiMaterial);
    emoji.targetPosition = new THREE.Vector3(randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1));
    emoji.targetPosition.multiplyScalar(unit*5);

    let r = unit * 3.6;
    emoji.targetPosition.clampLength(r, r);
    emoji.position.set(unit*5, -unit*4, 0);
    emoji.scale.set(unit, unit, unit);
    emoji.arrive = false;
    EMOJIGROUP.push(emoji);
    GROUP.add(emoji);
  }
};

let arrive = false;

function test_animate_rotate() {
  let anchorM = new THREE.SpriteMaterial({
   color:"red"
  });

  let anchor = new THREE.Sprite(anchorM);
  anchor.scale.set(unit,unit,unit);
  //GROUP.add(anchor);
  renderer.render(scene, camera);

    EMOJIGROUP.forEach((item)=>{
      let difference = item.targetPosition.clone().sub(item.position);
      if(difference.length()>0.05 && !item.arrive){
        item.position.add(item.targetPosition.clone().sub(item.position).clampLength(0.03,0.03))
      }else{
        item.arrive = true;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0.08);
        item.position.applyQuaternion( quaternion );
      }

    });
  requestAnimationFrame(test_animate_rotate);

}

function init() {
 // test();
  scene.add(GROUP);
  renderer.render(scene, camera);
}

init();
window.requestAnimationFrame(test_animate_rotate);
//-------------------------------------------------------------------------------------


window.onclick = function () {
  for (let i = 0; i < 1; i++) {
    let emojiMaterial = new THREE.SpriteMaterial({
      map: getRandomTexture('👍'), //'🥰', '🌟', '😍', '🥳', '👏', '👍', '🥳'),
    });

    let emoji = new THREE.Sprite(emojiMaterial);
    emoji.targetPosition = new THREE.Vector3(randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1));
   emoji.targetPosition.multiplyScalar(unit*5);

    let r = unit * 3.6;
    emoji.targetPosition.clampLength(r, r);
    emoji.position.set(unit*5, -unit*4, 0);
    emoji.scale.set(unit, unit, unit);
    emoji.arrive = false;
    EMOJIGROUP.push(emoji);
    console.log(emoji.targetPosition);
    GROUP.add(emoji);
  }
};





