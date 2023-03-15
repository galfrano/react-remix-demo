import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { createCheck } from "~/models/check.server";
import { getTables } from "~/models/table.server";
// import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  // TODO: security
  const formData = await request.formData();
  const tableId = formData.get("tableId");
  const note = formData.get("note");

  const newCheck = await createCheck({ userId, tableId, note });

  return redirect(`/open-checks/${newCheck.id}`);
}

export async function loader() {
  const tables = await getTables();
  return json({ tables });
}

export default function NewCheckPage() {
  // const actionData = useActionData<typeof action>();
  const { tables } = useLoaderData<typeof loader>();
  // const tableIdRef = React.useRef<HTMLButtonElement>(null);
  const noteRef = React.useRef<HTMLInputElement>(null);
  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Note: </span>
          <input
            ref={noteRef}
            name="note"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>

      <div>
        {tables.map((x) => (
          <button
            key={x.id}
            type="submit"
            name="tableId"
            value={x.id}
            className="mr-6 rounded  bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {x.table}
          </button>
        ))}
      </div>

      <div className="text-right"></div>
    </Form>
  );
}
