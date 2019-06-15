const {DynamoDB} = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const client = new DynamoDB.DocumentClient();

const TableName = 'newsletter-dev';

const create_user = email_address => {
  const verification_code = uuidv4();
  const subscribed = false;
  const last_attempt = new Date().toJSON();

  const params = {
    TableName,
    Item: {
      email_address,
      verification_code,
      subscribed,
      last_attempt,
    },
  };

  return client.put(params).promise();
};

const get_user = email_address => {
  const params = {TableName, Key: {email_address}};
  return client.get(params).promise();
};

const update_user_field = (email_address, o) => {
  const [key, value] = Object.entries(o)[0];
  return client
    .update({
      TableName,
      Key: {email_address},
      UpdateExpression: 'set #a = :x',
      ExpressionAttributeNames: {'#a': key},
      ExpressionAttributeValues: {':x': value},
    })
    .promise();
};

const update_user_last_attempt = email_address =>
  update_user_field(email_address, {last_attempt: new Date().toJSON()});

const update_user_subscription = (email_address, subscribed) =>
  update_user_field(email_address, {subscribed});

module.exports = {
  create_user,
  get_user,
  update_user_last_attempt,
  update_user_subscription,
};
