import { Link } from "@remix-run/react";

export default function TableIndexPage() {
  return (
    <p>
      No Table selected. Select a Table on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new Table.
      </Link>
    </p>
  );
}
