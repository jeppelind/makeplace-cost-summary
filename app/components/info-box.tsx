const InfoBox = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-slate-950 p-8 rounded-3xl h-fit">
      {children}
    </div>
  )
}

export default InfoBox;
