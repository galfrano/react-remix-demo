import { Link } from "@remix-run/react";

export default function MenuItemIndexPage() {
  return (
    <p>
      No Menu Item selected. Select a Menu Item on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new Menu Item.
      </Link>
    </p>
  );
}
