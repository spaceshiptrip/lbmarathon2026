export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <p>2XU Long Beach Marathon · October 11, 2026 · 5:30am · Shoreline Drive, Long Beach CA</p>
      <p className="mt-1">
        <a
          href="https://www.runlongbeach.com/marathon"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-600"
        >
          Official race website ↗
        </a>
      </p>
    </footer>
  );
}
