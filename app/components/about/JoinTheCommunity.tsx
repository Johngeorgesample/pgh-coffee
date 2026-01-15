import { MessagesSquare, Share2, Store } from 'lucide-react'

export default function JoinTheCommunity() {
  return (
    <section className="space-y-12 bg-yellow-300/5 px-6 py-20 rounded-[3rem]">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tight">Join the Community</h2>
        <p className="text-slate-600  text-lg">
          Want to help make Pittsburgh&apos;s coffee scene even better? Here are a few ways you can get involved.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100  space-y-4">
          <div className="w-12 h-12 bg-yellow-300 rounded-xl flex items-center justify-center">
            <Store />
          </div>
          <h3 className="font-bold text-xl">Submit a Shop</h3>
          <p className="text-slate-500  text-sm leading-relaxed">
            Know a hidden gem I missed? Tell me about it and help others find their next favorite spot.
          </p>
          <button className="w-full py-2 bg-yellow-300 text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
            Tell me
          </button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100  space-y-4">
          <div className="w-12 h-12 bg-yellow-300 rounded-xl flex items-center justify-center">
            <MessagesSquare />
          </div>
          <h3 className="font-bold text-xl">Provide Feedback</h3>
          <p className="text-slate-500  text-sm leading-relaxed">
            Have an idea to improve the site? I&apos;m always listening to how the site can serve you better.
          </p>
          <button className="w-full py-2 bg-yellow-300 text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
            Share ideas
          </button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100  space-y-4">
          <div className="w-12 h-12 bg-yellow-300 rounded-xl flex items-center justify-center">
            <Share2 />
          </div>
          <h3 className="font-bold text-xl">Spread the Word</h3>
          <p className="text-slate-500  text-sm leading-relaxed">
            Encourage others to explore local. Follow pgh.coffee and share your visits with the tag #pghcoffee.
          </p>
        </div>
      </div>
    </section>
  )
}
