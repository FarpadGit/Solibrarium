export default function BookCardSkeleton() {
  return (
    <div className="book_card">
      <div className="flex space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:items-center ml-6 w-11/12">
        <div className="flex self-center items-center justify-center w-[45%] h-[45%] m-3 bg-gray-400 rounded md:w-96 md:h-auto md:m-0 dark:bg-gray-700">
          <svg
            className="w-[200px] h-[200px] text-gray-300 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="items-center justify-center h-9/10 w-1/2 md:w-3/4 lg:w-full">
          <div className="h-5 bg-gray-400 rounded-full dark:bg-gray-500 w-7/12 my-4 md:w-40"></div>
          <div className="h-5 bg-gray-400 rounded-full dark:bg-gray-500 w-30 my-4 lg:w-11/12"></div>
          <div className="h-5 bg-gray-400 rounded-full dark:bg-gray-500 w-10/12 my-4 lg:w-96"></div>
          <br />
          <br />
          <div className="h-4 bg-gray-400 rounded-full dark:bg-gray-500 my-2.5"></div>
          <div className="h-4 bg-gray-400 rounded-full dark:bg-gray-500 my-2.5"></div>
          <div className="h-4 bg-gray-400 rounded-full dark:bg-gray-500 my-2.5"></div>
          <div className="h-4 bg-gray-400 rounded-full dark:bg-gray-500 my-2.5"></div>
          <div className="h-4 bg-gray-400 rounded-full dark:bg-gray-500 max-w-[40%]"></div>
        </div>
        <span className="sr-only">Betöltés...</span>
      </div>
    </div>
  );
}
