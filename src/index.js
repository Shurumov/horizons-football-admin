import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import './bootstrap-theme.min.css';
import './style.css';

class App extends React.Component {
	
	constructor(props){
		super(props);
		let { session } = this.props;
		this.state = {
			loading: true,
			createMatch: false,
			matches: [],
			teams: [],
			session: session,
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

	setEditableMatch = (stageId, groupId, team1Id, team2Id, matchId, score) => {
		if (stageId && groupId && team1Id && team2Id && matchId && score){
				const editableMatch = {
								"stageId": stageId,
								"groupId": groupId,
								"team1Id": team1Id,
								"team2Id": team2Id,
								"matchId": matchId,
								"score": score
							}
					this.setState({
						editableMatch: editableMatch,
						createMatch: true
					});
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
					app.setState({
						session: session
					})
					getMatches(baseUrl, projectName, session)
				}
			};
			xhr.send('"' + refreshToken + '"');
		}

		function getMatches(baseUrl, projectName, session){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', baseUrl + projectName + "/objects/GamesFooball?include=['id','stage','group','team1','team2','score']&take=-1&order=-createdAt");
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
			xhr.open('GET', baseUrl + projectName + "/objects/Stages?include=['title','date','id']&take=-1");
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
			xhr.open('GET', baseUrl + projectName + "/objects/GroupsFootball?include=['title','stage','teams','id']&take=-1");
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
			xhr.open('GET', baseUrl + projectName + "/objects/footballTeam?include=['id','title','symbol']&take=-1");
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
					addGroupNameToMathes();
					app.setState({
						loading: false
					})
				}
			}
		}

		function addTeamsToState(teams, app){
			app.setState({
				teams: teams
			})
		}

		const { baseUrl, projectName,  refreshToken} = this.props;
		const { session } = this.state;

		const { addTeamNameToMathes, addStageNameToMathes, addGroupNameToMathes } = this;
		
		const app = this;
		getMatches(baseUrl, projectName, session, refreshToken);

	}

	render(){
		let { groups, matches, stages, teams, createMatch, editableMatch, loading } = this.state;
		const app = this;
		const { setEditableMatch } = this;
		
		return (<main>
							
							<div className="container">
								{loading ? <LoadAnimation /> : null}

								
								{!createMatch ? <div>	<AddMatch app = { app } createMatch= { createMatch } />
																			<ListMatches matches = {matches} createMatch = { createMatch }
																						setEditableMatch = { setEditableMatch }
																						editableMatch = { editableMatch } />
																</div>
															: null}
								
								{createMatch ? 
									<FormEditMatch groups ={ groups }
																stages = { stages } 
																teams = { teams }
																editableMatch = { editableMatch }
																app = { app }
																/> : 
									null}
							</div>
						</main>
		)
	}
}

