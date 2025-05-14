import { Div } from '@vkontakte/vkui';

const UserProfileSplit = ({ children, width = '224px', height = '234px' }) => {
  return (
    <Div
      width={width}
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto',
        gridTemplateColumns: '224px',
        height: height, 
        padding: 0
      }}
    >
      {children}   
    </Div>
  );
};

export default UserProfileSplit;

