import { useState } from 'react';

// Utility function -- looks at all the cookies for this page and gives you the one requested
const getCookie = (cookieName) => {
  // Get name followed by anything except a semicolon
  const cookieString = RegExp(''+cookieName+'[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./,'') : '');
}

function App () {
 
    const [clickCount, setClickCount] = useState(getCookie('count') || 0);
    const [userName, setUserName] = useState(getCookie('username' || ''));
    const [userNameIsEditable, setUserNameIsEditable] = useState(false);

  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires='+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ';' + expires + ';path=/';
    setUserName(getCookie('username'));
  }

  const handleClick = () => {
    const newCount = Number(clickCount) + 1;
    
    // This is making a cookie called count with the newCount amount
    // It will replace anything called count
    setCookie('count', newCount, 365);
    setClickCount(getCookie('count'));
    
  }

  const editUsername = () => {
    
      setUserNameIsEditable(true)
   
  }

  const saveUsername = (e) => {
    // DO COOKIE WORK HERE
      setCookie('username', userName, 365);
      setUserNameIsEditable(false)
    
  }

    return (
      <div>
        <center>
          <h1>Click the Cookie!!</h1>
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
      </div>
    );
}

export default App;
