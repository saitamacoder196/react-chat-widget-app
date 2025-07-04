import React, { useState, useRef } from 'react';
import './UploadSection.css';

function UploadSection({ onLogoUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoUpload(e.target.result);
      setIsUploaded(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-section">
      <div 
        className={`upload-area ${isDragging ? 'dragover' : ''} ${isUploaded ? 'uploaded' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {!isUploaded ? (
          <>
            <div className="upload-icon">📁</div>
            <div className="upload-text">Kéo thả ảnh vào đây hoặc click để chọn file</div>
            <button className="upload-btn">
              Chọn ảnh logo
            </button>
          </>
        ) : (
          <>
            <div className="upload-icon">✅</div>
            <div className="upload-text">Logo đã được upload thành công!</div>
            <div className="upload-hint">
              Kiểm tra chat widget ở góc phải dưới màn hình
            </div>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="file-input" 
          accept="image/*"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

export default UploadSection;