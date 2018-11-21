// import * as TEST from './test';
// import * as DEV from './dev';

let config;
if (process.env.NODE_ENV === 'test') {
  // config = TEST;
} else if (process.env.NODE_ENV === 'production') {
  config = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  };
} else {
  // config = DEV;
}


export default config;