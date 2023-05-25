import React, { useEffect, useRef, useState } from "react";

export const ParticleField: React.FunctionComponent = ({ ...props }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [particleArr, setParticleArr] = useState<Particle[]>([]);

	/**
	 * initialises the canvas onload
	 */
	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			init(canvas);
		} else {
			console.warn("no canvas for rendering");
		}
	}, []);

	/**
	 * Triggers a re-init of the canvas when the window is resized
	 */
	useEffect(() => {
		function handleResize() {
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				canvas.style.width = "100%";
				canvas.style.height = "100%";
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
				init(canvas);
			} else {
				console.warn("no canvas for rendering");
			}
		}
		window.addEventListener("resize", handleResize);
	}, []);

	/**
	 * trigger the animate function everytime the particleArray is set
	 */
	useEffect(() => {
		animate();
	}, [particleArr]);

	/**
	 * Particle initialisation
	 * @param canvas HTML canvas element to render to
	 */
	function init(canvas: HTMLCanvasElement) {
		const particlesArray: Particle[] = [];
		let numberOfParticles = Math.floor((canvas.height * canvas.width) / 9000);
		// console.log('number of particles', numberOfParticles)
		for (let i = 0; i < numberOfParticles; i++) {
			let size = 1.25;
			let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
			let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
			let directionX = Math.random() * 3 - 1.5;
			let directionY = Math.random() * 3 - 1.5;
			let color = "#bcbcbc";

			particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
		}
		setParticleArr(particlesArray);
	}

	/**
	 * animation function, calls the update function of each Particle and the connect particle function
	 * @returns
	 */
	function animate() {
		requestAnimationFrame(animate);
		// console.log(particleArr)
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");
			if (!context) {
				return;
			}
			context.clearRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < particleArr?.length; i++) {
				particleArr[i].update(canvas, context);
			}
			connectparticles(canvas, context);
		}
	}

	/**
	 * Determines whether to draw a connecting line between every Particle
	 * @param canvas HTML canvas element to render to
	 * @param ctx 2d context of the HTML canvas element
	 */
	function connectparticles(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
		for (let a = 0; a < particleArr.length - 1; a++) {
			for (let b = a; b < particleArr.length; b++) {
				let distance =
					(particleArr[a].x - particleArr[b].x) * (particleArr[a].x - particleArr[b].x) +
					(particleArr[a].y - particleArr[b].y) * (particleArr[a].y - particleArr[b].y);
				if (distance < (canvas.width / 10) * (canvas.height / 10)) {
					ctx.strokeStyle = "rgba(255,204,204,1)"; //grey "rgba(240, 240, 240, 1)"
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(particleArr[a].x, particleArr[a].y);
					ctx.lineTo(particleArr[b].x, particleArr[b].y);
					ctx.stroke();
				}
			}
		}
	}

	return <canvas ref={canvasRef}></canvas>;
};

/**
 * Particle class, with canvas position and particle direction
 */
class Particle {
	x: number;
	y: number;
	directionX: number;
	directionY: number;
	size: number;
	color: string;

	constructor(
		x: number,
		y: number,
		directionX: number,
		directionY: number,
		size: number,
		color: string
	) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		// personally want pointsize to be uniform, but nice to have a variable
		this.size = size;
		this.color = color;
		// console.log({ x, y, directionX, directionY })
	}

	/**
	 * draws the Particle on the canvas
	 * @param ctx 2d context of the HTML canvas element
	 */
	draw(ctx: CanvasRenderingContext2D) {
		// beginPath() begins a path, or resets current path
		ctx.beginPath();
		// arc draws a circle, params(x,y,rad,startAng,endAng,counterclockwise)
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	/**
	 * Updates the position of the Particle
	 * @param canvas HTML canvas on which the Particle is drawn to
	 * @param context 2d context of the HTML canvas
	 */
	update(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		// first check if particle is still within the canvas; reverse direction if outside bounds
		if (this.x > canvas.width || this.x < 0) {
			this.directionX = -this.directionX;
		}
		if (this.y > canvas.height || this.y < 0) {
			this.directionY = -this.directionY;
		}
		this.x += this.directionX;
		this.y += this.directionY;

		this.draw(context);
	}
}
