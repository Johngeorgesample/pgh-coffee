const LoggedStamp = ({ step, justSaved }: { step: number; justSaved: boolean }) => (
  <span className="absolute top-0 right-5 -translate-y-1/2">
    <span
      className={`block -rotate-6 rounded-lg border-4 border-gray-950 bg-yellow-300 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-950 shadow-[3px_3px_0_#030712] ${
        justSaved ? 'animate-stamp motion-reduce:animate-none' : ''
      }`}
    >
      Logged · Day {String(step).padStart(2, '0')}
    </span>
  </span>
)

export default LoggedStamp
