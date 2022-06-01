import { createUrqlClient } from "./urql_worker";
import * as GQL from "./generated/graphql";
import { pipe, subscribe } from "wonka";

const client = createUrqlClient();

const subscription = client.subscription(GQL.NewJobsSubscriptionDocument);

const { unsubscribe } = pipe(
  subscription,
  subscribe((result) => {
    console.log(result.data?.job);
  })
);
