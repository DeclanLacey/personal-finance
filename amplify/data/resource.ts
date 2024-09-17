import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
// const schema = a.schema({
//   Todo: a
//     .model({
//       content: a.string(),
//     })
//     .authorization((allow) => [allow.owner()]),
//   Stuff: a
//     .model({
//       content: a.string(),
//     })
//     .authorization((allow) => [allow.owner()])
// });

const schema = a.schema({
  UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
  Balance: a
    .model({
      current: a.float(),
      income: a.float(),
      expenses: a.float()
    })
    .authorization((allow) => [allow.owner()]),

  Transaction: a
    .model({
      avatar: a.string(),
      name: a.string(),
      category: a.string(),
      date: a.string(),
      amount: a.float(),
      recurring: a.boolean()
    })
    .authorization((allow) => [allow.owner()]),

  Budget: a 
    .model({
      category: a.string(),
      maximum: a.float(),
      theme: a.string()
    })
    .authorization((allow) => [allow.owner()]),

  Pot: a
    .model({
      name: a.string(),
      target: a.float(),
      total: a.float(),
      theme: a.string()
    })
    .authorization((allow) => [allow.owner()])
})
.authorization(allow => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

// export const data = defineData({
//   schema,
//   authorizationModes: {
//     defaultAuthorizationMode: "identityPool",
//     // API Key is used for a.allow.public() rules
//     apiKeyAuthorizationMode: {
//       expiresInDays: 30,
//     },
//   },
// });

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
