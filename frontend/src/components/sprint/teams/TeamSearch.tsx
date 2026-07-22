interface TeamSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TeamSearch({ value, onChange }: TeamSearchProps) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
            <input
                type="text"
                placeholder="Search members..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />
        </div>
    );
}
