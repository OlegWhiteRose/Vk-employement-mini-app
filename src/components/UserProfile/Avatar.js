import { useRef, useState } from 'react';
import { Div, Button } from '@vkontakte/vkui';

const Avatar = ({ onFileChange }) => {
  const inputRef = useRef(null);
  const [src, setSrc] = useState(null);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSrc(URL.createObjectURL(file));
    onFileChange(file);
  };

  return (
    <Div style={{ padding: 0 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Button
        style={{
          width: '200px',
          height: '200px',
          backgroundImage: src ? `url(${src})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '8px',
          margin: '16px'
        }}
        onClick={handleButtonClick}
      >
        {!src && 'Загрузить фото'}
      </Button>
    </Div>
  );
};

export default Avatar;