const LoadAnimation = () => {
	return(
		<div className="loader_background">
			<div className="loader"></div>
		</div>
	)
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

const BackButton = (props) => {
	const { app } = props;

	return (
		<a className="btn btn-default pull-right" href="#" 
			 onClick = { () => app.setState({createMatch: false, editableMatch: null})}>
			 Назад</a>
	)
}

const CreateMatchButton = (props) => {
	const { app, sendCreateMatch } = props;
	return (
		<div className="form-group">
			<a className="btn btn-success" onClick = { () => sendCreateMatch(app.state.session) }>Создать</a>
			<BackButton app = { app } />
		</div>
	)
}

const EditMatch = (props) => {
	const { app, sendUpdateMatch, sendDeleteMatch } = props;
	return (
		<div className="form-group">
			<a className="btn btn-success" 
							onClick = { () => sendUpdateMatch(app.state.session)}>Сохранить</a>
			<a className = "btn btn-default"
							onClick = { () => sendDeleteMatch(app.state.session) }>Удалить</a>
			<BackButton app = { app }/>
		</div>
	)
}

const ListMatches = (props) => {

	const { matches, setEditableMatch } = props;
	var list = matches.map( ( match, index) => (

		<tr key = { index }>
      <td onClick={() => setEditableMatch(match.stage, match.group, match.team1, match.team2, match.id, match.score)}>
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

class FormEditMatch extends React.Component{
	constructor(props){
		super(props)
		let { groups, stages, editableMatch, teams } = this.props;	
			if (editableMatch){
				this.state = {
					stages: stages,
					groups: groups,
					teams: teams,
					selectStageId: editableMatch.stageId,
					selectGroupId: editableMatch.groupId,
					selectMatchId: editableMatch.matchId,
					selectTeam1Id: editableMatch.team1Id,
					selectTeam2Id: editableMatch.team2Id,
					score: editableMatch.score
				}
			} else {
				this.state = {
					stages: stages,
					groups: groups,
					teams: teams,
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

	sendCreateMatch = (session) => {
		
		const { selectGroupId, selectStageId, selectTeam1Id, selectTeam2Id, score } = this.state;

	
		let xhr = new XMLHttpRequest();
		const url = "https://api.appercode.com/v1/tmk/objects/GamesFooball";
		let reqBody = {
			stage: selectStageId,
			group: selectGroupId,
			team1: selectTeam1Id,
			team2: selectTeam2Id,
			score: score
		};

		xhr.open("POST", url, true);
		xhr.setRequestHeader("X-Appercode-Session-Token", session);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4)
				window.location.reload();
		}
		
    xhr.send(JSON.stringify(reqBody));
	}

	sendUpdateMatch = (session) => {
		
		const { selectMatchId, selectGroupId, selectStageId, selectTeam1Id, selectTeam2Id, score } = this.state;

	
		let xhr = new XMLHttpRequest();
		const url = "https://api.appercode.com/v1/tmk/objects/GamesFooball/" + selectMatchId;
		let reqBody = {
			stage: selectStageId,
			group: selectGroupId,
			team1: selectTeam1Id,
			team2: selectTeam2Id,
			score: score
		};

		xhr.open("PUT", url, true);
		xhr.setRequestHeader("X-Appercode-Session-Token", session);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4)
				window.location.reload();
		};
		xhr.send(JSON.stringify(reqBody));
	}

	sendDeleteMatch = (session) => {
		
		const { selectMatchId } = this.state;
		let xhr = new XMLHttpRequest();
		const url = "https://api.appercode.com/v1/tmk/objects/GamesFooball/" + selectMatchId;
		xhr.open("DELETE", url, true);
		xhr.setRequestHeader("X-Appercode-Session-Token", session);
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4)
				window.location.reload();
		};
		xhr.send();
	}
	

	render(){		
		const { selectStageId, selectGroupId, selectTeam1Id, selectTeam2Id, stages, score, groups, teams } = this.state;
		const { editableMatch, app } = this.props;
		const { sendCreateMatch, sendUpdateMatch, sendDeleteMatch } = this;
		const stagesList = stages.map( item => (
			<option value={item.id} key={item.id} >
							{item.title}
			</option>
		));

		const groupsList = groups.map( item => (
			<option value={item.id} key={item.id}>
							{item.title}
			</option>
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
			<option value={item.id} key={item.id}>
							{item.title}
			</option>
		));
		
		const teams2List = selectTeams.map( item => (
			<option value={item.id} key={item.id}>
							{item.title}
			</option>
		));

		return (
			<form action="">
					<div className="form-group">
            <label htmlFor="stage">Этап</label>
            <select className="form-control" 
										name="stage" required 
										defaultValue = {selectStageId ? selectStageId : null}
										onChange = {event => this.setSelectStageId(event.target.value)}>
							{stagesList}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="group">Группа</label>
            <select className="form-control" 
										name="group" required 
										defaultValue = {selectGroupId ? selectGroupId : null}
										onChange = {event => this.setSelectGroupId(event.target.value)}>
							{groupsList}
						</select>
          </div>    
          <div className="form-group">
            <label htmlFor="team1">Команда</label>
            <select className="form-control" 
										name="team1" required
										defaultValue = {selectTeam1Id ? selectTeam1Id : null}
										onChange = {event => this.setSelectTeamId(event.target.value, "team1")}>
                <option value="">Не выбрано</option>
                {teams1List}
            </select>
          </div>  
          <div className="form-group">
            <label htmlFor="team2">Команда</label>
            <select className="form-control" 
										name="team2" required
										defaultValue = {selectTeam2Id ? selectTeam2Id : null}
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
						{ editableMatch ? <EditMatch app = {app} 
																				 sendUpdateMatch = { sendUpdateMatch } 
																				 sendDeleteMatch = { sendDeleteMatch }/> 
														: <CreateMatchButton app = {app} sendCreateMatch = { sendCreateMatch } />}
          </div>
			</form>
		)
	}
}


sessionFromNative('{"sessionId":"904946f8-ecf3-4107-ad74-e5d2eb67736c","userId":"4784","projectName": "tmk","baseUrl":"https://api.appercode.com/v1/","refreshToken":"d69f0ba6-bd1e-49ac-be6f-f63682f78e67"}')

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