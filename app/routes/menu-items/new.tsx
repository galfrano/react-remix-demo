import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
// import { MenuCategoryType } from "@prisma/client";
import { createMenuItem } from "~/models/menu-item.server";
import { getMenuCategories } from "~/models/menu-category.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  // TODO: security
  const formData = await request.formData();

  const item = formData.get("item");
  if (typeof item !== "string" || item.length === 0) {
    return json({ errors: { item: "Item is required" } }, { status: 400 });
  }
  const price = formData.get("price");
  if (isNaN(price)) {
    return json({ errors: { price: "Price is required" } }, { status: 400 });
  }
  const categoryId = formData.get("categoryId");
  if (typeof categoryId !== "string" || categoryId.length === 0) {
    return json(
      { errors: { categoryId: "CategoryId is required" } },
      { status: 400 }
    );
  }

  const newMenuItem = await createMenuItem({ item, price, categoryId });

  return redirect(`/menu-items/${newMenuItem.id}`);
}

export async function loader() {
  const categories = await getMenuCategories();
  return json({ categories });
}

export default function NewMenuItemPage() {
  const { categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const itemRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  const categoryIdRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.item) {
      itemRef.current?.focus();
    } else if (actionData?.errors?.price) {
      priceRef.current?.focus();
    } else if (actionData?.errors?.categoryId) {
      categoryIdRef.current?.focus();
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
          <span>Item: </span>
          <input
            ref={itemRef}
            name="item"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "item-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.item && (
          <div className="pt-1 text-red-700" id="item-error">
            {actionData.errors.item}
          </div>
        )}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Price: </span>
          <input
            ref={priceRef}
            name="price"
            type="number"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "price-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.price && (
          <div className="pt-1 text-red-700" id="price-error">
            {actionData.errors.price}
          </div>
        )}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Category: </span>
          <select
            ref={categoryIdRef}
            name="categoryId"
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.categoryId ? true : undefined}
            aria-errormessage={
              actionData?.errors?.categoryId ? "categoryId-error" : undefined
            }
          >
            <option value="">Select Category</option>
            {categories.map((x) => (
              <option key={x.id} value={x.id}>
                {x.category}
              </option>
            ))}
          </select>
        </label>
        {actionData?.errors?.categoryId && (
          <div className="pt-1 text-red-700" id="categoryId-error">
            {actionData.errors.categoryId}
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
