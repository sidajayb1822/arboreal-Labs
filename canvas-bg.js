// Arboreal Labs Dual-Canvas Background Engine
// Isolated execution environment to prevent collision with primary GSAP mechanics

document.addEventListener("DOMContentLoaded", () => {
    // Shared Mouse State for both canvases
    const mousePos = { x: -1000, y: -1000, prevX: -1000, prevY: -1000, active: false };

    const handleMouseMove = (e) => {
        if (window.innerWidth <= 768) return; // Disable synthetic mouse tracking on mobile
        mousePos.prevX = mousePos.x;
        mousePos.prevY = mousePos.y;
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        mousePos.active = true;
    };

    const handleMouseLeave = () => {
        mousePos.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Global Font Tracking Framework
    const fontTracker = {
        getAuroraDensity: () => 0,
        getThermoDensity: () => 0
    };

    // ==========================================
    // 1. WEBGL SHADER BACKGROUND (Aurora)
    // ==========================================
    const initWebGLShader = () => {
        const canvas = document.getElementById('shader-canvas');
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        const config = { flowSpeed: 0.3, colorIntensity: 0.85, noiseLayers: 4.0, mouseInfluence: 0.2 };

        const vertexShaderSource = `
            attribute vec2 aPosition;
            void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;
            uniform vec2 iMouse;
            uniform float uFlowSpeed;
            uniform float uColorIntensity;
            uniform float uNoiseLayers;
            uniform float uMouseInfluence;

            #define MARCH_STEPS 32

            vec3 spaceCharcoal = vec3(0.066, 0.074, 0.102); // #11131A
            vec3 marsRed = vec3(0.65, 0.05, 0.05); // Deep Dark Red
            vec3 darkRed = vec3(0.15, 0.0, 0.0);   // Void Red

            float hash(vec2 p) {
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p+45.32);
                return fract(p.x*p.y);
            }

            float fbm(vec3 p) {
                float f = 0.0;
                float amp = 0.5;
                for (int i = 0; i < 8; i++) {
                    if (float(i) >= uNoiseLayers) break;
                    f += amp * hash(p.xy);
                    p *= 2.0;
                    amp *= 0.5;
                }
                return f;
            }

            float map(vec3 p) {
                vec3 q = p;
                q.z += iTime * uFlowSpeed;
                vec2 mouseNorm = (iMouse.xy / iResolution.xy - 0.5) * 2.0;
                q.xy += mouseNorm * uMouseInfluence;
                float f = fbm(q * 1.5);
                f *= sin(p.y * 1.5 + iTime * 0.5) * 0.5 + 0.5;
                return clamp(f, 0.0, 1.0);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
                vec3 ro = vec3(0, -1, 0); 
                vec3 rd = normalize(vec3(uv, 1.0)); 
                vec3 col = vec3(0);
                float t = 0.0;
                
                for (int i=0; i<MARCH_STEPS; i++) {
                    vec3 p = ro + rd * t;
                    float density = map(p);
                    if (density > 0.0) {
                        vec3 auroraColor = mix(darkRed, marsRed, sin(p.x * 2.0 + iTime) * 0.5 + 0.5);
                        col += auroraColor * density * 0.12 * uColorIntensity;
                    }
                    t += 0.12;
                }
                gl_FragColor = vec4(spaceCharcoal + col, 1.0);
            }
        `;

        const compileShader = (source, type) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const locations = {
            iResolution: gl.getUniformLocation(program, "iResolution"),
            iTime: gl.getUniformLocation(program, "iTime"),
            iMouse: gl.getUniformLocation(program, "iMouse"),
            uFlowSpeed: gl.getUniformLocation(program, "uFlowSpeed"),
            uColorIntensity: gl.getUniformLocation(program, "uColorIntensity"),
            uNoiseLayers: gl.getUniformLocation(program, "uNoiseLayers"),
            uMouseInfluence: gl.getUniformLocation(program, "uMouseInfluence")
        };

        const startTime = performance.now();

        // Expose Aurora Density via JS Raymarcher subset
        fontTracker.getAuroraDensity = (screenX, screenY) => {
            const mx = mousePos.x > 0 ? mousePos.x / canvas.width : 0.5;
            const my = mousePos.y > 0 ? mousePos.y / canvas.height : 0.5;
            const iTime = (performance.now() - startTime) / 1000.0;
            
            let uvx = (screenX - 0.5 * canvas.width) / canvas.height;
            let fragY = canvas.height - screenY; 
            let uvy = (fragY - 0.5 * canvas.height) / canvas.height;
            
            let rdLength = Math.sqrt(uvx*uvx + uvy*uvy + 1.0);
            let rdx = uvx / rdLength, rdy = uvy / rdLength, rdz = 1.0 / rdLength;
            let rox = 0, roy = -1, roz = 0;
            
            let t = 0.0, totalDensity = 0.0;
            let mouseNormX = (mx - 0.5) * 2.0; let mouseNormY = ((1.0 - my) - 0.5) * 2.0;

            const fract = (v) => v - Math.floor(v);
            const hash = (x, y) => {
                let px = fract(x * 123.34), py = fract(y * 456.21);
                let d = px*(px+45.32) + py*(py+45.32);
                px += d; py += d;
                return fract(px*py);
            };
            const fbm = (x, y) => {
                let f = 0.0, amp = 0.5;
                let px = x, py = y;
                for (let i = 0; i < 4; i++) { // Optimized checks
                    f += amp * hash(px, py);
                    px *= 2.0; py *= 2.0; amp *= 0.5;
                }
                return f;
            };

            for(let i=0; i<16; i++) { // Accelerated marching 
                let px = rox + rdx * t, py = roy + rdy * t, pz = roz + rdz * t;
                let qz = pz + iTime * config.flowSpeed;
                let qx = px + mouseNormX * config.mouseInfluence;
                let qy = py + mouseNormY * config.mouseInfluence;
                let f = fbm(qx * 1.5, qy * 1.5);
                f *= Math.sin(py * 1.5 + iTime * 0.5) * 0.5 + 0.5;
                let density = Math.max(0.0, Math.min(1.0, f));
                
                if (density > 0.0) totalDensity += density * 0.12 * config.colorIntensity;
                t += 0.24; // Compensation for half step count
            }
            return totalDensity;
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.uniform2f(locations.iResolution, gl.canvas.width, gl.canvas.height);
        };
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const renderLoop = () => {
            if (gl.isContextLost()) return;
            const currentTime = performance.now();
            gl.uniform1f(locations.iTime, (currentTime - startTime) / 1000.0);
            
            // Mouse Norm for Shader
            const mx = mousePos.x > 0 ? mousePos.x / canvas.width : 0.5;
            const my = mousePos.y > 0 ? mousePos.y / canvas.height : 0.5;
            gl.uniform2f(locations.iMouse, mx * canvas.width, (1.0 - my) * canvas.height);
            
            gl.uniform1f(locations.uFlowSpeed, config.flowSpeed);
            gl.uniform1f(locations.uColorIntensity, config.colorIntensity);
            gl.uniform1f(locations.uNoiseLayers, config.noiseLayers);
            gl.uniform1f(locations.uMouseInfluence, config.mouseInfluence);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(renderLoop);
        };
        renderLoop();
    };

    // ==========================================
    // 2. THERMODYNAMIC GRID (Interactive Overlay)
    // ==========================================
    const initThermoGrid = () => {
        const canvas = document.getElementById('thermo-canvas');
        if (!canvas) return;
        
        // Allow transparency so the shader shows underneath
        const ctx = canvas.getContext("2d", { alpha: true }); 
        if (!ctx) return;

        const resolution = 14; // Tuned for crisp detail + performance
        const coolingFactor = 0.94; // Fast heat trails
        
        let grid;
        let cols = 0, rows = 0, width = 0, height = 0;

        fontTracker.getThermoDensity = (screenX, screenY) => {
            if (!grid) return 0;
            let c = Math.floor(screenX / resolution);
            let r = Math.floor(screenY / resolution);
            if (c >= 0 && c < cols && r >= 0 && r < rows) {
                return grid[c + r * cols];
            }
            return 0;
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            cols = Math.ceil(width / resolution);
            rows = Math.ceil(height / resolution);
            grid = new Float32Array(cols * rows).fill(0);
        };

        window.addEventListener("resize", resize);
        resize();

        const update = () => {
            // Inject Heat
            if (mousePos.active && mousePos.prevX > 0) {
                const dx = mousePos.x - mousePos.prevX;
                const dy = mousePos.y - mousePos.prevY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const steps = Math.ceil(dist / (resolution / 2));
                
                for (let s = 0; s <= steps; s++) {
                    const t = steps > 0 ? s / steps : 0;
                    const x = mousePos.prevX + dx * t;
                    const y = mousePos.prevY + dy * t;
                    
                    const col = Math.floor(x / resolution);
                    const row = Math.floor(y / resolution);
                    const radius = 2; // Brush Size
                    
                    for (let i = -radius; i <= radius; i++) {
                        for (let j = -radius; j <= radius; j++) {
                            const c = col + i;
                            const r = row + j;
                            if (c >= 0 && c < cols && r >= 0 && r < rows) {
                                const idx = c + r * cols;
                                const d = Math.sqrt(i*i + j*j);
                                if (d <= radius) {
                                    grid[idx] = Math.min(1.0, grid[idx] + 0.4 * (1 - d/radius));
                                }
                            }
                        }
                    }
                }
            }

            // Clear frame (Transparent to reveal WebGL)
            ctx.clearRect(0, 0, width, height);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = c + r * cols;
                    let temp = grid[idx];

                    grid[idx] *= coolingFactor; // Apply cooling

                    if (temp > 0.02) {
                        // Hot spots: Organic Mars Red blooms
                        const x = c * resolution + resolution / 2;
                        const y = r * resolution + resolution / 2;
                        
                        const size = resolution * (0.4 + temp * 0.8);
                        
                        ctx.fillStyle = `rgba(255, 59, 59, ${Math.min(temp * 1.5, 1)})`; // Mars Red
                        
                        ctx.beginPath();
                        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Cold spots: Faint architectural Lunar White grid
                        if (c % 2 === 0 && r % 2 === 0) {
                            const x = c * resolution + resolution / 2;
                            const y = r * resolution + resolution / 2;
                            ctx.fillStyle = "rgba(240, 242, 245, 0.05)"; // 5% Opacity
                            ctx.beginPath();
                            ctx.arc(x, y, 1, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }
            requestAnimationFrame(update);
        };
        
        update();
    };

    // Initialize both systems
    initWebGLShader();
    initThermoGrid();

    // Constant evaluation loop tracking Red Fonts vs WebGL Rendering Output
    const trackRedFonts = () => {
        const redElements = document.querySelectorAll('.span-red, .logo-icon, [style*="color: var(--mars-red)"], .tagline, .glass-card i, label');
        redElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            let cx = rect.left + rect.width / 2;
            let cy = rect.top + rect.height / 2;
            
            let aurora = fontTracker.getAuroraDensity(cx, cy);
            let thermo = fontTracker.getThermoDensity(cx, cy);
            
            // Adjust contrast dynamically depending on mapped rendering collisions
            if (aurora + (thermo * 1.5) > 0.35) {
                el.classList.add('dynamic-white');
            } else {
                el.classList.remove('dynamic-white');
            }
        });
        requestAnimationFrame(trackRedFonts);
    };
    trackRedFonts();
});
