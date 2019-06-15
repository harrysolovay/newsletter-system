const {validate: is_valid_email_address} = require('isemail');
const {
  get_user,
  update_user_last_attempt,
  create_user,
} = require('./dynamodb-operations');

module.exports = async ({body: stringified_body}, ctx, cb) => {
  const {email_address} = JSON.parse(stringified_body);

  if (!is_valid_email_address(email_address)) {
    return cb(null, {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Please enter a valid email address.',
      }),
    });
  }

  const existing_user = await get_user(email_address);

  if (existing_user && existing_user.Item) {
    const update_user_last_attempt_response = await update_user_last_attempt(
      email_address,
    );

    // throttle malicious requests

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Resending verification email.',
      }),
    });
  }

  const create_user_response = await create_user(email_address);

  return cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Please verify your email address.',
    }),
  });
};
