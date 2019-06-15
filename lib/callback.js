const log_keys_value_pairs = o => {
  Object.entries(o).forEach(([k, v]) => {
    console.log('key: ', k, ', value: ', v, '\n');
  });
};

const {send_email} = require('./send_emails');

module.exports = async ({Records}, ctx, cb) => {
  await Promise.all(
    Records.map(record => {
      const {eventName, dynamodb} = record;
      const {OldImage, NewImage} = dynamodb;
      const image = {...OldImage, ...NewImage};

      const {
        subscribed: {BOOL: subscribed},
        email_address: {S: email_address},
        verification_code: {S: verification_code},
      } = image;

      switch (eventName) {
        case 'INSERT': {
          const confirm_subscription_link = encodeURI(
            `email_address=${email_address}&verification_code=${verification_code}&action=subscribe`,
          );

          return send_email({
            subject: 'Subscription Confirmation',
            html: [
              `<div>`,
              `  <a href='${confirm_subscription_link}'>Click here to confirm your subscription</a>`,
              `</div>`,
            ].join('\n'),
            user: {
              email_address: 'harrysolovay@gmail.com',
            },
          });
        }

        case 'MODIFY': {
          if (subscribed) {
            return send_email({
              subject: 'Subscription Verification',
              html: [`<div>`, `  <p>This is a confirmation</p>`, `</div>`].join(
                '\n',
              ),
              user: {
                email_address: 'harrysolovay@gmail.com',
                verification_code: 'test',
              },
            });
          }

          const confirm_subscription_link = encodeURI(
            `email_address=${email_address}&verification_code=${verification_code}&action=subscribe`,
          );

          return send_email({
            subject: 'Subscription Confirmation',
            html: [
              `<div>`,
              `  <a href='${confirm_subscription_link}'>Click here to confirm your subscription</a>`,
              `</div>`,
            ].join('\n'),
            user: {
              email_address: 'harrysolovay@gmail.com',
            },
          });
        }

        default: {
          // error
          break;
        }
      }
    }),
  );

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sent verification email.',
    }),
  });
};
