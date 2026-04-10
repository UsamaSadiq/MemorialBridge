export default function VerifyEmailPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <div className="text-center py-4 px-4 bg-warning">
          <h2 className="text-xl font-bold text-text mb-1">
            <i className="fas fa-envelope-open-text mr-2" />Email Verification
          </h2>
          <p className="text-text-secondary">Please verify your email address to continue</p>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6 animate-pulse-scale">
            <i className="fas fa-envelope text-6xl text-warning" />
          </div>

          <h4 className="text-xl text-primary font-semibold mb-3">Almost There!</h4>

          <p className="text-text-muted mb-4">
            We&apos;ve sent a verification link to your email. Please check your email and click the verification link to activate your account.
          </p>

          <div className="rounded-lg bg-accent/10 border-l-4 border-accent px-4 py-3 text-accent-dark mb-4 text-left">
            <i className="fas fa-info-circle mr-2" />
            <strong>Note:</strong> This is a simulated verification process for the MVP.
          </div>

          <form className="mb-4">
            <button type="submit" className="inline-flex items-center px-6 py-3 rounded-md bg-[#168E47] text-white text-lg font-medium hover:bg-[#0f6b36] transition-colors">
              <i className="fas fa-check-circle mr-2" />Simulate Email Verification
            </button>
          </form>

          <div className="text-sm text-text-muted space-y-2">
            <p>Didn&apos;t receive the email? Check your spam folder or <a href="#" className="text-primary">resend verification email</a></p>
            <p>Need help? <a href="#" className="text-primary">Contact support</a></p>
          </div>
        </div>
      </div>

      {/* After Verification */}
      <div className="mt-4 bg-surface-muted rounded-lg p-4">
        <h6 className="font-bold text-primary mb-3"><i className="fas fa-star mr-2" />After Verification</h6>
        <ul className="space-y-2">
          {[
            "Create unlimited memorials",
            "Share memories and photos",
            "Access your personal dashboard",
            "Contribute to other memorials",
          ].map((item) => (
            <li key={item}><i className="fas fa-check text-success mr-2" />{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
