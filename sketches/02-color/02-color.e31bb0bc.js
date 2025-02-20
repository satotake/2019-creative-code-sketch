// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  var width = 960;
  var height = 540; // レンダラーを作成

  var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height); // レンダラー側で影を有効に

  renderer.shadowMap.enabled = true; // シーンを作成

  var scene = new THREE.Scene(); // カメラを作成

  var camera = new THREE.PerspectiveCamera(30, width / height); // 光源を作成 （一つ目）

  {
    var spotLight_red = new THREE.SpotLight(0xff0000, 4, 2000, Math.PI / 5, 0.2, 1.5);
    spotLight_red.position.set(700, 300, 500);
    spotLight_red.castShadow = true; // 影を落とす設定

    spotLight_red.shadow.mapSize.width = 2048;
    spotLight_red.shadow.mapSize.height = 2048;
    scene.add(spotLight_red);
  } // 光源を作成 （二つ目）

  {
    var spotLight_green = new THREE.SpotLight(0x00ff00, 4, 2000, Math.PI / 5, 0.2, 1.5);
    spotLight_green.position.set(-700, 300, 500);
    spotLight_green.castShadow = true; // 影を落とす設定

    spotLight_green.shadow.mapSize.width = 2048;
    spotLight_green.shadow.mapSize.height = 2048;
    scene.add(spotLight_green);
  } // 光源を作成 （三つ目）

  {
    var spotLight_blue = new THREE.SpotLight(0x0000ff, 4, 2000, Math.PI / 5, 0.2, 1.5);
    spotLight_blue.position.set(0, 300, -700);
    spotLight_blue.castShadow = true; // 影を落とす設定

    spotLight_blue.shadow.mapSize.width = 2048;
    spotLight_blue.shadow.mapSize.height = 2048;
    scene.add(spotLight_blue);
  } // 地面を作成

  {
    //new THREE.Mesh( geometry, material );だから第一引数にgeometry　第二引数にmaterialを入れておく
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide
    })); //地面の角度を平面にしている

    floor.rotation.x = -Math.PI / 2; // 影の設定

    floor.receiveShadow = true;
    scene.add(floor);
  } // ドーナツを作成

  var geometry = new THREE.BoxGeometry(40, 40, 40); // マテリアルを作成

  var material = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF
  }); // メッシュを作成

  var mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true; // 3D空間にメッシュを追加

  scene.add(mesh);
  tick(); // 毎フレーム時に実行されるループイベントです

  function tick() {
    // 角度に応じてカメラの位置を設定
    //x 上下に揺れる
    camera.position.x = 500 * Math.sin(Date.now() / 2000); //y 増えるほど上に

    camera.position.y = 1200; //z 横向きに揺れる

    camera.position.z = 500 * Math.cos(Date.now() / 2000); // 原点方向を見つめる

    camera.lookAt(new THREE.Vector3(0, 0, 0)); // レンダリング

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
},{}]},{},["index.js"], null)
//# sourceMappingURL=/02-color.e31bb0bc.js.map