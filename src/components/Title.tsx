interface TitleProps {
  text: string;
}

function Title(props: TitleProps) {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-semibold tracking-tight text-white leading-tight text-center" style={{ WebkitTextStroke: 'clamp(1px, 0.2vw, 7px) black' }}>
      {props.text}
    </h1>
  );
}

export default Title;
