import React, { useState, useRef, useEffect } from 'react';
import './ImageCropper.css';

function ImageCropper({ imageUrl, onCrop, onCancel }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  
  useEffect(() => {
    updatePreview();
  }, [scale, rotation, position, imageUrl]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  const updatePreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
      ctx.clip();
      
      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      
      // Calculate image dimensions
      const imgAspect = img.width / img.height;
      const containerSize = 300;
      
      let drawWidth, drawHeight;
      if (imgAspect > 1) {
        drawHeight = containerSize;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = containerSize;
        drawHeight = drawWidth / imgAspect;
      }
      
      // Apply position offset
      const offsetX = (position.x / containerSize) * canvas.width;
      const offsetY = (position.y / containerSize) * canvas.height;
      
      // Draw image
      ctx.drawImage(
        img,
        -drawWidth / 2 + offsetX,
        -drawHeight / 2 + offsetY,
        drawWidth,
        drawHeight
      );
      
      ctx.restore();
    };
    
    img.src = imageUrl;
  };

  const handleApply = () => {
    const canvas = previewCanvasRef.current;
    const croppedImageUrl = canvas.toDataURL();
    onCrop(croppedImageUrl);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="image-cropper">
      <div className="preview-header">
        <h3>🎨 Chỉnh sửa Logo</h3>
        <p>Điều chỉnh vị trí và kích thước để tạo logo tròn hoàn hảo</p>
      </div>
      
      <div className="crop-container">
        <div className="crop-area">
          <div className="crop-canvas-container">
            <img
              ref={imageRef}
              className="crop-canvas"
              src={imageUrl}
              alt="Crop"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'move'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
            <div className="crop-overlay"></div>
          </div>
        </div>
        
        <div className="crop-controls">
          <div className="control-group">
            <label htmlFor="scaleSlider">🔍 Phóng to/thu nhỏ:</label>
            <input
              type="range"
              id="scaleSlider"
              className="slider"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <label htmlFor="rotateSlider">🔄 Xoay ảnh:</label>
            <input
              type="range"
              id="rotateSlider"
              className="slider"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
            />
          </div>
          
          <div className="preview-result">
            <p><strong>Preview logo:</strong></p>
            <div className="preview-circle">
              <canvas
                ref={previewCanvasRef}
                id="previewCanvas"
                width="200"
                height="200"
              />
            </div>
            
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleApply}>
                ✅ Áp dụng
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                ❌ Hủy
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;