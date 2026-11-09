import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import {
  AnimationMixer,
  Box3,
  DirectionalLight,
  HemisphereLight,
  LoopOnce,
  MathUtils,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { AnimationAction, Object3D } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { catModelLoading } from './catModel.ts';

type CatPlayback = {
  mixer: AnimationMixer | null;
  spinAction: AnimationAction | null;
  playedSpinCount: number;
  lastFrameTime: DOMHighResTimeStamp | null;
};

const FIELD_OF_VIEW_DEGREES = 30;
const PLACEHOLDER_ASPECT_RATIO = 1;
const CAMERA_NEAR_DISTANCE = 0.1;
const CAMERA_FAR_DISTANCE = 5000;
const SPIN_REPETITIONS = 1;
const MILLISECONDS_PER_SECOND = 1000;
const TRANSPARENT_ALPHA = 0;
const FRAMING_MARGIN = 1.35;
const CAMERA_LIFT_RATIO = 0.08;
const MAX_PIXEL_RATIO = 1.5;
const SKY_LIGHT_COLOR = 0xffffff;
const GROUND_LIGHT_COLOR = 0xdfe3ea;
const SKY_LIGHT_INTENSITY = 2.2;
const KEY_LIGHT_COLOR = 0xffffff;
const KEY_LIGHT_INTENSITY = 1.8;
const KEY_LIGHT_POSITION = new Vector3(3, 5, 4);

export function useCatStage(stageRef: RefObject<HTMLDivElement | null>, spinCount: number) {
  const requestedSpinCountRef = useRef(spinCount);

  useEffect(
    function rememberRequestedSpin() {
      requestedSpinCountRef.current = spinCount;
    },
    [spinCount],
  );

  useEffect(
    function showCat() {
      const stage = stageRef.current!;
      const renderer = new WebGLRenderer({ antialias: true, alpha: true });
      const scene = new Scene();
      const camera = new PerspectiveCamera(
        FIELD_OF_VIEW_DEGREES,
        PLACEHOLDER_ASPECT_RATIO,
        CAMERA_NEAR_DISTANCE,
        CAMERA_FAR_DISTANCE,
      );
      const resizeObserver = new ResizeObserver(fitToStage);
      const loading = new AbortController();
      const playback: CatPlayback = { mixer: null, spinAction: null, playedSpinCount: 0, lastFrameTime: null };
      const shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function placeCat(gltf: GLTF) {
        if (loading.signal.aborted) {
          return;
        }

        const [spinClip] = gltf.animations;

        if (spinClip === undefined) {
          throw new Error('고양이 모델에 회전 애니메이션이 없습니다.');
        }

        const cat = gltf.scene.clone(true);
        frameModel(cat, camera);
        scene.add(cat);
        playback.mixer = new AnimationMixer(cat);
        playback.spinAction = playback.mixer.clipAction(spinClip).setLoop(LoopOnce, SPIN_REPETITIONS);
        renderer.render(scene, camera);
      }

      function startRequestedSpin(spinAction: AnimationAction) {
        const requestedSpinCount = requestedSpinCountRef.current;

        if (playback.playedSpinCount === requestedSpinCount) {
          return;
        }

        playback.playedSpinCount = requestedSpinCount;
        spinAction.reset().play();
      }

      function drawFrame(time: DOMHighResTimeStamp) {
        const elapsedSeconds = playback.lastFrameTime === null ? 0 : (time - playback.lastFrameTime) / MILLISECONDS_PER_SECOND;
        playback.lastFrameTime = time;

        if (shouldAnimate && playback.mixer !== null && playback.spinAction !== null) {
          startRequestedSpin(playback.spinAction);
          playback.mixer.update(elapsedSeconds);
        }

        renderer.render(scene, camera);
      }

      function fitToStage() {
        renderer.setSize(stage.clientWidth, stage.clientHeight, false);
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
      }

      function reportLoadFailure(error: unknown) {
        console.error('고양이 3D 모델을 불러오지 못했습니다.', error);
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
      renderer.setClearColor(0x000000, TRANSPARENT_ALPHA);
      stage.append(renderer.domElement);
      addLights(scene);
      fitToStage();
      resizeObserver.observe(stage);
      catModelLoading.then(placeCat).catch(reportLoadFailure);
      renderer.setAnimationLoop(drawFrame);

      return function removeCat() {
        loading.abort();
        renderer.setAnimationLoop(null);
        resizeObserver.disconnect();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    },
    [stageRef],
  );
}

function addLights(scene: Scene) {
  const keyLight = new DirectionalLight(KEY_LIGHT_COLOR, KEY_LIGHT_INTENSITY);
  keyLight.position.copy(KEY_LIGHT_POSITION);
  scene.add(new HemisphereLight(SKY_LIGHT_COLOR, GROUND_LIGHT_COLOR, SKY_LIGHT_INTENSITY), keyLight);
}

function frameModel(model: Object3D, camera: PerspectiveCamera) {
  const bounds = new Box3().setFromObject(model, true);
  const size = bounds.getSize(new Vector3());
  const visibleHeight = size.y * FRAMING_MARGIN;
  const distance = visibleHeight / (2 * Math.tan(MathUtils.degToRad(FIELD_OF_VIEW_DEGREES / 2)));

  model.position.sub(bounds.getCenter(new Vector3()));
  camera.position.set(0, size.y * CAMERA_LIFT_RATIO, distance + size.z / 2);
  camera.lookAt(0, 0, 0);
}
