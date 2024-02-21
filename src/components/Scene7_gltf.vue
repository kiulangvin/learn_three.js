<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// 压缩模型包
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { defineOptions, ref, reactive, toRefs, onMounted } from 'vue'


let Contanier3d = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let controls = null;

let mesh = null;


//初始化
const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 允许在场景中使用阴影贴图
    renderer.shadowMap.enabled = true;
    addControl();
}

const render = () => {

    renderer.render(scene, camera);
    controls && controls.update();
    requestAnimationFrame(render);
}

const addControl = () => {
    controls = new OrbitControls(camera, renderer.domElement)//创建控件对象
    controls.update();
}

const addGridMesh = () => {
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
}

const addAxesHelper = () => {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
}


const addMesh = () => {

}

const addGltf = () => {
    const gltfLoader = new GLTFLoader().setPath('./model/');

    const dracoLoader = new DRACOLoader(); // 压缩glb文件
    dracoLoader.setDecoderPath("./draco/"); //设置解压库文件路径
    dracoLoader.setDecoderConfig({ type: "js" }); //使用js方式解压
    dracoLoader.preload(); //初始化_initDecoder 解码器

    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load("city_test.glb", (gltf) => {

        let city = gltf.scene;
        console.log(city);
        city.position.set(0, 0, 0);
        scene.add(city);
    })
}

const addLight = () => {
    const light = new THREE.AmbientLight(0x404040); // 柔和的白光
    scene.add(light);
}

const addGui = () => {
    const gui = new GUI();
    gui.add(mesh.position, 'x', 0, 5).name('移动x轴').step(0.1);
    gui.addColor(mesh.material, 'color').name('更改物体颜色');
}



onMounted(() => {
    init();
    Contanier3d.value.appendChild(renderer.domElement);

    renderer.setClearColor(0x000000);

    scene.background = new THREE.Color(0x444444);
    scene.envirment = new THREE.Color(0x444444);

    render();

    // 添加网格地面
    addGridMesh();

    addAxesHelper();
    // 添加一个立方体
    addMesh();

    addGltf();

    // gui
    // addGui();

    addLight();

})


</script>

<template>
    <div class="Scene1-container" ref="Contanier3d"></div>
</template>

<style scoped >
.Scene1-container {
    width: 100%;
    height: 100%;
    display: flex;
}
</style>