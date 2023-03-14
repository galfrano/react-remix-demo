import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deleteMenuCategory,
  getMenuCategory,
} from "~/models/menu-category.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.categoryId, "categoryId not found");

  const category = await getMenuCategory({ id: params.categoryId });
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ category });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.categoryId, "categoryId not found");

  await deleteMenuCategory({ id: params.categoryId });

  return redirect("/categories");
}

export default function CategoryDetailsPage() {
  const { category } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{category.category}</h3>
      <p className="py-6">{category.type}</p>
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
    return <div>Category not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
