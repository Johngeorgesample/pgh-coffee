export default function InTheMedia() {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-32">
      <article className="flex flex-col items-center space-y-8 bg-black p-12 rounded-3xl text-white">
      <span className="text-yellow-300 text-sm font-bold uppercase tracking-widest">Recognition</span>
      <h2 className="text-4xl italic font-serif">
        &quot;There&apos;s a host of little reasons why a smaller or newer shop isn&apos;t known that could easily be answered by
        storytelling like pgh.coffee.&quot;
      </h2>
      <p className="text-slate-400">
        - TJ Fairchild, owner of Commonplace Coffee, in{' '}
        <a className="text-yellow-300 underline decoration-dashed underline-offset-6 hover:text-slate-500" href="https://technical.ly/software-development/pittsburgh-coffee-shops-interactive-map-open-source/" target="_blank" rel="noopener noreferrer">
          Technical.ly
        </a>
      </p>
    </article>
    </div>
  )
}
