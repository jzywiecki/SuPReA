import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page"  style={{ height: 'calc(100vh - 68*4px)'}} className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-2">Sorry, an unexpected error has occurred.</p>
      <p className="text-sm text-gray-500 italic">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}