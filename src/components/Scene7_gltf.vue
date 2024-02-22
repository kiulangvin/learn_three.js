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
let gltfGroup = null;

//初始化
const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
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
    const gridHelper = new THREE.GridHelper(16, 16);
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

const addGltf = async () => {
    const gltfLoader = new GLTFLoader().setPath('./model/');

    const dracoLoader = new DRACOLoader(); // 压缩glb文件
    dracoLoader.setDecoderPath("./draco/gltf/"); //设置解压库文件路径
    dracoLoader.setDecoderConfig({ type: "js" }); //使用js方式解压
    dracoLoader.preload(); //初始化_initDecoder 解码器

    gltfLoader.setDRACOLoader(dracoLoader);

    const gltf = await gltfLoader.loadAsync('city_test.glb');
    let city = gltf.scene;
    gltfGroup = city;
    console.log(gltf);
    city.castShadow = true;
    city.position.set(-20, 5, -10);
    city.scale.set(0.0001, 0.0001, 0.0001);
    scene.add(city);

    // gltfLoader.load("city_test.glb", (gltf) => { })
}

const addLight = () => {
    const light = new THREE.AmbientLight(0x404040); // 柔和的白光
    scene.add(light);

    // 添加一个平行光源
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    // 此属性设置为 true 灯光将投射阴影
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

const addGui = () => {
    const gui = new GUI();
    gui.add(mesh.position, 'x', 0, 5).name('移动x轴').step(0.1);
    gui.addColor(mesh.material, 'color').name('更改物体颜色');
}

window.addEventListener("onresize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('click', (event) => {
    event.preventDefault();
    let rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    //通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    rayCaster.setFromCamera(mouse, camera);


    let arr = [];
    gltfGroup.traverse(function (obj) {
        if (obj.isMesh) {//判断是否是网格模型
            arr.push(obj);
        }
    });
    //获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
    //+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
    let intersects = rayCaster.intersectObjects(arr, true);


    if (intersects.length > 0) {
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff * Math.random(),
            opacity: 0.8
        });
        // intersects[0].object.material = material;
        intersects.forEach((item) => {
            if (item.object.isMesh) {//判断是否是网格模型
                console.log('模型节点名字', item.object.name);
                item.object.material = material;
            }
        })
    }


});


onMounted(() => {
    init();
    Contanier3d.value.appendChild(renderer.domElement);

    renderer.setClearColor(0xffffff);

    // scene.background = new THREE.Color(0x444444);
    // scene.envirment = new THREE.Color(0x444444);

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