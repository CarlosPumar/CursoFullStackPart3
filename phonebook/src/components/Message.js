const Message = ({ message }) => {
  const correctStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (Object.keys(message).length === 0) {
    return <></>;
  }

  const style = message.error ? errorStyle : correctStyle;

  return (
    <>
      <p style={style}>{message.txt}</p>
    </>
  );
};

export default Message;
