import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  MessageSquareText,
  Globe2,
  CheckCircle2,
  Star,
  Quote,
  Brain,
  Target,
  Users,
  TrendingUp,
} from 'lucide-react';
import Logo from '../components/Logo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-60 dark:opacity-20"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-lime-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-lime-400 rounded-full blur-3xl opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-700 text-xs font-bold mb-6 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PAKISTAN'S #1 AI INTERVIEW COACH</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-darkgreen dark:text-lime-100 leading-[1.05] mb-4">
                Pakistan's First <span className="text-lime-600 dark:text-lime-400">AI Interview</span> Coach
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
                Practice real mock interviews with instant AI feedback. Improve your confidence and land your dream job in Pakistan.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/select-job" className="btn-primary text-lg px-8 py-4 animate-pulse-slow">
                  Start Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/select-job" className="btn-secondary text-lg px-8 py-4">
                  How it Works
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>No signup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-right">
              <div className="relative card-static p-8 bg-gradient-to-br from-lime-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="space-y-4">
                  <ChatPreview
                    who="AI Coach"
                    text="Welcome! Your first interview question: Tell me about yourself."
                    lime
                  />
                  <ChatPreview who="You" text="My name is Ahmed. I graduated with a degree in Computer Science..." align="right" />
                  <ChatPreview
                    who="AI Coach"
                    text="Great answer! Now, where do you see yourself in 5 years?"
                    lime
                  />
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border-2 border-lime-200 dark:border-gray-600 rounded-xl">
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce-gentle"></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is typing...</span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-lime-500 rounded-2xl flex items-center justify-center shadow-lime-lg animate-bounce-gentle">
                  <Brain className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-darkgreen dark:bg-gray-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat icon={<Users className="w-6 h-6" />} value="10,000+" label="Interviews Practiced" />
            <Stat icon={<Star className="w-6 h-6" />} value="95%" label="User Satisfaction" />
            <Stat icon={<Target className="w-6 h-6" />} value="500+" label="Questions Bank" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-700 text-xs font-bold mb-4 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-400">
              WHY ROZGAR COACH
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-darkgreen dark:text-lime-100 mb-3">
              Interview Prep, <span className="text-lime-600 dark:text-lime-400">Reimagined</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquareText className="w-7 h-7 text-white" />}
              title="Mock Interview"
              desc="Practice 10 real interview questions tailored to your target job category in Pakistan."
              delay="stagger-1"
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7 text-white" />}
              title="Real-time AI Feedback"
              desc="Get instant scoring on communication, technical knowledge, and confidence after every answer."
              delay="stagger-2"
            />
            <FeatureCard
              icon={<Globe2 className="w-7 h-7 text-white" />}
              title="Interview Practice"
              desc="Practice with AI-powered mock interviews designed for the Pakistani job market."
              delay="stagger-3"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-lime-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-darkgreen dark:text-lime-100 mb-3">
              What Pakistani Job Seekers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              name="Ayesha Khan"
              role="FPSC Aspirant, Lahore"
              avatar="AK"
              text="Rozgar Coach boosted my confidence tremendously! My real FPSC interview went really well. The AI feedback showed me exactly where to improve."
              delay="stagger-1"
            />
            <Testimonial
              name="Hassan Raza"
              role="Software Engineer, Karachi"
              avatar="HR"
              text="I practiced 5 mock interviews before my HBL interview. The IT questions were exactly what real interviewers asked. Landed the job on first attempt!"
              delay="stagger-2"
            />
            <Testimonial
              name="Fatima Malik"
              role="Banking OG-1, Islamabad"
              avatar="FM"
              text="The AI feedback is amazing. I practiced daily and the platform gave me detailed scores on every answer. Very helpful for interview preparation!"
              delay="stagger-3"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-static bg-gradient-to-br from-lime-50 to-lime-100 dark:from-gray-800 dark:to-gray-900 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-lime-300 rounded-full blur-3xl opacity-40"></div>
            <div className="relative">
              <TrendingUp className="w-12 h-12 text-lime-600 dark:text-lime-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-darkgreen dark:text-lime-100 mb-3">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-lime-700 dark:text-lime-400 mb-8">Start practicing today and ace your next interview.</p>
              <Link to="/select-job" className="btn-primary text-lg px-10 py-4">
                Start Your First Interview
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-darkgreen dark:bg-gray-950 text-lime-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="lg" className="mb-3" textLight />
              <p className="text-sm text-lime-200/80 max-w-sm leading-relaxed">
                Pakistan's first AI-powered interview coach. Built to help fresh graduates and job seekers
                prepare for interviews with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-lime-200/80">
                <li><Link to="/select-job" className="hover:text-lime-300">Mock Interview</Link></li>
                <li><Link to="/feedback" className="hover:text-lime-300">Feedback Report</Link></li>
                <li><Link to="/select-job" className="hover:text-lime-300">All Job Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-lime-200/80">
                <li>support@rozgarcoach.pk</li>
                <li>Lahore, Pakistan</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-lime-800 text-center text-xs text-lime-300/70">
            © 2026 Rozgar Coach. Empowering Pakistani job seekers with AI.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChatPreview({ who, text, align, lime }: { who: string; text: string; align?: 'right'; lime?: boolean }) {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          lime
            ? 'bg-lime-500 text-white rounded-tl-sm'
            : 'bg-white border border-gray-200 text-darkgreen dark:bg-gray-800 dark:border-gray-600 dark:text-lime-100 rounded-tr-sm'
        }`}
      >
        <div className={`text-[10px] font-bold uppercase mb-0.5 ${lime ? 'text-lime-100' : 'text-lime-700 dark:text-lime-400'}`}>
          {who}
        </div>
        <p className="leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-lime-100">
      <div className="w-12 h-12 bg-lime-500/20 rounded-xl flex items-center justify-center text-lime-300">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-extrabold text-white">{value}</div>
        <div className="text-xs uppercase tracking-wider text-lime-300/80">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div className={`card animate-fade-up ${delay} group hover:-translate-y-1`}>
      <div className="w-14 h-14 rounded-xl bg-lime-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lime">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-darkgreen dark:text-lime-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function Testimonial({
  name,
  role,
  avatar,
  text,
  delay,
}: {
  name: string;
  role: string;
  avatar: string;
  text: string;
  delay: string;
}) {
  return (
    <div className={`card bg-white dark:bg-gray-900 animate-fade-up ${delay}`}>
      <Quote className="w-8 h-8 text-lime-300 dark:text-lime-600 mb-3" />
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{text}</p>
      <div className="flex items-center gap-3 pt-3 border-t border-lime-100 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-darkgreen dark:text-lime-100 text-sm">{name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{role}</div>
        </div>
        <div className="ml-auto flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
