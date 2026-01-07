// // lib/verifyWebhook.js
// import { createHmac } from 'crypto';

// // Secret key provided by Flutterwave (you should securely store this in your environment variables)
// const SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// const verifyWebhook = (req) => {
//   const signature = req.headers['x-flutterwave-signature']; // Header sent by Flutterwave
//   const payload = JSON.stringify(req.body);                  // The raw JSON body of the webhook request

//   // Generate the expected signature using HMAC with the secret key
//   const hash = createHmac('sha256', SECRET_KEY)  // Use SHA256 for hashing
//     .update(payload)                            // Update with the payload data
//     .digest('hex');                             // Generate the hash as hexadecimal string

//   // Compare the computed hash with the signature sent by Flutterwave
//   if (signature !== hash) {
//     throw new Error('Invalid webhook signature');
//   }

//   // If signatures match, the request is valid
//   return true;
// };

// export { verifyWebhook };
