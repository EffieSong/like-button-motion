//customize mouse cursor
// (function () {
//   let cursor = document.querySelector('.cursor');
//   let width = 50;
//   let height = 50;
//   cursor.style.width = width + 'px';
//   cursor.style.height = height + 'px';

//   function moveCursor(event) {
//     cursor.style.left = event.clientX - width / 2 + 'px';
//     cursor.style.top = event.clientY - height / 2 + 'px';
//   }

//   function mouseDown(event) {
//     cursor.style.backgroundColor = "rgba(80, 80, 80, 0.28)";
//     cursor.style.transform = "scale(0.86,0.86)";
//   }

//   function mouseUp() {
//     cursor.style.backgroundColor = "rgba(80, 80, 80, 0.15)";
//     cursor.style.transform = "scale(1,1)";
//   }
//   window.addEventListener('mousemove', moveCursor);
//   window.addEventListener('mousedown', mouseDown);
//   window.addEventListener('mouseup', mouseUp);
// })();



let mobileScreen=document.querySelector(".device");
let mobileScreenContainer=document.querySelector(".device-container");

console.log(mobileScreen);
mobileScreen.onmouseover = function(){
 // changeCursor();
};
// mobileScreen.onmouseleave = function(){
//   deleteCursor();
//   console.log(mobileScreen);
// };

// function changeCursor(){
//   let cursor = document.querySelector('.cursor');
//   let width = 50;
//   let height = 50;
//   cursor.style.width = width + 'px';
//   cursor.style.height = height + 'px';
//   function moveCursor(event) {
//     cursor.style.left = event.clientX - width / 2 + 'px';
//     cursor.style.top = event.clientY - height / 2 + 'px';
//   }

//   function mouseDown(event) {
//     cursor.style.backgroundColor = "rgba(80, 80, 80, 0.28)";
//     cursor.style.transform = "scale(0.86,0.86)";
//   }
//   function mouseUp() {
//     cursor.style.backgroundColor = "rgba(80, 80, 80, 0.15)";
//     cursor.style.transform = "scale(1,1)";
//   }
//   window.addEventListener('mousemove', moveCursor);
//   window.addEventListener('mousedown', mouseDown);
//   window.addEventListener('mouseup', mouseUp);
// }

// function deleteCursor(){
//   let cursor = document.querySelector('.cursor');
//   let width = 0;
//   let height = 0;
//   cursor.style.width = width + 'px';
//   cursor.style.height = height + 'px';
// }





function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  //without alpha
  if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  } else if (h.length == 6) {
    r = "0x" + h[0] + h[1];
    g = "0x" + h[2] + h[3];
    b = "0x" + h[4] + h[5];
  }
  return [Number(r), Number(g), Number(b)]
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getRandomTexture(...arg) {
	let textures = [];
	for (let i = 0; i < arg.length; i++) {
		let txtcanvas = document.createElement('canvas');
		var txtctx = txtcanvas.getContext('2d');
		txtcanvas.width = 100;
		txtcanvas.height = 100;
		txtctx.font = 'Bold 100px Arial';
		txtctx.fillStyle = 'white';
		txtctx.textAlign = "center";
		txtctx.fillText(arg[i], 50, 85);
		let texture = new THREE.Texture(txtcanvas);
		texture.needsUpdate = true;
		textures.push(texture);
	}
	return textures[Math.floor(Math.random() * (textures.length - 1))]
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
};

function randomInRanges(...arg) {
  let arr = [];
  for (i = 0; i <= arg.length - 2; i += 2) {
    arr.push(randomInRange(arg[i], arg[i + 1]))
  }
  return arr[Math.floor(Math.random() * arg.length / 2)]
};