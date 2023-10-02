'use client';

import { useCallback, useEffect, useState } from "react";
import styles from '@/app/ph-viz/styles.module.css'

function onReady(value: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  document.querySelector('body')!.appendChild(canvas);
  canvas.style.position = 'absolute';

  interface IParticle {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    redraw: () => void;
    reposition: () => void;
  }

  const particles: Array<IParticle> = [];
  const properties = {
    backgroundColor: 'rgba(36, 39, 46, 1)',
    particleColor: 'rgba(73, 156, 198, 1)',
    particleRadius: 1,
    particleCount: 10 ** (14 - value),
    particleMaxVelocity: 1,
  };

  class Particle implements IParticle {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;

    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
    }

    redraw() {
      context.beginPath();
      context.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = properties.particleColor;
      context.fill();
    }

    reposition() {
      this.x + this.velocityX > width && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX;
      this.y + this.velocityY > height && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY;

      this.x += this.velocityX;
      this.y += this.velocityY;
    }
  }

  function redrawParticles() {
    for (let i = 0; i < properties.particleCount; i++) {
      particles[i].redraw();
      particles[i].reposition();
    }
  }

  function redrawBackground() {
    context!.fillStyle = properties.backgroundColor;
    context!.fillRect(0, 0, width, height);
  }

  function loop() {
    redrawBackground();
    redrawParticles();

    requestAnimationFrame(loop);
  }

  function init() {
    for (let i = 0; i < properties.particleCount; i++) {
      particles.push(new Particle());
    }

    loop();
  }

  window.onresize = _ => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  init();
}

export default function PHViz() {
  const [value, setValue] = useState(11.5);

  useEffect(() => {
    onReady(value);
  }, [value]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;

    if (value > 9.5) {
      setValue(event.target.valueAsNumber);
    } else {
      setValue(9.5);
    }

  }, []);

  return (
    <div className={styles.container}>
      <input
        className={styles.slider__control}
        type="range"
        step={0.1}
        min={1}
        max={14}
        value={value}
        onChange={onChange}
      />
      <h1>{value}</h1>
    </div>
  );
}