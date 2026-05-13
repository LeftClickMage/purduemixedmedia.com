interface TitleProps {
  text: string;
  fontFamily?: string;
}

function Title({ text, fontFamily }: TitleProps) {
  return (
    <h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-semibold tracking-tight text-white leading-tight text-center whitespace-nowrap"
      style={{
        mixBlendMode: 'difference',
        fontFamily: fontFamily ?? "'Pacifico', cursive",
      }}
    >
      {text}
    </h1>
  );
}

export default Title;
