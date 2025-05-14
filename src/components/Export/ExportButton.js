import { Button } from '@vkontakte/vkui';

const ExportButton = ({ onExport }) => {
  return (
    <Button
      appearance="positive"
      style={{ marginTop: '10px' }}
      onClick={onExport}
    >
      Экспортировать
    </Button>
  );
};

export default ExportButton;

