const {SES} = require('aws-sdk');
const fetch = require('node-fetch');
const {parse, serialize} = require('parse5');
const {replace, startsWith} = require('ramda');

const ses = new SES();

const send_email = ({subject, html, user}) => {
  const {email_address, verification_code} = user;

  const unsubscribe_link =
    verification_code &&
    encodeURI(
      `email_address=${email_address}&verification_code=${verification_code}`,
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

function traverse(node, callback) {
  if (!node) return;

  const queue = [node];
  while (queue.length !== 0) {
    const current = queue.pop();
    callback(current);

    if (typeof current === 'object') {
      for (const i in current) {
        if (i !== 'parentNode') queue.unshift(current[i]);
      }
    }
  }
}

module.exports = async ({body: stringified_body}, ctx, cb) => {
  const {subject, html: passed_html, html_url, users} = JSON.parse(
    stringified_body,
  );

  const html =
    passed_html ||
    (await (async () => {
      const fetched_html = await fetch(html_url, {method: 'GET'}).then(r =>
        r.text(),
      );
      const parsed = parse(fetched_html);
      const target = '/community';
      const replacement = 'https://amplify.aws/community';

      traverse(parsed, node => {
        if (
          typeof node === 'object' &&
          node.name &&
          node.value &&
          (node.name === 'srcset' || startsWith(target, node.value))
        ) {
          node.value = replace(target, replacement, node.value);
        }
      });

      return serialize(parsed);
    })());

  const send_emails_response = await Promise.all(
    users.map(user => send_email({subject, html, user})),
  );

  return cb(null, {
    statusCode: 200,
    body: JSON.stringify(send_emails_response),
  });
};
