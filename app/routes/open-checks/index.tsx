import { Link } from "@remix-run/react";

export default function CategoryIndexPage() {
  return (
    <p>
      No check selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new check.
      </Link>
    </p>
  );
}
