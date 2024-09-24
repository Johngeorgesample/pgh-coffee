interface IProps {
  question: string
  answer: string
}

export default function QandA(props: IProps) {
  return (
    <div  className="mb-2 text-sm leading-6">
      <p className="font-semibold">{props.question}</p>
      <p>{props.answer}</p>
    </div>
  )
}
