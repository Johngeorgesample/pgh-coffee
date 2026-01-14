export default function SubmitAShopCTA() {
  return (
    <section className="bg-primary text-black py-24 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
          Know a coffee shop we missed?
        </h2>
        <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto">
          Help us build the ultimate directory of Pittsburgh&apos;s vibrant coffee scene. One shop
          at a time.
        </p>
        <button
          type="button"
          className="bg-black text-white px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-xl"
        >
          <span className="material-icons-outlined">local_cafe</span> Submit a Shop Now
        </button>
      </div>
    </section>
  )
}
