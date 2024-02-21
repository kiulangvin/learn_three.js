<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { defineOptions, ref, reactive, toRefs, onMounted } from 'vue'

import colors from '../assets/texture/colors.png'
import disturb from '../assets/texture/disturb.jpg'
import uv_grid_opengl from '../assets/texture/uv_grid_opengl.jpg'

let Contanier3d = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let controls = null;

let mesh = null;
let pointLightSphere = null;

// 设置时钟
const clock = new THREE.Clock();

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
    let time = clock.getElapsedTime();

    if (pointLightSphere && pointLightSphere.position) {
        pointLightSphere.position.x = Math.sin(time * 0.5) * 5;
        pointLightSphere.position.z = Math.cos(time * 0.5) * 5;

        pointLightSphere.position.y = 5 + Math.cos(time * 5);
    }


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
    const sphere = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshLambertMaterial();
    mesh = new THREE.Mesh(sphere, material);
    // // 开启阴影
    mesh.castShadow = true;

    scene.add(mesh);

    const geometry = new THREE.PlaneGeometry(10, 10);
    let plan = new THREE.Mesh(geometry, material);
    plan.rotation.x = -Math.PI / 2;
    plan.position.set(0, -1, 0);
    // 接收阴影
    plan.receiveShadow = true;
    scene.add(plan);
}

const addLight = () => {
    const light = new THREE.AmbientLight(0x404040); // 柔和的白光
    scene.add(light);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    // pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true; // 开启阴影
    // scene.add(pointLight);

    // 灯光球显示。
    pointLightSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    pointLightSphere.position.set(5, 5, 5);
    pointLightSphere.add(pointLight);
    scene.add(pointLightSphere);

    // 灯光辅助
    // const sphereSize = 1;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);


    const gui = new GUI();
    gui.add(pointLight.position, 'x', -5, 5).name('移动x轴').step(0.1);
    gui.add(pointLight, 'decay', 0, 5).step(0.01);
    gui.add(pointLight, 'distance', 0, 1).step(0.01);
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