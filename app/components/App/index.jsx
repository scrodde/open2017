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

        let scores = [];
        let usersById = {};
        const allAthletes = _.get(response, 'data.athletes');

        const maleOrFemale = (divisionId) => {
          return _.includes([1, 9, 12, 18], parseInt(divisionId)) ? 'm' : 'f';
        };

        _.each(allAthletes, (athlete) => {
          const user = {
            id: athlete.userid,
            name: athlete.name,
            avatar: athlete.profilepic,
            gender: maleOrFemale(athlete.divisionid),
          };
          usersById[user.id] = user;
          _.each(athlete.scores, (el, ix) => {
            const score = {
              userId: user.id,
              display: el.scoredisplay,
              rank: parseInt(el.workoutrank),
              gender: user.gender,
              wod: ix,
            };
            if (!_.isNaN(score.rank)) {
              scores.push(score);
            }
          });
        });

        // Normalize the rankings by the groups and the wod...
        let normalizedScores = [];
        _.each(['m', 'f'], (gender) => {
          const genderWodScores = _.chain(scores)
                          .filter({gender: gender})
                          .groupBy('wod')
                          .value();

          _.each(genderWodScores, (wod) => {
            const wodScores = _.chain(wod)
                          .sortBy('rank')
                          .map((el, ix) => {
                            return _.assign(el, { rank: ix + 1 });
                          })
                          .value();
            normalizedScores = _.concat(normalizedScores, wodScores);
          })
        });

        // Update the users Objects
        _.each(_.keys(usersById), (key) => {
          const user = usersById[key];
          const foundScores = _.filter(normalizedScores, (s) => s.userId == user.id);
          const totalScore = _.reduce(foundScores, (sum, score) => {
            return sum + score.rank;
          }, 0);
          usersById[key]['totalScore'] = totalScore;
          usersById[key]['scores'] = _.sortBy(foundScores, 'wod');
        });

        this.setState({
          isLoading: false,
          usersByGender: _.groupBy(usersById, 'gender'),
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
    const { usersByGender } = this.state;
    const linkToWod = (name) => `https://games.crossfit.com/workouts/open/2017/${name}?division=2`;
    const linkToAthlete = (id) => `https://games.crossfit.com/workouts/open/2017/${id}?division=2`;

    const lists = _.map(['m', 'f'], (key, ix) => {
      const groupTitle = (ix === 0) ? 'Men' : '#larunnaiset';
      const sortedUsers = _.sortBy(_.get(usersByGender, key, []), 'totalScore');
      const items = _.map(sortedUsers, (user, ix) => {
        let rankInGroup = ix + 1;
        if (ix > 0) {
          if (_.get(sortedUsers, `[${ix-1}].totalScore`) == user.totalScore) {
            rankInGroup -= 1;
          }
        }
        return (
          <tr key={ix} onClick={this.openAthleteDetails.bind(this, user.id)}>
            <td className="col1 center bold bigger">{rankInGroup}</td>
            <td className="col2"><img src={_.get(user, 'avatar')} className="avatar hide-mobile"/><span>{user.name}</span></td>
            <td className="col3 center">{user.totalScore}</td>
            <td className="col4">{`${_.get(user, 'scores[0].rank', '--')}(${_.get(user, 'scores[0].display', '--')})`}</td>
            <td className="col5">{`${_.get(user, 'scores[1].rank', '--')}(${_.get(user, 'scores[1].display', '--')})`}</td>
            <td className="col6">{`${_.get(user, 'scores[2].rank', '--')}(${_.get(user, 'scores[2].display', '--')})`}</td>
            <td className="col7">{`${_.get(user, 'scores[3].rank', '--')}(${_.get(user, 'scores[3].display', '--')})`}</td>
            <td className="col8">{`${_.get(user, 'scores[4].rank', '--')}(${_.get(user, 'scores[4].display', '--')})`}</td>
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
