const Label = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => (
  <label className="tracking-widest text-xs">
    {children}
  </label>
);

export default Label;
