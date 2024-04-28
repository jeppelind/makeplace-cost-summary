const Label = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => (
  <label className="tracking-wider text-sm">
    {children}
  </label>
);

export default Label;
