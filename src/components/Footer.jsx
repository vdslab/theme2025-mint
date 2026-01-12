export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-content">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Precure viz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
