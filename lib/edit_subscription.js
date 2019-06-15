const {validate: is_valid_email_address} = require('isemail');
const {get_user, update_user_subscription} = require('./dynamodb-operations');

const subscription_status_by_action = {
  subscribe: true,
  unsubscribe: false,
};

module.exports = async ({body: stringified_body}, ctx, cb) => {
  const {email_address, verification_code, action} = JSON.parse(
    stringified_body,
  );

  if (!is_valid_email_address(email_address)) {
    return cb(null, {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Invalid subscription edit request.',
      }),
    });
  }

  const existing_user = await get_user(email_address);

  if (existing_user && existing_user.Item) {
    const update_user_subscription_response = await update_user_subscription(
      email_address,
      subscription_status_by_action[action],
    );

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully ${action}d.`,
      }),
    });
  }

  return cb(null, {
    statusCode: 403,
    body: JSON.stringify({
      message: `Invalid subscription edit request.`,
    }),
  });
};
