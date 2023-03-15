import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getMenuCategories } from "~/models/menu-category.server";
// import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { ManagerMenuBar } from "~/common/manager-menu-bar";

export async function loader({ request }: LoaderArgs) {
  // const userId = await requireUserId(request);
  // TODO: user seggregation
  const list = await getMenuCategories();
  return json({ list });
}

export default function CategoriesPage() {
  const { list } = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        {ManagerMenuBar()}
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Category
          </Link>

          <hr />

          {list.length === 0 ? (
            <p className="p-4">No categories yet</p>
          ) : (
            <ol>
              {list.map((category) => (
                <li key={category.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={category.id}
                  >
                    📝 {category.category}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
