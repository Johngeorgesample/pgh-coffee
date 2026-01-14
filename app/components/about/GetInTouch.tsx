export default function GetInTouch() {
  return (
    <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20">
      <h3 className="text-xl font-bold mb-6">Get in Touch</h3>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400 mb-1">Email</p>
          <a
            className="text-lg font-medium hover:text-primary transition-colors underline decoration-primary/30"
            href="mailto:johngeorgesample@gmail.com"
          >
            johngeorgesample@gmail.com
          </a>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-400 mb-1">Social Media</p>
          <a
            className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
            href="#"
          >
            <span className="material-icons-outlined text-sm">camera_alt</span> @pgh.coffee
          </a>
        </div>
      </div>
    </div>
  )
}
