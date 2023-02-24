import { ChangeEvent, useEffect, useState } from 'react';

import io from 'socket.io-client';
import { message } from './db';
import { WhatsappMessage } from './interfaces/WhatsappMessage.interface';
const socket = io('https://smp-server.adaptable.app/');

export type MessageToSend = {
  token: string | undefined;
  to_number: string | undefined;
  message: string | undefined;
};
function App() {
  const [loged, setLoged] = useState<boolean>(false);
  const [lastMsg, setLastMsg] = useState<WhatsappMessage | null>(null);
  const [token, setToken] = useState<string>('');
  const [userData, setUserData] = useState<any>({});
  const [message, setMessage] = useState<MessageToSend>({
    token: token,
    to_number: '543417229528',
    message: '',
  });

  //template

  const [template, setTemplate] = useState<any>({
    name: '',
    lenguage: '',
  });
  const handleTemplate = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    setTemplate({
      ...template,
      [name]: value,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { value, name } = e.target;
    setMessage({
      ...message,
      [name]: value,
    });
  };
  const NUMBER_ID = '115068444828610';

  const sendWhatsappMessage = () => {
    if (!message) {
      return alert('Algotamal');
    }
    if (
      !message.to_number ||
      !message.token ||
      !message.message ||
      message.to_number.length <= 0 ||
      message.token.length <= 0 ||
      message.message.length <= 0
    ) {
      return alert('No puedes dejar campos vacios');
    }
    fetch(`https://graph.facebook.com/v16.0/${NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${message.token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: `${message.to_number}`, //<<== messages.from 5493417229528
        type: 'text',
        text: {
          // the text object
          preview_url: false,
          body: `${message.message}`, // << == string
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log('Fetch Response', data))
      .catch((err) => console.error(err));
  };

  const sendWhatsappTemplate = (templateName?: string, lenguage?: string) => {
    if (!message) {
      return alert('Algotamal');
    }
    fetch(`https://graph.facebook.com/v16.0/${NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${message.token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: message.to_number,
        type: 'template',
        template: {
          name: `${templateName}`,
          language: { code: `${lenguage}` },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log('Fetch Response', data))
      .catch((err) => console.error(err));
  };

  const fbLogin = () => {
    FB.login(
      function (response) {
        console.log(response);
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          setLoged(true);
        } else {
          console.log('User cancelled login or did not fully authorize.');
          setLoged(false);
        }
      },
      {
        scope:
          'pages_show_list,instagram_basic,pages_read_user_content,public_profile,business_management,whatsapp_business_management,pages_messaging',
      }
    );
  };
  const logOut = () => {
    window?.FB?.logout((res) => {
      console.log(res);
    });
    setLoged(false);
    setUserData(null);
  };

  const socketCall = () => {
    fetch('http://localhost:5000/socket/whatsapp');
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

          setLoged(true);
          setToken(response?.authResponse?.accessToken);
          setMessage((oldSt) => ({
            ...oldSt,
            token: response?.authResponse?.accessToken,
          }));
        } else {
          setLoged(false);
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
  //socket connection
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connectado');
    });
    socket.on('new-message', (s) => {
      if (s?.content?.entry[0]?.changes[0]?.value?.statuses) {
        return;
      } else {
        setLastMsg(s);
      }
    });

    socket.on('message-status-as-change', (socket) => {
      console.log('message-status-as-change');
      console.log(socket);
    });
    socket.on('disconnect', (x: any) => {
      console.log('disconect', x);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    return () =>
      FB.api(
        '/me',
        'get',
        { fields: 'id,name,email,albums,likes,feed,picture' },
        function (response) {
          console.log(response);
          setUserData(response);
        }
      );
  }, [loged]);
  return (
    <div className="App p-4">
      <div>
        {loged ? (
          <div>
            {userData && (
              <div>
                <img
                  height={userData?.picture?.data?.height || 50}
                  width={userData?.picture?.data?.width || 50}
                  alt="profile image"
                  src={
                    userData?.picture?.data?.url ||
                    'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
                  }
                />
                <p>{userData?.name}</p>
                <p>{userData?.email}</p>
              </div>
            )}
            <button
              className="bg-red-500 p-2 text-white font-bold"
              onClick={logOut}
            >
              Cerrar Sesion
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-400 p-2 text-white font-bold"
            onClick={() => fbLogin()}
          >
            Log In
          </button>
        )}
      </div>
      <div></div>
      <div>
        <div>
          <h3 className="font-bold text-slate-900 text-4xl gap-2 text-center mb-4">
            {' '}
            Conversación
          </h3>
        </div>
        <div className="m-2">
          <div className="flex justify-between border-b">
            <p className="p-2 font-bold text-l">Mensaje rápido 1</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                sendWhatsappTemplate('hello_world', 'en_US');
              }}
              className="border p-2 bg-emerald-800 text-white font-bold text-l hover:bg-emerald-600"
            >
              {' '}
              Enviar{' '}
            </button>
          </div>
          <div className="flex justify-between border-b">
            <input
              className="p-2 font-bold text-l bg-slate-400"
              name="name"
              placeholder="template name"
              value={template?.name || ''}
              onChange={(e) => {
                handleTemplate(e);
              }}
            />
            <input
              className="p-2 font-bold text-l bg-slate-400"
              name="lenguage"
              placeholder="lenguage"
              value={template?.lenguage || ''}
              onChange={(e) => {
                handleTemplate(e);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                sendWhatsappTemplate(template.name, template.lenguage);
              }}
              className="border p-2 bg-emerald-800 text-white font-bold text-l hover:bg-emerald-600"
            >
              {' '}
              Enviar{' '}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4 bg-slate-600  p-2">
          <h3 className="font-bold text-white">Ultimo Mensaje :</h3>
          {lastMsg ? (
            <div className="rounded p-2 flex flex-col bg-emerald-300">
              <div className="flex gap-4">
                <span className="text-sm font-light text-gray-700">
                  {lastMsg?.content?.entry[0]?.changes[0]?.value?.contacts[0]
                    .profile?.name
                    ? lastMsg?.content?.entry[0]?.changes[0]?.value?.contacts[0]
                        .profile?.name
                    : ''}
                </span>
                <span className="text-sm font-light text-gray-700">
                  {lastMsg?.content?.entry[0]?.changes[0]?.value?.contacts[0]
                    ?.wa_id
                    ? lastMsg?.content?.entry[0]?.changes[0]?.value?.contacts[0]
                        ?.wa_id
                    : ''}
                </span>
              </div>
              <div>
                <span>
                  {lastMsg?.content?.entry[0]?.changes[0]?.value?.messages[0]
                    ?.text?.body
                    ? lastMsg?.content?.entry[0]?.changes[0]?.value?.messages[0]
                        ?.text?.body
                    : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded p-2 flex flex-col bg-emerald-300">
              'No hay mensajes que mostrar
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ">
          <label htmlFor="token" className="w-full flex justify-between">
            Token de acceso temporal:
            <input
              className="bg-slate-500 border-none text-neutral-50"
              name="token"
              onChange={(e) => {
                handleChange(e);
              }}
              value={message.token}
            />
          </label>
          <label htmlFor="to_number" className="w-full flex justify-between ">
            Numero del contacto:
            <input
              className="bg-slate-500 border-none text-neutral-50"
              name="to_number"
              onChange={(e) => {
                handleChange(e);
              }}
              value={message.to_number}
            />
          </label>
          <label htmlFor="message" className="w-full flex justify-between">
            Mensaje
            <textarea
              className="bg-slate-500 border-none text-neutral-50"
              name="message"
              onChange={(e) => {
                handleChange(e);
              }}
              value={message.message}
            />
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              sendWhatsappMessage();
            }}
            className="border p-2 bg-emerald-400 text-white font-bold text-xl hover:bg-emerald-600"
          >
            {' '}
            Enviar Mensaje{' '}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
