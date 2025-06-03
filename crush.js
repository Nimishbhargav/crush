let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updateMouse = (x, y) => {
      this.mouseX = x;
      this.mouseY = y;
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    };

    const onMove = (x, y) => {
      updateMouse(x, y);

      if (this.rotating) {
        const dirX = x - this.mouseTouchX;
        const dirY = y - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = 180 * angle / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const handleStart = (x, y, isRightClick) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
      if (isRightClick) this.rotating = true;
    };

    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (touch) onMove(touch.clientX, touch.clientY);
    }, { passive: false });

    paper.addEventListener('mousedown', (e) => {
      handleStart(e.clientX, e.clientY, e.button === 2);
    });

    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      if (touch) handleStart(touch.clientX, touch.clientY, false);
    }, { passive: false });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
