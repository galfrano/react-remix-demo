import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getMenuCategories } from "~/models/menu-category.server";
import { getMenuItems, getMenuItem } from "~/models/menu-item.server";
import { getCheck } from "~/models/check.server";
import { getCheckItems, createCheckItem } from "~/models/check-item.server";
import { getTable } from "~/models/table.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.checkId, "checkId not found");
  const url = new URL(request.url);
  const categories = await getMenuCategories();
  const categoryId = url.searchParams.get("category");
  //  const items = categoryId == null ? [] : await getMenuItemsByCategory(categoryId);
  const allItems = await getMenuItems();
  const check = await getCheck({ id: params.checkId });
  if (!check) {
    throw new Response("Not Found", { status: 404 });
  }
  const itemsOnCheck = await getCheckItems({ checkId: params.checkId });
  const table = await getTable({ id: check.tableId });
  if (!table) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ check, table, categories, allItems, itemsOnCheck, categoryId });
}

export async function action({ request, params }: ActionArgs) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("category");
  const formData = await request.formData();
  const userId = await requireUserId(request);
  invariant(params.checkId, "checkId not found");
  const menuItemId = formData.get("item");
  const fullItem = await getMenuItem({ id: menuItemId });
  if (fullItem != null) {
    await createCheckItem({
      price: fullItem.price,
      menuItemId,
      checkId: params.checkId,
    });
    return redirect("?category=" + categoryId);
  }
}

export default function CategoryDetailsPage() {
  const { check, table, categories, allItems, itemsOnCheck, categoryId } =
    useLoaderData<typeof loader>();
  const items = allItems.filter((i) => i.categoryId == categoryId);
  const total = itemsOnCheck.reduce((acc, curr) => (acc += curr.price), 0);
  return (
    <div>
      <h3 className="text-2xl font-bold">
        {check.createdAt} - {table.table}
      </h3>
      <p className="py-6">{check.note}</p>
      <hr className="my-4" />

      <Form method="get">
        {categories.map((c) => (
          <button
            type="submit"
            name="category"
            value={c.id}
            className={`mr-5 rounded  bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400`}
          >
            {c.category}
          </button>
        ))}
      </Form>
      <hr className="mb-10 mt-5" />
      <Form method="post">
        {items.map((i) => (
          <button
            type="submit"
            name="item"
            value={i.id}
            className="mr-5 rounded  bg-green-500 py-2 px-4 text-white hover:bg-green-600 focus:bg-green-400"
          >
            {i.item}
            <span className="ml-3 text-xs">{i.price}</span>
          </button>
        ))}
      </Form>
      <hr className="mb-10 mt-5" />
      <h1 className="text-2xl font-bold">Summary</h1>
      <div>
        {itemsOnCheck.map((ioc) => (
          <div key={ioc.id}>
            <span>{allItems.find((ai) => ai.id == ioc.menuItemId).item}</span>
            <span className="ml-5">{ioc.price}</span>
          </div>
        ))}
      </div>
      <hr />
      <h3 className="text-2xl font-bold">Total {total}</h3>
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
    return <div>Category not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
