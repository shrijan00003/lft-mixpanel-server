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

export async function updateClientProfile(userId, body, t) {
  console.log(body, t);
  const clientId = await fetchClientWithUserId(userId);
  const updatedClient = await updateClientDetails(clientId, body, t);
  console.log('updated client', updatedClient);
}

const updateClientDetails = (id, data, t) => {
  return ClientDetails.forge({ id })
    .save(
      {
        domain_name: data.domainName,
        company_name: data.companyName,
        plan: data.plan,
        description: data.description,
      },
      t
    )
    .then(data => data.refresh())
    .catch(err => console.log(err));
};

const fetchClientWithUserId = userId => {
  return ClientDetails.forge({})
    .query(qb => {
      qb.select('client_user_details.id')
        .from('client_user_details')
        .join('users', { 'client_user_details.user_id': 'users.id' })
        .whereRaw('users.id = ? ', [userId]);
      console.log(qb.toQuery());
    })
    .fetch()
    .then(data => data.id)
    .catch(err => console.log(err));
};
