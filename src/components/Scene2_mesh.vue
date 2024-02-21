<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { defineOptions, ref, reactive, toRefs, onMounted } from 'vue'


let Contanier3d = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let controls = null;

//初始化
const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    // 添加一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
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