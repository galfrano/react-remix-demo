import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getMenuCategory } from "~/models/menu-category.server";
import { deleteMenuItem, getMenuItem } from "~/models/menu-item.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.menuItemId, "menuItemId not found");
  const menuItem = await getMenuItem({ id: params.menuItemId });
  const category = await getMenuCategory(menuItem.categoryId);
  if (!menuItem) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ menuItem, category });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.menuItemId, "menuItemId not found");

  await deleteMenuItem({ id: params.menuItemId });

  return redirect("/menu-items");
}

export default function MenuItemDetailsPage() {
  const { menuItem, category } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{menuItem.item}</h3>
      <p className="py-6">{menuItem.price}</p>
      <p className="py-6">{category.category}</p>

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
    return <div>Menu Item not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
