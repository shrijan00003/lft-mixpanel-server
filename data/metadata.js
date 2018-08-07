import { createClientId } from '../src/utils/jwtUtils';

const LOCATION = {
  longitude: 334343,
  latitude: 11111
};

export const META_DATA = {
  clientId: 'abc123',
  browser: 'chrome',
  os: 'ubuntu',
  userId: createClientId(),
  ipAddress: '127.129.0.1',
  device: 'Dell',
  location: JSON.stringify(LOCATION)
};
