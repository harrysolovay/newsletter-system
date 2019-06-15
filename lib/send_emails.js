const {SES} = require('aws-sdk');

const ses = new SES();

const send_email = ({subject, html, user}) => {
  const {email_address, verification_code} = user;

  const unsubscribe_link =
    verification_code &&
    encodeURI(
      `email_address=${email_address}&verification_code=${verification_code}&action=unsubscribe`,
    );

  const final_html = unsubscribe_link
    ? [
        html,
        `<div>`,
        `  <a href='${unsubscribe_link}'>unsubscribe from these emails</a>`,
        `</div>`,
      ].join('\n')
    : html;

  const params = {
    Source: 'harrysolovay@gmail.com',
    Destination: {ToAddresses: [email_address]},
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },

      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: final_html,
        },
      },
    },
  };

  return ses.sendEmail(params).promise();
};

module.exports = Object.assign(
  async ({body: stringified_body}, ctx, cb) => {
    const {subject, html, users} = JSON.parse(stringified_body);

    const send_emails_response = await Promise.all(
      users.map(user => send_email({subject, html, user})),
    );

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify(send_emails_response),
    });
  },
  {send_email},
);
