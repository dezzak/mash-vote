import React from 'react';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }

  render() {
    if (! this.props.winner) {
      return (<div />);
    }
    return (
      <div>
        <h2>Results</h2>
        <p>Total Votes: {this.props.totalVotes}</p>
        <p>Winner: {this.props.winner} with {this.props.winnerVotes} votes</p>
      </div>
    );
  }
}

export default Results;
