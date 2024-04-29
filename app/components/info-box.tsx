const InfoBox = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-slate-950 p-8 rounded-3xl h-fit md:min-w-72">
      {children}
    </div>
  )
}

export default InfoBox;
