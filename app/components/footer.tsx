export function Footer() {
  return (
    <>
      <footer className="flex min-h-[80px] items-center justify-center">
        <div className="flex items-center">
          <p className="flex items-center whitespace-nowrap text-center text-sm font-medium text-gray-600">
            Expense Sheet by
            <a
              href="https://www.ommiputera.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center ml-1 font-semibold text-gray-800 transition duration-200 hover:-translate-y-1"
            >
              Ommi Putera
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
