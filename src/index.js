import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './bootstrap-theme.min.css';
import './style.css';

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			createMatch: false,
			matches: [],
			editableMatch: null
		}
	}

	addTeamNameToMathes = () => {
		
		let { matches, teams} = this.state;

		matches.forEach( match => {
			teams.forEach( team => {
				if (match.team1 == team.id){
					match.team1Title = team.title;
					this.setState({
						matches: matches
					})
				}
				if (match.team2 == team.id){
					match.team2Title = team.title;
					this.setState({
						matches: matches
					})
				}
			})
		})
	}

	addGroupNameToMathes = () => {
		let { matches, groups} = this.state;

		matches.forEach( match => {
			groups.forEach( group => {
				if (match.group == group.id){
					match.groupTitle = group.title;
					this.setState({
						matches: matches
					})
				}
			})
		})
	}	

	addStageNameToMathes = () => {
		let { matches, stages} = this.state;

		matches.forEach( match => {
			stages.forEach( stage => {
				if (match.stage == stage.id){
					match.stageTitle = stage.title;
					this.setState({
						matches: matches
					})
				}
			})
		})
	}

	setEditableMatch = (stageId, groupId, team1Id, team2Id, matchId) => {
		if (stageId && groupId && team1Id && team2Id && matchId){
				const editableMatch = {
								"stageId": stageId,
								"groupId": groupId,
								"team1Id": team1Id,
								"team2Id": team2Id,
								"matchId": matchId
							}
					this.setState({
						editableMatch: editableMatch
					})
				}
		
	}

	componentDidMount() {
		function loginByToken(baseUrl, projectName, refreshToken) {
			var xhr = new XMLHttpRequest();
			var url = baseUrl + projectName + "/login/byToken";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
		
		
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4)
					return;
				if (xhr.status !== 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					var response = JSON.parse(xhr.responseText)
					const session = response.sessionId;
					getMatches(baseUrl, projectName, session)
				}
			};
			xhr.send('"' + refreshToken + '"');
		}

		function getMatches(baseUrl, projectName, session){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', baseUrl + projectName + "/objects/GamesFooball?include=['id','stage','group','team1','team2','score']");
			xhr.setRequestHeader('X-Appercode-Session-Token', session);
			xhr.send();
	
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4)
					return;
				if (xhr.status === 401) {
					loginByToken(baseUrl, projectName, refreshToken);
				} else
				if (xhr.status !== 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					var response = JSON.parse(xhr.responseText);
					let matches = response;
					addMatchesToState(matches, app);
					getStages(baseUrl, projectName, session)
				}
			}
		}

		function addMatchesToState(matches, app){
			app.setState({
				matches: matches
			})
		}

		function getStages(baseUrl, projectName, session){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', baseUrl + projectName + "/objects/Stages?include=['title','date','id']");
			xhr.setRequestHeader('X-Appercode-Session-Token', session);
			xhr.send();
	
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4)
					return;
				if (xhr.status === 401) {
					//loginByToken();
				} else
				if (xhr.status !== 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					var response = JSON.parse(xhr.responseText);
					const stages = response;
					addStagesToState(stages, app);
					getGroups(baseUrl, projectName, session);
				}
			}
		}

		function addStagesToState(stages, app){
			app.setState({
				stages: stages
			})
		}

		function getGroups(baseUrl, projectName, session){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', baseUrl + projectName + "/objects/GroupsFootball?include=['title','stage','teams','id']");
			xhr.setRequestHeader('X-Appercode-Session-Token', session);
			xhr.send();
	
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4)
					return;
				if (xhr.status === 401) {
					//loginByToken();
				} else
				if (xhr.status !== 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					var response = JSON.parse(xhr.responseText);
					const groups = response;
					addGroupsToState(groups, app);
					getTeams(baseUrl, projectName, session);
				}
			}
		}

		function addGroupsToState(groups, app){
			app.setState({
				groups: groups,
				selectedGroup: groups[0].id
			})
		}

		function getTeams(baseUrl, projectName, session){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', baseUrl + projectName + "/objects/footballTeam?include=['id','title','symbol']");
			xhr.setRequestHeader('X-Appercode-Session-Token', session);
			xhr.send();
	
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4)
					return;
				if (xhr.status === 401) {
					//loginByToken();
				} else
				if (xhr.status !== 200) {
					alert(xhr.status + ': ' + xhr.statusText);
				} else {
					var response = JSON.parse(xhr.responseText);
					const teams = response;
					addTeamsToState(teams, app);
					addTeamNameToMathes();
					addStageNameToMathes();
					addGroupNameToMathes()
				}
			}
		}

		function addTeamsToState(teams, app){
			app.setState({
				teams: teams
			})
		}

		const { baseUrl, projectName, session, refreshToken} = this.props;
		const { addTeamNameToMathes, addStageNameToMathes, addGroupNameToMathes } = this;
		
		const app = this;
		getMatches(baseUrl, projectName, session, refreshToken);

	}

	render(){
		let { groups, matches, stages, teams, createMatch, editableMatch } = this.state;
		const app = this;
		const  setEditableMatch  = app.setEditableMatch;
		
		return (<main>
							<div className="container">
								<AddMatch app = { app } createMatch= { createMatch } />
								<ListMatches matches = {matches} createMatch = { createMatch }
														 setEditableMatch = { setEditableMatch } />
								{createMatch ? 
									<FormAddMatch groups ={ groups }
																stages = { stages } 
																teams = { teams }
																editableMatch = {editableMatch} /> : 
									null}
							</div>
						</main>
		)
	}
}

