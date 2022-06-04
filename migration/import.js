const fs = require("fs");
const uuid = require("uuid");
const urql = require("@urql/core");

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });
const input = JSON.parse(data);

const workspaces = [];
const jobs = [];

for (const workspace of input) {
  const id = uuid.v4();
  workspaces.push({ id: id, name: workspace._id });
  for (let i = 0; i < workspace.files.length; i++) {
    const file = workspace.files[i];

    jobs.push({
      workspace_id: id,
      url: `https://audio-hq-files.s3.amazonaws.com/${file.id}`,
      name: file.name,
      path: file.path,
    });
  }
}

const client = new urql.Client({
  url: "http://localhost:8080/v1/graphql",
  fetchOptions: {
    headers: {
      "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  },
});

client
  .mutation(
    `
      mutation Import(
        $workspaces: [workspace_insert_input!]!
        $jobs: [job_insert_input!]!
      ) {
        delete_workspace(where: {}) {
          affected_rows
        }
        delete_file(where: {}) {
          affected_rows
        }
        insert_workspace(objects: $workspaces) {
          affected_rows
        }
        insert_jobs(objects: $jobs) {
          affected_rows
        }
      }
    `,
    { workspaces, jobs }
  )
  .toPromise()
  .then((res) => console.log(res.error?.graphQLErrors));
