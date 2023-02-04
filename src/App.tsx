import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';

function App() {
  const [loged, setLoged] = useState<boolean>(false);

  const fbLogin = () => {
    FB.login(function (response) {
      console.log(response);
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
          // console.log('Good to see you, ' + response + '.');
          console.log('res of FBAPI:', response);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      FB?.init({
        appId: '709846977358878',
        cookie: true,
        xfbml: true,
        version: 'v16.0',
      });

      // FB.AppEvents.logPageView();

      FB.getLoginStatus(function (response) {
        console.log(response);
        // if (response.status === 'connected') setLoged(true);
        // else setLoged(false);
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
          onClick={() => fbLogin()}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default App;
