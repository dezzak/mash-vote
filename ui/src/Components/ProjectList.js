import React from 'react';
import Reorder, {reorder} from 'react-reorder';
import shuffle from 'shuffle-array';
import uuidv4 from 'uuid/v4';

import Project from './Project';
import Results from './Results'

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    }
  }

  componentDidMount() {
    fetch('https://9dnd3ash16.execute-api.eu-west-2.amazonaws.com/dev', {
      method: 'GET',
      headers: {
        'x-api-key': '1rjw7y5vgk8ghgxGj25AN1NKxhsMDwWb6RKzLdcM',
      }
    })
      .then(results => {
        return results.json();
      }).then(data => {
      return data.Items.map(item => {
        return (new Project({name: item.projectName}));
      })
    }).then(projects => {
        this.setState({projects: shuffle(projects)});
    });
  }

  render() {
    return (
      <div>
        <Reorder
          reorderId="my-list" // Unique ID that is used internally to track this list (required)
          //reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
          //getRef={this.storeRef.bind(this)} // Function that is passed a reference to the root node when mounted (optional)
          component="ul" // Tag name or Component to be used for the wrapping element (optional), defaults to 'div'
          //placeholderClassName="placeholder" // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
          //draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
          //lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
          //holdTime={500} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
          //touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
          //mouseHoldTime={200} // Hold time before dragging begins with mouse (optional), defaults to holdTime
          onReorder={this.onReorder.bind(this)} // Callback when an item is dropped (you will need this to update your state)
          //autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
          //disabled={false} // Disable reordering (optional), defaults to false
          //disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
          //placeholder={
          //  <div className="custom-placeholder" /> // Custom placeholder element (optional), defaults to clone of dragged element
          //}
        >
          {this.renderProjects()}
        </Reorder>
        <button onClick={(e) => this.onSubmitVote(e)}>
          Vote
        </button>
        <Results winner={this.getWinner()} totalVotes={this.getTotalVotes()} winnerVotes={this.getWinnerVotes()}/>
      </div>
    );
  }

  renderProjects()
  {
    return this.state.projects.map(project => <li key={project.getName()}>{project.render()}</li>);
  }

  onReorder (event, previousIndex, nextIndex, fromId, toId) {
    this.setState({
      projects: reorder(this.state.projects, previousIndex, nextIndex)
    });
  }

  onSubmitVote (event) {
    const vote = {
      votes: this.state.projects.map(project => {return project.getName();}),
      voteId: uuidv4(),
    };

    fetch('https://9dnd3ash16.execute-api.eu-west-2.amazonaws.com/dev/vote', {
      method: 'POST',
      headers: {
        'x-api-key': '1rjw7y5vgk8ghgxGj25AN1NKxhsMDwWb6RKzLdcM',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vote),
    }).then(results => {
      this.refreshResults();
    })
  }

  refreshResults() {
    fetch('https://9dnd3ash16.execute-api.eu-west-2.amazonaws.com/dev/results', {
      method: 'GET',
      headers: {
        'x-api-key': '1rjw7y5vgk8ghgxGj25AN1NKxhsMDwWb6RKzLdcM',
      }
    })
      .then(results => {
        return results.json();
      }).then(data => {
        this.setState({results: data});
      });
  }

  getWinner() {
    return this.state.results ? this.state.results.ranked[0]: undefined;
  }

  getTotalVotes() {
    return this.state.results ? this.state.results.totalVotes: undefined;
  }

  getWinnerVotes() {
    return this.state.results ? this.state.results.winnerVotes: undefined;
  }
}

export default ProjectList;
