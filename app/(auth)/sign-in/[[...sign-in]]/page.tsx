import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Truck } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Truck className="h-8 w-8 text-orange-500" />
          <span className="text-2xl font-bold gradient-text">
            Compliance Buddy
          </span>
        </Link>
        <p className="text-muted-foreground mt-2">
          Welcome back! Sign in to your account
        </p>
      </div>

      {/* Clerk Sign In Component */}
      <div className="flex justify-center">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-2xl",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-accent border-border text-foreground hover:bg-accent/80",
              socialButtonsBlockButtonText: "text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-orange-500 hover:text-orange-400",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-orange-500 hover:text-orange-400",
              formButtonPrimary: "bg-orange-600 hover:bg-orange-700 text-white",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              alertText: "text-foreground",
              formFieldErrorText: "text-red-500",
              footerActionText: "text-muted-foreground"
            },
            variables: {
              colorPrimary: "#F97316",
              colorBackground: "hsl(var(--card))",
              colorInputBackground: "hsl(var(--background))",
              colorInputText: "hsl(var(--foreground))",
              colorText: "hsl(var(--foreground))",
              colorTextSecondary: "hsl(var(--muted-foreground))",
              colorNeutral: "hsl(var(--muted))",
              colorShimmer: "hsl(var(--accent))",
              borderRadius: "0.5rem"
            }
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Don not have an account?{' '}
          <Link href="/sign-up" className="text-orange-500 hover:text-orange-400 font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}