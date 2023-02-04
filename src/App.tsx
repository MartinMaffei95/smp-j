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
      FB.init({
        appId: '709846977358878',
        cookie: true,
        xfbml: true,
        version: 'v15.0',
      });
      FB.AppEvents.logPageView();

      // get our login status for render buttons and actions
      FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          console.log('tas logeado', response);
        }
        console.log(response);
      });
    };

    (function (d, s: any, id) {
      let js,
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
