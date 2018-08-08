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

export function identifyClient(clientId, email) {
  return ClientDetails.forge({})
    .query(qb => {
      qb.select('*')
        .from('client_user_details')
        .join('users', { 'client_user_details.user_id': 'users.id' })
        .where({ user_email: email, client_id: clientId });
    })
    .fetch()
    .then(client => {
      if (!client) {
        throw { status: 404, statusMessage: 'CLIENT NOT FOUND ' };
      }

      return client;
    });
}
