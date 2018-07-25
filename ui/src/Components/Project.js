import React from 'react';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    }
  }

  render() {
    return (
      <div>{this.state.name}</div>
    );
  }

  getName() {
    return this.state.name;
  }
}

export default Project;
