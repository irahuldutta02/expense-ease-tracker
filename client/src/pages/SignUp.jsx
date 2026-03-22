import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/userApiSlice";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await register({ name, email, password }).unwrap();
      toast.success("Account created! Please sign in.");
      navigate("/sign-in");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
              <p className="text-muted-foreground text-sm font-medium">
                Join ExpenseEase and start tracking
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold ml-1 text-foreground/80 group-focus-within:text-primary transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-bold ml-1 text-foreground/80 group-focus-within:text-primary transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold ml-1 text-foreground/80 group-focus-within:text-primary transition-colors">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-bold ml-1 text-foreground/80 group-focus-within:text-primary transition-colors">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign Up <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-primary font-bold hover:underline transition-all underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border-t text-center">
            <Link 
              to="/" 
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
