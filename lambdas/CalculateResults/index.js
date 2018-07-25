'use strict';
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, ctx, callback) {

  var params = {
    TableName: 'votes',

    KeyConditionExpression: "#event = :event",
    ExpressionAttributeNames:{
      "#event": "event"
    },
    ExpressionAttributeValues: {
      ":event":'test'
    }
  };

  docClient.query(params, function(err, data){
    if(err){
      callback(err, null);
    }else{
      const votes = getResults(data.Items);
      callback(null, votes);
    }
  });
}

function getResults(items) {
  let eliminated = [];
  let roundResults;

  while (canEliminate(roundResults)) {
    roundResults = getRoundResults(items, eliminated);

    eliminated.push(...getProjectsToEliminate(roundResults));
  }
  return {
    ranked: eliminated.reverse(),
    totalVotes: items.length,
    winnerVotes: roundResults[0].votes
  }
}

function getRoundResults(items, eliminated)
{
  let resultsByProject = {};

  items.forEach(record => {
    const firstChoice = getTopVote(record, eliminated);
    if (!firstChoice) {
      return;
    }
    if (resultsByProject[firstChoice] === undefined) {
      resultsByProject[firstChoice] = 0;
    }
    resultsByProject[firstChoice]++;
  })

  const unsortedResults = Object.keys(resultsByProject).map((key) => {return {project: key, votes: resultsByProject[key]}});
  return unsortedResults.sort((a, b) => {return b.votes - a.votes});
}

function getTopVote(record, eliminated) {
  for (let i = 0; i < record.votes.length; ++i) {
    let project = record.votes[i];
    if (! eliminated.includes(project)) {
      return project;
    }
  }
  return null;
}

function getLowestVoteScore(results) {
  return results[results.length - 1].votes;
}

function getProjectsToEliminate(results) {
  const lowestVote = getLowestVoteScore(results);
  return results.filter((result) => result.votes <= lowestVote).map((result) => result.project);
}

function canEliminate(results) {
  if (results === undefined) {
    return true;
  }
  return [...new Set(results.map(result => result.votes))].length !== 1;
}