let highestZ = 1;

class Paper {
    holdingPaper = false;
    touchStartX = 0;
    touchStartY = 0;
    touchMoveX = 0;
    touchMoveY = 0;
    prevTouchX = 0;
    prevTouchY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;
    initialRotation = 0;
    initialAngle = 0;

    init(paper) {
        // Touch start
        paper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.holdingPaper = true;
                paper.style.zIndex = highestZ++;
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
                this.prevTouchX = this.touchStartX;
                this.prevTouchY = this.touchStartY;
            } else if (e.touches.length === 2) {
                this.rotating = true;
                this.initialRotation = this.rotation;
                this.initialAngle = this.getAngle(e.touches[0], e.touches[1]);
            }
        }, { passive: false });

        // Touch move
        paper.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.holdingPaper && e.touches.length === 1 && !this.rotating) {
                this.touchMoveX = e.touches[0].clientX;
                this.touchMoveY = e.touches[0].clientY;
                this.velX = this.touchMoveX - this.prevTouchX;
                this.velY = this.touchMoveY - this.prevTouchY;
                this.currentPaperX += this.velX;
                this.currentPaperY += this.velY;
                this.prevTouchX = this.touchMoveX;
                this.prevTouchY = this.touchMoveY;
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            } else if (this.rotating && e.touches.length === 2) {
                const angle = this.getAngle(e.touches[0], e.touches[1]);
                this.rotation = this.initialRotation + (angle - this.initialAngle);
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        }, { passive: false });

        // Touch end
        paper.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.holdingPaper = false;
                this.rotating = false;
            }
        });

        // Prevent double-tap to zoom
        paper.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) e.preventDefault();
        }, { passive: false });
    }

    getAngle(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
