import { useState } from 'react';
import { 
  Div,
  Radio,
  RadioGroup,
  FormItem
} from '@vkontakte/vkui';

import ExportButton from './ExportButton';
import { exportToDOCX, exportToPDF } from '../../utils/export';

const Export = ({ formData }) => {
  const [selectedExport, setSelectedExport] = useState('pdf');

  const handleRadioChange = (e) => {
    setSelectedExport(e.target.value); 
  };

  const handleExport = () => {
    switch(selectedExport) {
      case 'pdf':
        exportToPDF('main');
        break;
      case 'word':
        exportToDOCX(formData);
        break;
      default:
        console.error('Неизвестный формат экспорта');
    }
  };

  return (
    <Div id="export"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '1000px'
      }}
    >
      <FormItem top="В каком виде экспортировать?">
        <RadioGroup
          name="export"
          value={selectedExport}
          onChange={handleRadioChange}
        >
          <Radio name="export" value="pdf" defaultChecked>
            .pdf
          </Radio>
          <Radio name="export" value="word">
            .docx
          </Radio>
        </RadioGroup>
      </FormItem>

      <ExportButton onExport={handleExport} />
    </Div>
  );
};

export default Export;

