export interface WhatsappMessage {
  content: {
    entry: [
      {
        id: string;
        changes: [
          {
            value: {
              contacts: [
                {
                  profile: {
                    name: string;
                  };
                  wa_id: string;
                }
              ];
              messages: [
                {
                  from: string;

                  id: string;
                  timestamp: string;
                  type: string;
                  text: {
                    body: string;
                  };
                }
              ];
              messaging_product: string;
              metadata: {
                display_phone_number: string;
                phone_number_id: string;
              };
            };
            field: string;
          }
        ];
      }
    ];
    object: string;
  };
}
