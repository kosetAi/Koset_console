// C:\Users\Asus\code\Koset Console\client\src\components\PhoneInput.jsx

export default function PhoneInput({ value, onChange }) {
  const handleChange = (e) => {
    // Allow digits and "+"
    const raw = e.target.value.replace(/[^\d+]/g, "");

    // If user doesn't start with "+", assume country code is missing and prepend "+"
    let next = raw;
    if (next && !next.startsWith("+")) {
      next = "+" + next;
    }

    onChange(next);
  };

  return (
    <div className="relative">
      <input
        type="tel"
        inputMode="tel"
        placeholder="+919876543210"
        value={value}
        onChange={handleChange}
        className="w-full px-4 pr-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400"
      />
    </div>
  );
}
