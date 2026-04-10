export default function Footer() {
  return (
    <footer className="bg-gradient-nav text-text">
      <div className="border-t border-border-light/25">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h5 className="text-lg font-semibold text-primary mb-1">
                <i className="fas fa-heart mr-2" />MemorialBridge
              </h5>
              <p className="text-sm text-text-muted">
                Preserving Memories, Honoring Lives
              </p>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/MemorialBridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-lg hover:scale-110 transition-transform"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook" />
              </a>
              <a
                href="#"
                className="text-primary text-lg hover:scale-110 transition-transform"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                href="https://www.instagram.com/the.memorial.bridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-lg hover:scale-110 transition-transform"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-text-muted">
                &copy; 2025 MemorialBridge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
