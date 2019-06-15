const fetch = require('node-fetch');

const REQUEST_SUBSCRIPTION_ENDPOINT =
  'https://7nl0f0wac0.execute-api.us-west-2.amazonaws.com/dev/request-subscription';
const EDIT_SUBSCRIPTION_ENDPOINT =
  'https://7nl0f0wac0.execute-api.us-west-2.amazonaws.com/dev/edit-subscription';
// const SEND_EMAILS_ENDPOINT =
//   'https://7nl0f0wac0.execute-api.us-west-2.amazonaws.com/dev/send-emails';

(async () => {
  // try {
  //   const r = await fetch(REQUEST_SUBSCRIPTION_ENDPOINT, {
  //     method: 'POST',
  //     body: JSON.stringify({email_address: 'harrysolovay@gmail.com'}),
  //   }).then(e => e.json());
  //   console.log(r);
  // } catch (e) {
  //   console.log(e);
  // }

  // try {
  //   const r = await fetch(EDIT_SUBSCRIPTION_ENDPOINT, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       email_address: 'harrysolovay@gmail.com',
  //       verification_code: '0678c809-a878-44c9-a603-64785748a6b7',
  //       action: 'subscribe',
  //     }),
  //   }).then(e => e.json());
  //   console.log(r);
  // } catch (e) {
  //   console.log(e);
  }

  // try {
  //   const r = await fetch(SEND_EMAILS_ENDPOINT, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       subject: 'some subject',
  //       html: [`<div>`, `  <p>some test</p>`, `</div>`].join('\n'),
  //       users: [
  //         {email_address: 'harrysolovay@gmail.com', verification_code: 'test'},
  //       ],
  //     }),
  //   }).then(e => e.json());
  //   console.log(r);
  // } catch (e) {
  //   console.log(e);
  // }
})();
