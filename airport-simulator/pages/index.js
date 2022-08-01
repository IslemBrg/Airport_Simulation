import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default function Home() {
  if (typeof window !== 'undefined') {
    var mouseMoved = false
    var lightON = false
    //scene init
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,5000)
    const renderer = new THREE.WebGLRenderer({
      canvas : document.querySelector('#Scene'),
    })
    const raycaster = new THREE.Raycaster()
    const mouseClick = new THREE.Vector2()

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.position.setZ(480)
    camera.position.setY(280)

    //Animating Scene
    function animate(){
      requestAnimationFrame(animate)

      renderer.render(scene,camera)

      orbitControl.update()
    }

    //Light Creation
    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)


    //Terrain Creation
    const terrain = new THREE.Mesh(
      new THREE.BoxGeometry(60, 10, 700),
      new THREE.MeshStandardMaterial( {
        map: new THREE.TextureLoader().load('ground.jpg')
      } )
    );
    terrain.userData.ground = true
    scene.add(terrain)

    //Runways Creation
    const runway = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1, 650),
      new THREE.MeshStandardMaterial( {map: new THREE.TextureLoader().load('runway.jpg')} )
    );
    runway.position.setY(5)

    runway.userData.clickable = true
    runway.userData.name = 'runway'
    scene.add(runway)

    //runway bulbs Creation
    const bulbs = new THREE.Group()
    var bulbCount = 98 //how many bulbs on the runway (must be pair number)
    var i = 0
    var x = -290
    function addBulb(){
      i++;
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.25,24,24),
        new THREE.MeshBasicMaterial({color:0x008000})
      )
      if (i<=bulbCount/2){
        bulb.position.setX(12)
        bulb.position.setZ(x)
        x+=12
      }
      if (i==bulbCount/2){x=-290}
      if (i>bulbCount/2){
        bulb.position.setX(-12)
        bulb.position.setZ(x)
        x+=12
      }
      bulbs.add(bulb)
    }
    Array(bulbCount).fill().forEach(addBulb)
    bulbs.position.setY(6)
    scene.add(bulbs)

    //runway Fake Light Creation
    const lights = new THREE.Group()
    var x = -290
    i=0
    function addBulbLight(){
      i++;
      const bulbLight = new THREE.Mesh(
        new THREE.CircleGeometry( 4, 32 ),
        new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load('fake light texture.png') , side: THREE.DoubleSide, transparent:true } )
      )
      bulbLight.rotateX(1.58)
      if (i<=bulbCount/2){
        bulbLight.position.setX(12)
        bulbLight.position.setZ(x)
        x+=12
      }
      if (i==bulbCount/2){x=-290}
      if (i>bulbCount/2){
        bulbLight.position.setX(-12)
        bulbLight.position.setZ(x)
        x+=12
      }
      lights.add(bulbLight)
    }
    Array(bulbCount).fill().forEach(addBulbLight)
    lights.position.setY(6)

    //Runway Light Activation
    function ActivateRunwayLights(){
      scene.add(lights)
    }
    //runway Light Deactivation
    function DeactivateRunwayLights(){
      scene.remove(lights)
    }

    ActivateRunwayLights()


    //implementing Orbit Controls
    const orbitControl = new OrbitControls(camera,renderer.domElement)

    animate()

    //Event Listeners
    
      window.addEventListener('mousemove', event => {
        if (mouseMoved == false){
        DeactivateRunwayLights()
        mouseMoved=true
      }
      })
          
    window.addEventListener('click',event =>{

      // calculate pointer position in normalized device coordinates
	    // (-1 to +1) for both components
	    mouseClick.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouseClick.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera(mouseClick,camera)

      // calculate objects intersecting the picking ray
	    const found = raycaster.intersectObjects( scene.children );

      if ((found.length > 0)&&(found[0].object.userData.clickable == true)){
        if (lightON){DeactivateRunwayLights();lightON = false}
        else{ActivateRunwayLights();lightON = true}
      }

    })

  }
  return (
    <>
      <canvas id='Scene' className={styles.canvas}>
      </canvas>
    </>
  )
}
