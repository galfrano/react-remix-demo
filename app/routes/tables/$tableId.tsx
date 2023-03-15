import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteTable, getTable } from "~/models/table.server";
// import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  // const userId = await requireUserId(request);
  invariant(params.tableId, "tableId not found");

  const table = await getTable({ id: params.tableId });
  if (!table) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ table });
}

export async function action({ request, params }: ActionArgs) {
  // const userId = await requireUserId(request);
  invariant(params.tableId, "tableId not found");

  await deleteTable({ id: params.tableId });

  return redirect("/tables");
}

export default function TableDetailsPage() {
  const { table } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{table.table}</h3>

      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Table not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
