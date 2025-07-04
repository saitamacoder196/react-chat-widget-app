import React, { useState } from 'react';
import './App.css';
import ChatWidget from './components/ChatWidget';
import UploadSection from './components/UploadSection';
import ImageCropper from './components/ImageCropper';

function App() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleLogoUpload = (url) => {
    if (url) {
      setTempImageUrl(url);
      setShowCropper(true);
      setIsUploaded(false);
    } else {
      // Reset everything
      setTempImageUrl(null);
      setShowCropper(false);
      setIsUploaded(false);
      setLogoUrl(null);
    }
  };

  const handleCrop = (croppedUrl) => {
    setLogoUrl(croppedUrl);
    setShowCropper(false);
    setIsUploaded(true);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImageUrl(null);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🌟 React Chat Widget Demo</h1>
          <p>Upload logo để tạo chat widget tùy chỉnh</p>
        </div>

        <UploadSection onLogoUpload={handleLogoUpload} isUploaded={isUploaded} />

        {showCropper && (
          <div className="preview-section">
            <ImageCropper 
              imageUrl={tempImageUrl}
              onCrop={handleCrop}
              onCancel={handleCancelCrop}
            />
          </div>
        )}

        <div className="demo-content">
          <h2>🚀 Tính năng Chat Widget</h2>
          <p>Sau khi upload logo, bạn sẽ thấy chat widget xuất hiện ở góc phải dưới màn hình. Widget này có các tính năng:</p>
          <p>✨ Logo tròn đẹp mắt với hiệu ứng hover</p>
          <p>💬 Click để mở popup chat hiện đại</p>
          <p>📱 Responsive design hoạt động tốt trên mọi thiết bị</p>
          <p>🎨 Animation mượt mà và giao diện thân thiện</p>
          <p>🖼️ Chỉnh sửa và crop ảnh để tạo logo tròn hoàn hảo</p>
          <p>Hãy thử upload một ảnh logo và trải nghiệm chat widget nhé!</p>
        </div>
      </div>

      <ChatWidget logoUrl={logoUrl} />
    </div>
  );
}

export default App;