const AddMatch = (props) => {
	
	const { app, createMatch } = props

	return(
		<div className="row">
			<div className="col-xs-4">
					<a href="#" className="btn btn-success" 
						 onClick = {() => {app.setState({createMatch: !createMatch})}}>
						 Добавить
					</a>
			</div>
		</div>
	)
}

const ListMatches = (props) => {

	const { matches, setEditableMatch } = props;
	var list = matches.map( ( match, index) => (

		<tr key = { index }>
      <td onClick={() => setEditableMatch(match.stage, match.group, match.team1, match.team2, match.id)}>
      	<a href="#" 
					  >
					 {match.score}</a>
      </td>
      <td>{match.team1Title}<br/>{match.team2Title}</td>
      <td>{match.groupTitle}</td>
      <td className="hidden-xs">{match.stageTitle}</td>
    </tr>
	));

	return(
		<table className="table">
			<thead>
				<tr>
					<th>Счет</th>
					<th>Команды</th>
					<th className="hidden-xs">Группа</th>
					<th className="hidden-xs">Этап</th>
				</tr>
			</thead>
			<tbody>
				{list}
			</tbody>
		</table>
	)
}

class FormAddMatch extends React.Component{
	constructor(props){
		super(props)
		let { groups, stages, editableMatch } = this.props;	

		if ( editableMatch ){
			this.state = {
				selectmatchId: editableMatch.match,
				selectStageId: editableMatch.stage,
				selectGroupId: editableMatch.group,
				selectTeam1Id: editableMatch.team1,
				selectTeam2Id: editableMatch.team2,
				score: ""
			}
		} else {
			this.state = {
				selectStageId: stages[0].id,
				selectGroupId: groups[0].id,
				selectTeam1Id: null,
				selectTeam2Id: null,
				score: ""
			}
		}

		
	}

	setSelectGroupId = (id) => {
		this.setState({
			selectGroupId: id
		})
	};

	setSelectStageId = (id) => {
		this.setState({
			selectStageId: id
		})
	};

	setSelectTeamId = (id, property) => {

		if (property == "team1"){
			this.setState({
				selectTeam1Id: id
			})
		}

		if (property == "team2"){
			this.setState({
				selectTeam2Id: id
			})
		}
	};

	setScore = (score) => {
		this.setState({
			score: score
		})
	}
	

	render(){
		let { groups, stages, teams } = this.props;
		const { selectGroupId, score } = this.state;

		const stagesList = stages.map( item => (
			<option value={item.id} key={item.id}>{item.title}</option>
		));

		const groupsList = groups.map( item => (
			<option value={item.id} key={item.id}>{item.title}</option>
		));

		const selectGroupIndex = groups.findIndex( item => ( item.id == selectGroupId));
		const selectGroup = groups[selectGroupIndex];
		const selectTeamsIds = selectGroup.teams;
		let selectTeams = [];

		selectTeamsIds.forEach( team => {
			teams.forEach( item => {
				if( team == item.id){
					selectTeams.push({
						title: item.title,
						id: item.id
					})
				}
			})
		});

		const teams1List = selectTeams.map( item => (
			<option value={item.id} key={item.id}>{item.title}</option>
		));
		
		const teams2List = selectTeams.map( item => (
			<option value={item.id} key={item.id}>{item.title}</option>
		));

		return (

			<form action="">
					<div className="form-group">
            <label htmlFor="stage">Этап</label>
            <select className="form-control" 
										name="stage" required 
										onChange = {event => this.setSelectStageId(event.target.value)}>
							{stagesList}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="group">Группа</label>
            <select className="form-control" 
										name="group" required 
										onChange = {event => this.setSelectGroupId(event.target.value)}>
							{groupsList}
						</select>
          </div>    
          <div className="form-group">
            <label htmlFor="team1">Команда</label>
            <select className="form-control" 
										name="team1" required
										onChange = {event => this.setSelectTeamId(event.target.value, "team1")}>
                <option value="">Не выбрано</option>
                {teams1List}
            </select>
          </div>  
          <div className="form-group">
            <label htmlFor="team2">Команда</label>
            <select className="form-control" 
										name="team2" required
										onChange = {event => this.setSelectTeamId(event.target.value, "team2")}>
                <option value="">Не выбрано</option>
                {teams2List}
            </select>
          </div>  
          <div className="form-group">
            <label htmlFor="score">Счет</label>
            <input type="text" className="form-control" 
															 name="score" 
															 id="score" 
															 placeholder="0:0" 
															 value={score} required 
															 onChange = {event => this.setScore(event.target.value)}/>
          </div>  
          <div className="form-group">
            <button className="btn btn-success">Создать</button>
            <a className="btn btn-default pull-right" href="#">Назад</a>
          </div>
			</form>
		)
	}
}

sessionFromNative('{"sessionId":"cba99fa9-44a4-4670-9bf3-32373e59729d","userId":"90","projectName": "tmk","baseUrl":"https://api.appercode.com/v1/","refreshToken":"3b7c7aa3-29c2-4e07-8530-3153093290eb"}')

function sessionFromNative(e){
	const userData = JSON.parse(e);
  const session = userData.sessionId;
  const userId = userData.userId;
  const projectName = userData.projectName;
  const baseUrl = userData.baseUrl;
	const refreshToken = userData.refreshToken;
	
	ReactDOM.render(<App 
										session={session} 
										userId={userId}
										baseUrl={baseUrl}
										projectName={projectName}
										refreshToken={refreshToken}
									/>, document.getElementById('root'));
}
