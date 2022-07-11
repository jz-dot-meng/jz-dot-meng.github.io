import { useEffect, useRef, useState } from "react"


export const CliffordAttractor: React.FunctionComponent = ({ ...props }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const ITERATIONS = 18000;
    const constantChangeRate = [Math.random() / (Math.random() * 200), Math.random() / (Math.random() * 200), Math.random() / (Math.random() * 200), Math.random() / (Math.random() * 200)]
    const colourChangeRate = [(Math.random() - 0.5) / 30, (Math.random() - 0.5) / 30, (Math.random() - 0.5) / 30]

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            init(canvas);
        } else {
            console.warn('no canvas for rendering')
        }
    })

    useEffect(() => {
        animate()
        window.addEventListener('resize', () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                init(canvas)
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return;
                }
                calculate(canvas, ctx);
            }
        })
    }, [])

    function init(canvas: HTMLCanvasElement) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    const t = useRef<number>(0)

    const constantInit = [2, 1.6706, -0.5, -1.1254]

    const a = useRef<number>(constantInit[0]);
    const b = useRef<number>(constantInit[1]);
    const c = useRef<number>(constantInit[2]);
    const d = useRef<number>(constantInit[3]);

    const colourInit = [250, 20, 90];

    const red = useRef<number>(colourInit[0]);
    const green = useRef<number>(colourInit[1]);
    const blue = useRef<number>(colourInit[2]);

    function calculate(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        let currentX = canvas.width / 2;
        let currentY = canvas.height / 2;
        red.current = (calcColour(0))
        green.current = (calcColour(1))
        blue.current = (calcColour(2))
        for (let i = 0; i < ITERATIONS; i++) {
            let oldX = currentX;
            let oldY = currentY;
            currentX = Math.sin(a.current * oldY) + c.current * Math.cos(a.current * oldX);
            currentY = (Math.sin(b.current * oldX) + d.current * Math.cos(b.current * oldY));
            draw(canvas.width * (currentX + 3) / 6, canvas.height * (currentY + 3) / 6, ctx);
        }
    }

    /**
     * return colour number roughly between 0 and 255
     * @param index 
     * @returns 
     */
    function calcColour(index: number) {
        return 128 + (128 * Math.sin(((colourChangeRate[index] * t.current) + ((colourInit[index] * 2 * Math.PI) / 255))))
    }

    /**
     * return constant number roughly between -4 and 4
     * @param index 
     */
    function calcConstant(index: number) {
        return 1.5 + (1.5 * Math.sin(((constantChangeRate[index] * t.current) + ((constantInit[index] * 2 * Math.PI) / 6))))
    }

    function draw(x: number, y: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgba(' + Math.ceil(red.current) + ',' + Math.ceil(green.current) + ',' + Math.ceil(blue.current) + ',1)'//`rgba(${colourArr[1]},${colourArr[2]},${colourArr[3]},0.7)`
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        requestAnimationFrame(animate);
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const context = canvas.getContext('2d');
            if (!context) {
                return
            }
            a.current = (calcConstant(0));
            b.current = (calcConstant(1));
            c.current = (calcConstant(2));
            d.current = (calcConstant(3));
            t.current = t.current + 1
            calculate(canvas, context)
        }
    }

    const reinit = () => {
        t.current = 0;
        constantChangeRate[0] = Math.random() / (Math.random() * 200);
        constantChangeRate[1] = Math.random() / (Math.random() * 200);
        constantChangeRate[2] = Math.random() / (Math.random() * 200);
        constantChangeRate[3] = Math.random() / (Math.random() * 200);
    }


    return (
        <canvas ref={canvasRef} onClick={reinit}></canvas>
    )
}