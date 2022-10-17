import { useState } from 'react';
import roster from './testRoster';

// Utility function -- looks at all the cookies for this page and gives you the one requested
const getCookie = (cookieName) => {
  // Get name followed by anything except a semicolon
  const cookieString = RegExp(''+cookieName+'[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./,'') : '');
}

// const getCookieObject = (cookieName) => {
//   // Get name followed by anything except a semicolon
//   const cookieString = RegExp(''+cookieName+'[^;]+').exec(document.cookie);
//   // Return everything after the equal sign, or an empty string if the cookie name not found
//   return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./,'') : '');
// }

function App () {
  const [clickCount, setClickCount] = useState(getCookie("count") || 0);
  const [userName, setUserName] = useState(getCookie("username" || ""));
  const [userNameIsEditable, setUserNameIsEditable] = useState(false);
  const [currentBatter, setCurrentBatter] = useState(getCookie('currentBatter') || 0);
  const [gameInProgress, setGameInProgess] = useState(getCookie('playerObject') ? true:false);
  const [currentInning, setCurrentInning] = useState(getCookie('currentInning') || { inning: 1, half: 'away' });
  const [currentOut, setCurrentOut] = useState(getCookie('outs') || 0);
  
  
  const lineupSet = () => {
    let sortRoster = [];
    // This line sorts the objects by lineup_number, 1-10
    sortRoster = roster.sort((a, b) => {
      // console.log('this is a: ', a, 'this is b: ', b);
      return a.lineup_number - b.lineup_number;
    });
    console.log("This is sortRoster in lineupSet: ", sortRoster);
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
    console.log('this is batter: ', batter);
    let lineupLength = JSON.parse(getCookie('playerObject')).length;
    console.log('this is lineupLength: ',lineupLength);
    if ((Number(batter)+1) === lineupLength) {
      setCookie('currentBatter', 0, 365);
      console.log('this is now currentBatter(end of lineup, goes to 0): ', getCookie('currentBatter'));
      setCurrentBatter(0);
      return 0;
    } else {
      setCookie('currentBatter', (batter + 1), 365);
      console.log('this is now currentBatter(increase by 1): ', getCookie('currentBatter'));
      setCurrentBatter(batter + 1);
      return batter + 1;
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
    setGameInProgess(false);
    setCurrentBatter(0);
    setCurrentInning({ inning: 1, half: 'away' });
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

  const handleClick = () => {
    const newCount = Number(clickCount) + 1;

    // This is making a cookie called count with the newCount amount
    // It will replace anything called count
    setCookie("count", newCount, 365);
    setClickCount(getCookie("count"));
  };

  const editUsername = () => {
    setUserNameIsEditable(true);
  };

  const saveUsername = (e) => {
    // DO COOKIE WORK HERE
    setCookie("username", userName, 365);
    // setCookieObject('playerObject', [{
    //   user_id: 1,
    //   hits: clickCount,
    //   at_bats: 4,
    //   walks: 5,
    //   rbi: 6,
    //   strikeouts: 0,
    //   lineup_number: 2,
    //   single: 0,
    //   double: 3,
    //   triple: 1,
    //   hr: 3
    // }], 365);

    setCookieObject(
      "gameObject",
      {
        team_id: 1,
        opponent: "The other guys",
        is_winner: true,
        score_home_team: 14,
        score_away_team: 8,
        innings: 7,
        is_home_team: true,
      },
      365
    );

    setUserName(getCookie("username"));
    setUserNameIsEditable(false);
  };

  return (
    <div>
      <center>
        <h1>Click the Cookie!!</h1>
        {getCookie("playerObject") && <p>{testData[0].hits}</p>}
        {getCookie("playerObject") && (
          <p>{getCookie("playerObject")}</p>
        )}
        {getCookie("gameObject") && <p>{gameObject.opponent}</p>}
        <p>This is the current Batter: {Number(currentBatter) + 1}</p>
        <p>Current Inning: {currentInning.half==='away'?'Top':'Bottom'} {currentInning.inning} </p>
        <p>Current Outs: {currentOut}</p>
        {/* {sortRoster.length > 0 &&
          sortRoster.map((player) => (
            <p>{`${player.lineup_number} ${player.position} ${player.user_id}`}</p>
          ))} */}
        <p>
          {userNameIsEditable ? (
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          ) : (
            `Username: ${userName}`
          )}
          <br />
          {/* Username should go here */}
          {/* The next block of code is conditional rendering.
            Look at the documentation https://reactjs.org/docs/conditional-rendering.html
            if this is new to you. */}
          {/* 
              This conditional rendering is using a `ternary` operator. It works like an if/else block.
              The part at the front is being evaluated. The `?` starts the conditions. 
              The first condition is what will be done if true.
              The `:` breaks into the else block.
              
             

          
              ```

            */}
          {userNameIsEditable ? (
            <button onClick={saveUsername}>Save Username</button>
          ) : (
            <button onClick={editUsername}>Edit Username</button>
          )}
        </p>
        <p>{clickCount}</p>
        <span
          role="img"
          aria-label="cookie"
          style={{ fontSize: "100px", cursor: "pointer" }}
          onClick={handleClick}
        >
          🍪
        </span>
      </center>
      {!gameInProgress && <button onClick={lineupSet}>setLineup</button>}
      <button onClick={nextBatter}>Next At Bat</button>
      <button onClick={addOut}>OUT</button>
      <button onClick={endGame}>End Game</button>
    </div>
  );
}

export default App;
