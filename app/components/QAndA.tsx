interface IProps {
  question: string
  answer: string
}

export default function QandA(props: IProps) {
  return (
    <div  className="mb-2">
      <p className="font-bold">{props.question}</p>
      <p>{props.answer}</p>
    </div>
  )
}
