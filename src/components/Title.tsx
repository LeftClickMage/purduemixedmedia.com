interface TitleProps {
  text: string;
  subtitle?: string;
}

function Title(props: TitleProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-tight" style={{ WebkitTextStroke: 'clamp(1.5px, 0.15vw, 4px) black' }}>
        {props.text}
      </h1>
      {props.subtitle && (
        <p className="text-xl font-normal text-gray-500 tracking-tight max-w-xl leading-snug">
          {props.subtitle}
        </p>
      )}
    </div>
  );
}

export default Title;
