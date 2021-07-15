// payments\src\stripe.ts

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: '2020-08-27',
});

// const createSubscriptionSession = async () => {
//   const session = await stripe.checkout.sessions.create({
//     success_url: 'https://example.com/success',
//     cancel_url: 'https://example.com/cancel',
//     payment_method_types: ['card'],
//     // line_items: [{ price: 'price_H5ggYwtDq4fbrJ', quantity: 2 }]
//     mode: "subscription",

//   });
// };

// const schedule = async () => {
//   const customer = await stripe.customers.create({
//     payment_method: 'hello',
//   });
//   const subscription = await stripe.subscriptionSchedules.create({
//     default_settings: {},
//   });
// };

// const createSubscription = async () => {
//   const customer = await stripe.customers.create({
//     email: 'test@test.com', // tjhis will add the customer to stripe account i gusess
//   });

//   // create product or find the product

//   // const product =

//   // create price attached to the product

//   const price = await stripe.prices.create({
//     currency: 'usd',
//     unit_amount: 3200,
//     product: 'some product id',
//     recurring: {
//       interval: 'month',
//       usage_type: 'licensed',
//     },

//     // tiers: [
//     //   {
//     //     up_to: 900,
//     //     flat_amount_decimal: (900).toFixed(2),
//     //   },
//     //   {
//     //     up_to: 1150,
//     //     flat_amount_decimal: (1150).toFixed(2),
//     //   },
//     //   {
//     //     up_to: 1150,
//     //     flat_amount_decimal: (1150).toFixed(2),
//     //   },
//     // ],
//   });

//   const priceId = price.id;

//   const subscription = await stripe.subscriptions.create({
//     customer: 'some id', // customer has to be created on front end i guess, with email? // use create customer e
//     items: [
//       {
//         price: priceId,
//       },
//     ],
//   });

//   const subscriptionSchedule = await stripe.subscriptionSchedules.create({
//     customer: 'spome id',
//     start_date: 'now',
//     end_behavior: 'cancel',
//     phases: [
//       {
//         items: [
//           {
//             // price_data: {
//             //   currency: 'usd',
//             //   product: 'some id ',
//             // },
//           },
//         ],
//         iterations: 1,
//       },
//       {
//         items: [
//           {
//             price_data: {
//               currency: 'usd',
//               product: 'some id ',
//               recurring: {
//                 interval: 'month',
//                 interval_count: 1,
//               },
//               unit_amount: 90000,
//             },
//           },
//         ],
//         iterations: 1,
//       },

//       {
//         items: [
//           {
//             price_data: {
//               currency: 'usd',
//               product: 'some id ',
//               recurring: {
//                 interval: 'month',
//                 interval_count: 1,
//               },
//               unit_amount: 1150000,
//             },
//           },
//         ],
//         iterations: 2,
//       },
//     ],
//   });
// };
