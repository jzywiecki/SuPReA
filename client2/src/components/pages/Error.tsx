import { Link } from 'react-router-dom';

const getErrorInfo = (code: string | number) => {

    const errorCodeStr = String(code);

    switch (errorCodeStr) {
        case '404':
            return {
                title: 'Page not found',
                message: 'Sorry, we couldn’t find the page you’re looking for.'
            };
        case '500':
            return {
                title: 'Internal Server Error',
                message: 'Oops! Something went wrong on our end. Please try again later.'
            };
        case '403':
            return {
                title: 'Forbidden',
                message: 'You do not have permission to access this page.'
            };
        case '401':
            return {
                title: 'Unauthorized',
                message: 'You dont have a permissions to this section.'
            };
        case '400':
            return {
                title: 'Bad Request',
                message: 'The request could not be understood by the server due to malformed syntax.'
            };
        default:
            return {
                title: 'Error',
                message: 'An unexpected error occurred.'
            };
    }
};

const Error = ({ errorCode }) => {

    const { title, message } = getErrorInfo(errorCode);

    return (
        <>
            <div className="relative isolate px-6 lg:px-8">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>

                <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        <p className="text-base font-semibold text-indigo-600">{errorCode}</p>
                        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                            {message}
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Go back home
                            </Link>
                        </div>
                    </div>
                </main>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Error;
