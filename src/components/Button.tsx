interface ButtonProps {
  text: string;
}

function Button(props: ButtonProps) {
  return (
    <button className="px-5 py-2 bg-black text-white font-medium rounded-md hover:bg-blue-700 transition-colors">{props.text}</button>
  )
}

export default Button;