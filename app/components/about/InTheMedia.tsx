export default function InTheMedia() {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-32">
      <article className="flex flex-col align-center items-center space-y-8 bg-black p-12 rounded-3xl text-white">
      <span className="text-primary text-yellow-400 text-sm font-bold uppercase tracking-widest">Recognition</span>
      <h2 className="text-4xl font-display italic font-serif">
        &quot;There&apos;s a host of little reasons why a smaller or newer shop isn&apos;t known that could easily be answered by
        storytelling like pgh.coffee.&quot;
      </h2>
      <p className="text-slate-400">
        - TJ Fairchild, owner of Commonplace Coffee, in {' '}
        <a className="text-primary underline decoration-dashed underline-offset-6 hover:text-slate-500" href="https://technical.ly/software-development/pittsburgh-coffee-shops-interactive-map-open-source/" target="_blank">
          Technical.ly
        </a>
      </p>
      <p className="text-slate-400"></p>
    </article>
    </div>
  )
}
