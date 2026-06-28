'use client';

import React, { useRef, useEffect } from 'react';

type ParticleType = 'smoke' | 'ember' | 'ring' | 'cloud';

interface Particle {
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  growth: number;
  decay: number;
  angle: number;
  spin: number;
  color: string;
}

export default function SmokeParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Particle Factory
    const createParticle = (x: number, y: number, type: ParticleType, isBurst = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = type === 'ember' 
        ? (isBurst ? Math.random() * 2.5 + 0.8 : Math.random() * 0.8 + 0.2) 
        : (isBurst ? Math.random() * 1.5 + 0.4 : Math.random() * 0.3 + 0.1);

      let radius = 0;
      let maxRadius = 0;
      let decay = 0;
      let growth = 0;
      let color = '';

      if (type === 'smoke') {
        radius = isBurst ? Math.random() * 8 + 4 : Math.random() * 20 + 10;
        growth = Math.random() * 0.35 + 0.1;
        decay = Math.random() * 0.0015 + 0.0008;
        color = 'rgba(235, 218, 175, ';
      } else if (type === 'ember') {
        radius = Math.random() * 1.8 + 0.8;
        growth = -0.005;
        decay = Math.random() * 0.006 + 0.002;
        color = Math.random() > 0.5 ? 'rgba(235, 130, 45, ' : 'rgba(218, 180, 50, ';
      } else if (type === 'ring') {
        radius = isBurst ? Math.random() * 6 + 3 : Math.random() * 12 + 8;
        growth = Math.random() * 0.6 + 0.35;
        decay = Math.random() * 0.003 + 0.0018;
        color = 'rgba(242, 238, 225, ';
      } else if (type === 'cloud') {
        radius = Math.random() * 100 + 150; // huge slow clouds
        growth = Math.random() * 0.05 + 0.02;
        decay = Math.random() * 0.0002 + 0.0001; // fades very slowly
        color = 'rgba(210, 205, 190, ';
      }

      return {
        type,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: type === 'ember' ? -speed - 0.4 : -speed * 0.4 - 0.15,
        radius,
        maxRadius: radius * 6,
        alpha: isBurst 
          ? Math.random() * 0.3 + 0.2 
          : type === 'cloud' 
            ? Math.random() * 0.04 + 0.02 // very faint background clouds
            : Math.random() * 0.12 + 0.04,
        growth,
        decay,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        color,
      };
    };

    // Mouse listeners for wind push and ember trails
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn a trail of embers if mouse moves fast enough
      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 15 && particlesRef.current.length < 150) {
        // Spawn 1-2 glowing sparks at the mouse location
        particlesRef.current.push(createParticle(mouse.x, mouse.y, 'ember', false));
        if (Math.random() > 0.6) {
          particlesRef.current.push(createParticle(mouse.x - dx * 0.5, mouse.y - dy * 0.5, 'smoke', false));
        }
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial background clouds
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push(
        createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          'cloud'
        )
      );
    }

    // Auto-generate background particles over time
    const interval = setInterval(() => {
      const particles = particlesRef.current;
      if (particles.length < 100) {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 60;

        const rand = Math.random();
        let type: ParticleType = 'smoke';
        if (rand > 0.65 && rand <= 0.90) {
          type = 'ember';
        } else if (rand > 0.90 && rand <= 0.97) {
          type = 'ring';
        } else if (rand > 0.97) {
          type = 'cloud';
        }

        particles.push(createParticle(x, y, type));
      }
    }, 220);

    // Click Burst Animation
    const handleClick = (e: MouseEvent) => {
      // 18 smoke puffs
      for (let i = 0; i < 18; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, 'smoke', true));
      }
      // 15 coal sparks
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, 'ember', true));
      }
      // 3 smoke rings
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, 'ring', true));
      }
    };
    window.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 1. Mouse Force Interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const force = (200 - dist) / 200;
            const angle = Math.atan2(dy, dx);
            const pushFactor = p.type === 'cloud' ? 0.05 : 1.2; // clouds move less
            
            p.vx += Math.cos(angle) * force * pushFactor * 0.6;
            p.vy += Math.sin(angle) * force * pushFactor * 0.6;
          }
        }

        // Apply physical states
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;
        p.alpha -= p.decay;
        p.angle += p.spin;

        // Friction dampening
        p.vx *= p.type === 'cloud' ? 0.99 : 0.96;
        p.vy *= p.type === 'cloud' ? 0.99 : 0.96;
        
        // Buoyancy rise
        p.vy -= p.type === 'ember' ? 0.012 : p.type === 'cloud' ? 0.0005 : 0.004;

        // Drift currents
        if (p.type === 'ember') {
          p.x += Math.sin(p.y * 0.008 + p.angle) * 0.2;
        } else if (p.type === 'cloud') {
          p.x += Math.sin(p.y * 0.002) * 0.05;
        }

        // Clean off-screen or dead particles
        if (p.alpha <= 0 || p.radius <= 0.1 || p.y < -300) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 'smoke') {
          ctx.rotate(p.angle);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
          grad.addColorStop(0, `${p.color}${p.alpha})`);
          grad.addColorStop(0.3, `rgba(235, 235, 240, ${p.alpha * 0.6})`);
          grad.addColorStop(0.7, `rgba(180, 180, 190, ${p.alpha * 0.15})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ember') {
          ctx.shadowBlur = Math.random() * 8 + 4;
          ctx.shadowColor = p.color.includes('130') ? '#eb822d' : '#dab432';
          
          ctx.fillStyle = `${p.color}${p.alpha * (Math.random() * 0.3 + 0.85)})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ring') {
          ctx.rotate(p.angle);
          ctx.lineWidth = Math.max(1, p.radius * 0.07);
          ctx.strokeStyle = `${p.color}${p.alpha * 0.75})`;
          
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(235, 218, 175, 0.2)';

          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'cloud') {
          // Large faint ambient background fog cloud
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
          grad.addColorStop(0, `${p.color}${p.alpha})`);
          grad.addColorStop(0.5, `${p.color}${p.alpha * 0.4})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen"
      style={{ opacity: 0.95 }}
    />
  );
}
