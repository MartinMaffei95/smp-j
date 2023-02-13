import { WhatsappMessage } from './interfaces/WhatsappMessage.interface';

export const message: WhatsappMessage = {
  content: {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '105578829120620',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '16505551111',
                phone_number_id: '123456123',
              },
              contacts: [
                {
                  profile: {
                    name: 'Ernestino',
                  },
                  wa_id: '54315625623',
                },
              ],
              messages: [
                {
                  from: '16315551181',
                  id: 'ABGGFlA5Fpa',
                  timestamp: '1504902988',
                  type: 'text',
                  text: {
                    body: 'Este es un mensaje de prueba',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
};
