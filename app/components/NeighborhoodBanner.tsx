interface IProps {
  neighborhood: string
}

export default function NeighborhoodBanner(props: IProps) {
  return <div className="w-full bg-yellow-200 px-4 py-2 my-4">{props.neighborhood}</div>
}
