import React from 'react';

import Project from './Project';

class ProjectList extends React.Component {
  render() {
    return (
      <ul>
        <li><Project name='Project 1'/></li>
        <li><Project name='Project 2'/></li>
        <li><Project name='Project 3'/></li>
      </ul>
    );
  }
}

export default ProjectList;
