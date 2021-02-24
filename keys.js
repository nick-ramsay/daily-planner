exports.mongodb = {
    mongo_uri: process.env.mongo_uri
};

exports.gmail_credentials = {
    gmailUserId: process.env.REACT_APP_GMAIL_USER_ID,
    gmailPassword: process.env.REACT_APP_GMAIL_PASSWORD,
    gmailClientId: process.env.REACT_APP_GMAIL_CLIENT_ID,
    gmailClientSecret: process.env.REACT_APP_CLIENT_SECRET,
    gmailRefreshToken: process.env.REACT_APP_REFRESH_TOKEN,
    sendGridAPIKey: process.env.SENDGRID_API_KEY
  };