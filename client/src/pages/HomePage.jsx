import { ArrowRight, BarChart3, Brain, CreditCard, Shield, Zap, Layers, Users, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export function HomePage() {
  const { userInfo } = useSelector((state) => state.user);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 flex justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="space-y-4 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                >
                  <Zap className="mr-2 h-3.5 w-3.5 fill-primary" />
                  Experience Financial Clarity
                </motion.div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Simplify Your Finances with{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    ExpenseEase
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                  Track expenses, gain AI-powered insights, and take total control 
                   of your financial future with our premium management platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {userInfo ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.98] gap-2"
                  >
                    <LayoutDashboard size={20} />
                    Go to Dashboard
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/sign-up"
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.98]"
                    >
                      Get Started for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/sign-in"
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-base font-semibold transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-muted/30 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Powerful Features for Modern Tracking
              </h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Everything you need to manage your money in one beautiful, 
                intuitive dashboard.
              </p>
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  icon: CreditCard,
                  title: "Real-time Tracking",
                  description: "Instantly log and categorize every transaction with ease."
                },
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  description: "Beautifully visualized data to help you understand spending habits."
                },
                {
                  icon: Brain,
                  title: "AI Financial Advice",
                  description: "Personalized insights powered by Google's Gemini API."
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Your financial data is encrypted and always under your control."
                },
                {
                  icon: Layers,
                  title: "Custom Categories",
                  description: "Tailor your tracking with personalized expense categories."
                },
                {
                  icon: Users,
                  title: "Party Management",
                  description: "Track money owed or lent to specific contacts or businesses."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={item}
                  className="group relative flex flex-col p-8 rounded-3xl bg-background border transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Section */}
        <section className="w-full py-24 flex justify-center items-center overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-indigo-500/10 text-indigo-500 ring-1 ring-inset ring-indigo-500/20">
                  <Brain className="mr-2 h-3.5 w-3.5" />
                  Powered by Gemini AI
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
                  Gain Deep Insights with{" "}
                  <span className="text-indigo-500">AI Analytics</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Leverage Google&apos;s most capable AI to scan your spending patterns. 
                  Get automated advice on how to save more, spend wiser, and reach 
                  your financial goals faster.
                </p>
                <ul className="space-y-4">
                  {[
                    "Personalized monthly budget advice",
                    "Spending anomaly detection",
                    "Future expense predictions"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-indigo-500" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative flex justify-center lg:justify-end"
              >
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative group overflow-hidden rounded-[3rem] border bg-card p-2 shadow-2xl transition-transform hover:scale-[1.02]">
                   <img 
                    src="/gemini.png" 
                    alt="Gemini AI Visualization" 
                    className="rounded-[2.5rem] w-full max-w-[400px] h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-12 md:p-24 rounded-[4rem] bg-zinc-900 text-white overflow-hidden text-center border border-white/5 shadow-2xl"
            >
              {/* Animated Background Elements */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl font-black tracking-tight sm:text-6xl leading-[1.1] text-white">
                  Ready to Take Control of Your Money?
                </h2>
                <p className="text-zinc-400 text-lg md:text-xl font-medium">
                  Join thousands of users who have optimized their finances with 
                  ExpenseEase. Start your journey today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link
                    to={userInfo ? "/dashboard" : "/sign-up"}
                    className="h-16 px-12 rounded-2xl bg-white text-zinc-950 text-xl font-black shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    {userInfo ? "Go to Dashboard" : "Join Now"}
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/assets/logo/expense-ease-without-bg-svg/1.svg" className="h-8 w-8" alt="logo" />
            <span className="text-xl font-bold tracking-tight">ExpenseEase</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ExpenseEase. Designed for financial freedom.
          </p>
          <div className="flex gap-6">
            <Link to="https://github.com/irahuldutta02" className="text-sm font-medium hover:text-primary underline-offset-4 hover:underline transition-colors">GitHub</Link>
            <Link to="https://www.linkedin.com/in/irahuldutta02" className="text-sm font-medium hover:text-primary underline-offset-4 hover:underline transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
