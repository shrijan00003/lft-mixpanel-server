import redis from 'redis';

const client = redis.createClient();

client.on('error', function(err) {
  console.log('Error ' + err);
});

client.on('connect', function(res) {
  console.log('Res', res);
});

export default client;
