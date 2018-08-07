import ClientDetails from '../models/clientDetails';

export function fetchClient(clientId) {
  if (clientId) {
    return ClientDetails.query(q => {
      q.where('client_id', clientId);
    })
      .fetch()
      .then(client => {
        if (!client) {
          throw {
            status: 404,
            statusMessage: 'The Client You have entered does not exist.',
          };
        }

        return client;
      });
  }
}
