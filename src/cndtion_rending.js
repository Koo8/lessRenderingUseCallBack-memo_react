// use 'switch' or 'enum' for conditional rendering in react project

import React from 'react';

const STATUS = {
  info: <Info />,
  warning: <Warning />,
  error: <Error />,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  getSelect = (e) => {
    e.preventDefault();
    const clicked = document.querySelector('input[name="select"]:checked');
    console.log(clicked);
    this.setState({ data: clicked.value });
  };
  render() {
    return (
      <>
        <h2>Show Notification:</h2>
        <form>
          <input type='radio' name='select' id='info' value='info' />{' '}
          <label htmlFor='info'>Info</label>
          <input type='radio' name='select' id='warning' value='warning' />{' '}
          <label htmlFor='warning'>Warning</label>
          <input type='radio' name='select' id='error' value='error' />{' '}
          <label htmlFor='error'>Error</label>
          <input
            type='submit'
            value='Submit'
            id='submit'
            onClick={this.getSelect}
          />
        </form>
        <div>
          <Show status={this.state.data} />
        </div>
      </>
    );
  }
}

function Show({ status }) {
  console.log(status);
  return (
    <>
      {(() => {
        // switch...

        // switch (status) {
        //   case 'info':
        //     return <Info />;
        //   case 'warning':
        //     return <Warning />;
        //   case 'error':
        //     return <Error />;
        //   default:
        //     return null;
        // }

        // enum...

        return STATUS[status];
      })()}
    </>
  );
}

function Info() {
  console.log('INFO>>>>');
  return (
    <>
      <h2>THis is the INfo message.</h2>
    </>
  );
}

function Warning() {
  console.log('warning>>>>');
  return (
    <>
      <p>Oh no, you have a warning....</p>
    </>
  );
}

function Error() {
  console.log('error>>>>');
  return (
    <>
      <p>
        <i>TOO BAD.</i>
      </p>
    </>
  );
}
export default App;

// "Nested conditional rendering in react"
