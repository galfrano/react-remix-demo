import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { MenuCategoryType } from "@prisma/client";
import { createMenuCategory } from "~/models/menu-category.server";
// import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  // const userId = await requireUserId(request);
  // TODO: security
  const formData = await request.formData();
  const category = formData.get("category");
  const type = formData.get("type");

  if (typeof category !== "string" || category.length === 0) {
    return json({ errors: { category: "Name is required" } }, { status: 400 });
  }

  if (typeof type !== "string" || type.length === 0) {
    return json({ errors: { type: "Type is required" } }, { status: 400 });
  }

  const newCategory = await createMenuCategory({ category, type });

  return redirect(`/categories/${newCategory.id}`);
}

export default function NewCategoryPage() {
  const actionData = useActionData<typeof action>();
  const categoryRef = React.useRef<HTMLInputElement>(null);
  const typeRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.category) {
      categoryRef.current?.focus();
    } else if (actionData?.errors?.type) {
      typeRef.current?.focus();
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
          <span>Name: </span>
          <input
            ref={categoryRef}
            name="category"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.category ? true : undefined}
            aria-errormessage={
              actionData?.errors?.category ? "category-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.category && (
          <div className="pt-1 text-red-700" id="category-error">
            {actionData.errors.category}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Type: </span>
          <select
            ref={typeRef}
            name="type"
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.type ? true : undefined}
            aria-errormessage={
              actionData?.errors?.type ? "type-error" : undefined
            }
          >
            <option value="">Select Type</option>
            {Object.keys(MenuCategoryType).map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors?.type && (
          <div className="pt-1 text-red-700" id="type-error">
            {actionData.errors.type}
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
