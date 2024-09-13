const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const mouse = { x: canvas.width / 2, y: canvas.height / 2};

function createParticle(x, y) {
    const particle = {
    x,
    y,
    radius: Math.random() * 3 + 1,
    color: 'white',
    velocity: {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    },
    opacity: Math.random() * 0.5 + 0.1,
    life: 100,
  };
  particles.push(particle);
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();
  });
}

function updateParticles() {
  particles.forEach((particle, index) => {
    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;

    if (
      particle.x - particle.radius > canvas.width ||
      particle.x + particle.radius < 0 ||
      particle.y - particle.radius > canvas.height ||
      particle.y + particle.radius < 0
    ) {
      particles.splice(index, 1);
    }

    particle.life--;

    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  });
}

function drawConnections() {
  particles.forEach((particle1) => {
    particles.forEach((particle2) => {
      if (particle1 !== particle2) {
        const distance = Math.sqrt(
          (particle1.x - particle2.x) ** 2 + (particle1.y - particle2.y) ** 2
        );

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
  });
}

function updateMousePosition(e) {
    if (e.clientX >= 0 && e.clientX <= canvas.width && e.clientY >= 0 && e.clientY <= canvas.height) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  }

document.addEventListener('mousemove', updateMousePosition);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  createParticle(Math.random() * canvas.width, Math.random() * canvas.height);
  drawParticles();
  updateParticles();
  drawConnections();

  //createParticle(mouse.x, mouse.y);

  requestAnimationFrame(animate);
}

animate();