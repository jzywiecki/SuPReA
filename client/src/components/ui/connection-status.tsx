const ConnectionStatus = ({ connected }) => {
  const dotStyle = {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: connected ? 'green' : 'red',
    display: 'inline-block',
  };

  return <div style={dotStyle}></div>;
};

export default ConnectionStatus;
