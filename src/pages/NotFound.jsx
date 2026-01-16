import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "1rem" }} >
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
