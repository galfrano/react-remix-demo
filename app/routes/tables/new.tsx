import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
// import { MenuCategoryType } from "@prisma/client";
import { createTable } from "~/models/table.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  // TODO: security
  const formData = await request.formData();

  const table = formData.get("table");
  if (typeof table !== "string" || table.length === 0) {
    return json({ errors: { table: "Table is required" } }, { status: 400 });
  }

  const newTable = await createTable({ table });

  return redirect(`/tables/${newTable.id}`);
}

export default function NewTablePage() {
  const actionData = useActionData<typeof action>();
  const tableRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.table) {
      tableRef.current?.focus();
    }
  }, [actionData]);

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
          <span>Table: </span>
          <input
            ref={tableRef}
            name="table"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "table-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.table && (
          <div className="pt-1 text-red-700" id="table-error">
            {actionData.errors.table}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
