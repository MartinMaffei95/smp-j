import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';

function App() {
  const [loged, setLoged] = useState<boolean>(false);
  const fbLogin = () => {
    FB.login(function (response) {
      if (response.status === 'connected') {
        // Logged into your webpage and Facebook.
      } else {
        // The person is not logged into your webpage or we are unable to tell.
      }
    });
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      window?.FB?.init({
        appId: '709846977358878',
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });

      window?.FB?.AppEvents.logPageView();

      window?.FB?.getLoginStatus(function (response) {
        console.log(response);
        if (response.status === 'connected') setLoged(true);
        else setLoged(false);
      });
    };

    (function (d, s: any, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  return (
    <div className="App p-4">
      <div>{loged ? 'loged' : 'NotLoged'}</div>
      <div>
        <button
          className="bg-blue-400 p-2 text-white font-bold"
          onClick={fbLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default App;
