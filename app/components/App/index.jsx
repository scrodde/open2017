import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'lodash';

import styles from './styles.scss';

const divisionTitles = {
  1: 'Individual men',
  2: 'Individual women',
  9: 'Masters men (60+)',
  12: 'Masters men (40-44)',
  13: 'Masters women (40-44)',
  18: 'Masters men (35-39)',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    const { apiBaseUrl, affiliate } = this.props;
    axios.get(`${apiBaseUrl}/affiliate/${affiliate}`)
      .then((response) => {
        const athletes = _.get(response, 'data.athletes');
        const athletesByDivision = _.groupBy(athletes, 'divisionid');
        console.log(athletesByDivision);
        this.setState({
          isLoading: false,
          athletesByDivision: athletesByDivision,
        });
      })
      .catch((error) => {
        this.setState({
          isError: true
        });
      });
  }

  openAthleteDetails(id) {
    window.open(`https://games.crossfit.com/athlete/${id}`);
  }

  render() {
    const { title } = this.props;
    const { athletesByDivision } = this.state;
    const linkToWod = (name) => `https://games.crossfit.com/workouts/open/2017/${name}?division=2`;
    const linkToAthlete = (name) => `https://games.crossfit.com/workouts/open/2017/${name}?division=2`;

    const lists = _.map(athletesByDivision, (group, ix) => {
      const groupTitle = divisionTitles[ix];
      const items = _.map(group, (athlete, ix) => {
        const rankInGroup = ix + 1;
        return (
          <tr key={ix} onClick={this.openAthleteDetails.bind(this, athlete.userid)}>
            <td className="col1 center bold bigger">{rankInGroup}</td>
            <td className="col2"><img src={_.get(athlete, 'profilepic')} className="avatar hide-mobile"/><span>{athlete.name}</span></td>
            <td className="col3 center">{athlete.overallscore}</td>
            <td className="col4">{`${_.get(athlete, 'scores[0].workoutrank')}(${_.get(athlete, 'scores[0].scoredisplay')})`}</td>
            <td className="col5">{`${_.get(athlete, 'scores[1].workoutrank')}(${_.get(athlete, 'scores[1].scoredisplay')})`}</td>
            <td className="col6">{`${_.get(athlete, 'scores[2].workoutrank')}(${_.get(athlete, 'scores[2].scoredisplay')})`}</td>
            <td className="col7">{`${_.get(athlete, 'scores[3].workoutrank')}(${_.get(athlete, 'scores[3].scoredisplay')})`}</td>
            <td className="col8">{`${_.get(athlete, 'scores[4].workoutrank')}(${_.get(athlete, 'scores[4].scoredisplay')})`}</td>
          </tr>
        )
      });
      return (
        <div key={ix} className="division">
          <div className="division__heading">
            <h2>{groupTitle}</h2>
          </div>
          <table >
            <thead><tr>
              <th className="col1">Pos</th>
              <th className="col2">Name</th>
              <th className="col3">TTL PTS</th>
              <th className="col4"><a href={linkToWod('17.1')} target="_blank">17.1</a></th>
              <th className="col5"><a href={linkToWod('17.2')} target="_blank">17.2</a></th>
              <th className="col6"><a href={linkToWod('17.3')} target="_blank">17.3</a></th>
              <th className="col7"><a href={linkToWod('17.4')} target="_blank">17.4</a></th>
              <th className="col8"><a href={linkToWod('17.5')} target="_blank">17.5</a></th>
            </tr></thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      );
    });

    return (
      <div>
        <header>
          <h1>Open 2017<span>{title}</span></h1>
        </header>
        <section>
          {lists}
        </section>
      </div>
    );
  }
}

export default App;
