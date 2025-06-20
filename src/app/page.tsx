"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Redirecting to dashboard
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with mouse parallax */}
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
          }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          }}
        ></div>
        <div 
          className="absolute -bottom-8 left-20 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`
          }}
        ></div>
        
        {/* Floating geometric shapes with parallax */}
        <div 
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px) rotate(45deg)`
          }}
        >
          <div className="w-8 h-8 border-2 border-blue-200 animate-float animation-delay-1000"></div>
        </div>
        <div 
          className="absolute top-3/4 right-1/4 transform translate-x-1/2 translate-y-1/2 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}
        >
          <div className="w-6 h-6 bg-purple-200 rounded-full animate-float animation-delay-3000"></div>
        </div>
        <div 
          className="absolute top-1/2 left-3/4 transform translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
          }}
        >
          <div className="w-4 h-12 bg-pink-200 rounded-full animate-float animation-delay-5000"></div>
        </div>
        
        {/* Additional subtle parallax elements */}
        <div 
          className="absolute top-10 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 transition-transform duration-1200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 transition-transform duration-1200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 18}px, ${mousePosition.y * 18}px)`
          }}
        ></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4 backdrop-blur-sm bg-white/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/CGO-logo.png"
                alt="CitizenGO"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </div>
          </div>
          <button
            onClick={() => signIn("google")}
            className="bg-[#4585f4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3367d6] transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="inline-block animate-fade-in-up">Automate your</span>
                <br />
                <span className="text-gray-600 inline-block animate-fade-in-up animation-delay-300">campaign naming</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg animate-fade-in-up animation-delay-600">
                Streamline campaign creation with automated naming conventions and seamless Iterable & Asana integration.
              </p>
            </div>

            <div className="flex items-center space-x-4 animate-fade-in-up animation-delay-900">
              <button
                onClick={() => signIn("google")}
                className="group bg-[#4585f4] hover:bg-[#3367d6] text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center space-x-3 hover:shadow-xl hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path fill="#FFFFFF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#FFFFFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FFFFFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#FFFFFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="relative z-10">Get started</span>
              </button>
              <div className="text-sm text-gray-500 animate-pulse">
                @citizengo.net accounts only
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2 group animate-fade-in-up animation-delay-1200">
                <div className="flex items-center space-x-3 transition-transform duration-300 group-hover:translate-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-700 transition-colors duration-300 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Smart naming</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Automatically generate standardized campaign names following CitizenGO conventions with intelligent patterns</p>
              </div>
              
              <div className="space-y-2 group animate-fade-in-up animation-delay-1400">
                <div className="flex items-center space-x-3 transition-transform duration-300 group-hover:translate-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-green-100 group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-700 transition-colors duration-300 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Iterable sync</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Seamlessly create campaigns in Iterable with proper audience targeting and automated workflow setup</p>
              </div>
              
              <div className="space-y-2 group animate-fade-in-up animation-delay-1600">
                <div className="flex items-center space-x-3 transition-transform duration-300 group-hover:translate-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-700 transition-colors duration-300 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Asana tasks</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Auto-generate tracking tasks in your Asana projects with proper assignments and deadlines for campaign monitoring</p>
              </div>
              
              <div className="space-y-2 group animate-fade-in-up animation-delay-1800">
                <div className="flex items-center space-x-3 transition-transform duration-300 group-hover:translate-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-orange-100 group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-700 transition-colors duration-300 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">UTM tracking</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Configure comprehensive UTM parameters for detailed campaign analytics and performance tracking across all channels</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-600">
            <div className="relative group">
              {/* Main dashboard mockup */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl w-96 h-[520px] relative overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-105">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Campaign Dashboard</div>
                      <div className="text-xs text-gray-500">Real-time overview</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-300 hover:bg-blue-50 hover:scale-105">
                    <div className="text-2xl font-bold text-gray-900 animate-count-up">1,247</div>
                    <div className="text-xs text-gray-500">Campaigns</div>
                    <div className="text-xs text-green-600 font-medium animate-bounce">+12% this week</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-300 hover:bg-green-50 hover:scale-105">
                    <div className="text-2xl font-bold text-gray-900 animate-count-up">98.2%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                    <div className="text-xs text-green-600 font-medium animate-bounce animation-delay-300">+2.1% improved</div>
                  </div>
                </div>

                {/* Recent Campaign */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 mb-4 transition-all duration-300 hover:from-blue-900 hover:to-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white text-sm font-semibold">Latest Campaign</div>
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">Active</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 mb-4 transition-all duration-300 hover:bg-white/20">
                    <div className="text-white/90 text-sm font-mono animate-typing">
                      CG_2024_EMAIL_PETITION_CLIMATE_ACTION_EU
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-2">
                      <span className="text-white/70 text-xs">Iterable Campaign</span>
                      <svg className="w-4 h-4 text-green-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-2">
                      <span className="text-white/70 text-xs">Asana Task</span>
                      <svg className="w-4 h-4 text-green-400 animate-pulse animation-delay-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between transition-all duration-300 hover:translate-x-2">
                      <span className="text-white/70 text-xs">UTM Parameters</span>
                      <svg className="w-4 h-4 text-green-400 animate-pulse animation-delay-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-[#4585f4] hover:bg-[#3367d6] text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10">Create New Campaign</span>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                    View All Campaigns
                  </button>
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none animate-pulse"></div>
              </div>

              {/* Floating elements with enhanced animations */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 z-10 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">Integration</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">All systems synced</div>
              </div>

              <div className="absolute -bottom-4 -left-20 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 z-10 animate-float animation-delay-2000">
                <div className="text-xs text-gray-500">Today</div>
                <div className="text-lg font-bold text-gray-900">23</div>
                <div className="text-xs text-gray-500">campaigns created</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-typing {
          animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
          overflow: hidden;
          border-right: 3px solid rgba(255,255,255,0.75);
          white-space: nowrap;
        }
        .animate-count-up {
          animation: countUp 2s ease-out;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        .animation-delay-1400 {
          animation-delay: 1.4s;
        }
        .animation-delay-1600 {
          animation-delay: 1.6s;
        }
        .animation-delay-1800 {
          animation-delay: 1.8s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: rgba(255,255,255,0.75);
          }
        }

        @keyframes countUp {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
