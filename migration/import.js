const fs = require("fs");
const uuid = require("uuid");
const urql = require("@urql/core");

const data = fs.readFileSync(process.argv[2], { encoding: "utf-8" });
const input = JSON.parse(data);

const workspaces = [];
const files = [];

for (const workspace of input) {
  const id = uuid.v4();
  workspaces.push({ id: id, name: workspace._id });
  for (let i = 0; i < workspace.files.length; i++) {
    const file = workspace.files[i];

    files.push({
      workspace_id: id,
      download_url: `https://audio-hq-files.s3.amazonaws.com/${file.id}`,
      name: file.name,
      path: file.path,
      type: "audio",
      length: file.length,
      ordering: i,
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
        $files: [file_insert_input!]!
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
        insert_file(objects: $files) {
          affected_rows
        }
      }
    `,
    { workspaces, files }
  )
  .toPromise()
  .then((res) => console.log(res.error?.graphQLErrors));
