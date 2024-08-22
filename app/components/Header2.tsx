export default function Header2() {
  return (
    <div className="bg-yellow-300 flex items-center py-2 px-2">
      <a className="flex flex-1 gap-3" href="/map">
        <img className="h-12" src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Keystone_state_symbol_Pennsylvania.svg" alt="" />
        <h1 className="text-4xl">pgh.coffee</h1>
      </a>
      <a href="/about">About</a>
    </div>
  )
}
