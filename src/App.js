import { Button, Card, CardContent, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import roster from './testRoster';

// Utility function -- looks at all the cookies for this page and gives you the one requested
const getCookie = (cookieName) => {
  // Get name followed by anything except a semicolon
  const cookieString = RegExp(''+cookieName+'[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./,'') : '');
}

  const defaultGame = {
    team_id: 1,
    opponent: "The other guys",
    is_winner: true,
    score_home_team: 14,
    score_away_team: 8,
    innings: 7,
    is_home_team: true,
}

let gameDetails = '';
if (getCookie('gameObject')) {
  gameDetails = JSON.parse(getCookie('gameObject'));
  console.log('this is gameDetails: ', gameDetails);
}

function App () {
  const [currentBatter, setCurrentBatter] = useState(getCookie('currentBatter') || 0);
  const [gameInProgress, setGameInProgess] = useState(getCookie('playerObject') ? true:false);
  const [currentInning, setCurrentInning] = useState(getCookie('currentInning') ? JSON.parse(getCookie('currentInning')) : { inning: 1, half: 'away' });
  const [currentOut, setCurrentOut] = useState(getCookie('outs') || 0);
  const [opponent, setOpponent] = useState(gameDetails.opponent||'');
  
  
  const lineupSet = () => {
    let sortRoster = [];
    // This line sorts the objects by lineup_number, 1-10
    sortRoster = roster.sort((a, b) => {
      // console.log('this is a: ', a, 'this is b: ', b);
      return a.lineup_number - b.lineup_number;
    });
    // console.log("This is sortRoster in lineupSet: ", sortRoster);
    const playerObjectArr = [];
    // loop through the sorted batting order and push an object with default game start and each user id, position and place in lineup
    // to an array that will be stored in a cookie to hold game data until the game in completed and sent to db
    for (let player of sortRoster) {
      playerObjectArr.push({
        user_id: player.user_id,
        hits: 0,
        at_bats: 0,
        walks: 0,
        rbi: 0,
        strikeouts: 0,
        position: player.position,
        lineup_number: player.lineup_number,
        single: 0,
        double: 0,
        triple: 0,
        hr: 0,
      });
    }
    // set cookie to the newly made playerObjectArr
    setGameInProgess(true);
    setCookieObject("playerObject", playerObjectArr, 365);
    setCookie("currentBatter", 0, 365);
    setCookieObject('currentInning', { inning: 1, half: 'away' }, 365);
  };

  const nextBatter = () => {
    let batter = Number(getCookie('currentBatter'));
    // console.log('this is batter: ', batter);
    let lineupLength = JSON.parse(getCookie('playerObject')).length;
    // console.log('this is lineupLength: ',lineupLength);
    if ((Number(batter)+1) === lineupLength) {
      setCookie('currentBatter', 0, 365);
      // console.log('this is now currentBatter(end of lineup, goes to 0): ', getCookie('currentBatter'));
      setCurrentBatter(0);
      return 0;
    } else {
      setCookie('currentBatter', (batter + 1), 365);
      // console.log('this is now currentBatter(increase by 1): ', getCookie('currentBatter'));
      setCurrentBatter(batter + 1);
      return batter + 1;
    }
  }

  const onDeck = () => {
    if (Number(currentBatter) === testData.length-1) {
      return 0;
    } else {
      return Number(currentBatter)+1;
    }
  }

  const addOut = () => {
    let outs = Number(getCookie('outs'));
    // console.log('this is outs: ', outs);
    let inning = getCookie('currentInning')?JSON.parse(getCookie('currentInning')): {inning: 1, half: 'away'};
    // console.log('this is inning: ', inning.inning);
    if (outs === 2) {
      setCookie('outs', 0, 365);
      if (inning.half==='away') {
        setCookieObject('currentInning', { inning: inning.inning, half: 'home' });
        setCurrentInning({inning: inning.inning, half: 'home'});
      } else {
        setCookieObject('currentInning', { inning: Number(inning.inning)+1, half: 'away'});
        setCurrentInning({ inning: Number(inning.inning)+1, half: 'away' });
      }
      setCurrentOut(0);
    } else {
      setCookie('outs', outs+1, 365);
      setCurrentOut(outs+1);
    }
    nextBatter(); // need to figure out how to only advance to next batter during your inning
  }

  // Function for clearing cookies, sending game data to db and ending game
  const endGame = () => {
    setCookieObject('playerObject', null, 0);
    setCookieObject('currentInning', null, 0);
    setCookieObject('outs', null, 0);
    setCookieObject('gameObject', null, 0);
    setGameInProgess(false);
    setCurrentBatter(0);
    setCurrentInning({ inning: 1, half: 'away' });
    setCurrentOut(0);
    setOpponent('');
  }
  // This will check for the cookie 'playerObject'and set a variable if it exists
  let testData;
  if (getCookie("playerObject")) {
    testData = JSON.parse(getCookie("playerObject"));
  }
  // This will check for the cookie 'gameObject' and set a variable if it exists
  let gameObject;
  if (getCookie("gameObject")) {
    gameObject = JSON.parse(getCookie("gameObject")); // parse will read the json as a regular object that can be used as an object
  }
  // Create a cookie
  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };
  // Create a cookie that is stringified first - Create objects as cookies
  const setCookieObject = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie =
      cname + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/";
  };

const setGameObject = () => {

    setCookieObject(
      "gameObject",
      defaultGame,
      365
    );
    console.log('this is gameObject in setGameObject: ', getCookie('gameObject'));
    if (getCookie('gameObject')) {
    let gameOpponent = JSON.parse(getCookie('gameObject'));
    console.log('gameOpponent: ', gameOpponent.opponent);
    setOpponent(gameOpponent.opponent);
    }
  }

  return (
    <Box sx={{ width: "80%", padding: "20px" }}>
      <Paper elevation={4} sx={{ width: "fit-content", padding: "10px" }}>
        <Typography variant="h1" gutterBottom>
          Spike
        </Typography>
        {/* {getCookie("playerObject") && (
          <Typography variant="body1">
            Player #{testData[currentBatter].user_id} batting #
            {testData[currentBatter].lineup_number}
          </Typography>
        )} */}
        {getCookie("playerObject") && (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">
                Player #{testData[currentBatter].user_id} batting #
                {testData[currentBatter].lineup_number}
              </Typography>
              <Typography variant="body2">
                Hits: {testData[currentBatter].hits}
              </Typography>
              <Typography variant="body2">
                At Bats: {testData[currentBatter].at_bats}
              </Typography>
              <Typography variant="body2">
                Walks: {testData[currentBatter].walks}
              </Typography>
              <Typography variant="body2">
                K's: {testData[currentBatter].strikeouts}
              </Typography>
            </CardContent>
          </Card>
        )}
        {/* {getCookie("playerObject") && (
          <Typography variant="body1">
            On Deck: Player #{testData[onDeck()].user_id}
          </Typography>
        )} */}
        {getCookie("playerObject") && (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6">
                On Deck: Player #{testData[onDeck()].user_id}
              </Typography>
              <Typography variant="body2">
                Hits: {testData[onDeck()].hits}
              </Typography>
              <Typography variant="body2">
                At Bats: {testData[onDeck()].at_bats}
              </Typography>
              <Typography variant="body2">
                Walks: {testData[onDeck()].walks}
              </Typography>
              <Typography variant="body2">
                K's: {testData[onDeck()].strikeouts}
              </Typography>
            </CardContent>
          </Card>
        )}
        {getCookie("gameObject") && (
          <Typography variant="body1">
            Opponent: {opponent}
          </Typography>
        )}
        {/* <Typography variant='body1'>This is the current Batter: {Number(currentBatter) + 1}</Typography> */}
        <Typography variant="body1">
          Current Inning: {currentInning.half === "away" ? "Top" : "Bottom"}{" "}
          {currentInning.inning}{" "}
        </Typography>
        <Typography variant="body1">Current Outs: {currentOut}</Typography>
        {!gameInProgress && (
          <Button variant="contained" onClick={lineupSet}>
            setLineup
          </Button>
        )}
        <Button variant="contained" onClick={nextBatter}>
          Next At Bat
        </Button>
        <Button variant="contained" onClick={addOut}>
          OUT
        </Button>
        <Button variant="contained" onClick={endGame}>
          End Game
        </Button>
        {!opponent && <Button variant="contained" onClick={setGameObject}>
          Set Game
        </Button>}
      </Paper>
    </Box>
  );
}

export default App;
