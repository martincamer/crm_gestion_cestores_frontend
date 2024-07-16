export const FormInput = ({ labelText, props, type, placeholder }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-semibold text-sn text-gray-700">{labelText}</label>
      <input
        {...props}
        type={type}
        placeholder={placeholder}
        className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-sm font-semibold"
      />
    </div>
  );
};
