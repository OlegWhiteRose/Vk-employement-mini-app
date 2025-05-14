import { useRef, useState } from 'react';
import { Div, Button } from '@vkontakte/vkui';

const Avatar = ({ size = '190px', onFileChange }) => {
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
    <Div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Button
        style={{
          width: size,
          height: size,
          backgroundImage: src ? `url(${src})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onClick={handleButtonClick}
      >
        {!src && 'Загрузить фото'}
      </Button>
    </Div>
  );
};

export default Avatar;

