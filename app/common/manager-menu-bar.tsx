import { Link } from "@remix-run/react";

export const ManagerMenuBar = () => (
  <div>
    <Link class="mr-6" to="/menu-categories">
      Menu Categories
    </Link>
    <Link class="mr-6" to="/menu-items ">
      Menu Items
    </Link>
    <Link class="mr-6" to="/tables">
      Tables
    </Link>
    <Link class="mr-6" to="/open-checks">
      Checks
    </Link>
  </div>
);
