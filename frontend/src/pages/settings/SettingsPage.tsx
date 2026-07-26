import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck, X } from "lucide-react";
import api from "@/api/axios";

interface AccountDetails {
    username: string;
    email: string;
    institution: string;
    role: string;
}

interface InstitutionDetails {
    college_name?: string;
    university_name?: string;
    academic_stream?: string | null;
    medium?: string | null;
    district?: string | null;
    college_type?: string | null;
    management_type?: string | null;
    address?: string | null;
}

function SettingsPage() {
    const [account, setAccount] = useState<AccountDetails>({
        username: "Loading...",
        email: "Loading...",
        institution: "Loading...",
        role: "Loading...",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordState, setPasswordState] = useState<{ loading: boolean; success: string | null; error: string | null }>({ loading: false, success: null, error: null });

    useEffect(() => {
        const loadAccount = async () => {
            try {
                setLoading(true);
                setError(null);

                const userResponse = await api.get<{ username?: string; name?: string; email?: string; roles?: string[]; institution_id?: string | null }>('/auth/me');
                const userData = userResponse.data;
                const username = userData?.username || userData?.name || "User";
                const email = userData?.email || "Not provided";
                const roles = userData?.roles?.length ? userData.roles.join(", ") : "Intern";

                let institution = "Not available";
                if (userData?.institution_id) {
                    try {
                        const institutionResponse = await api.get<InstitutionDetails>(`/institutions/${userData.institution_id}`);
                        const institutionData = institutionResponse.data;
                        institution = institutionData?.college_name || institutionData?.university_name || "Not available";
                    } catch {
                        institution = "Not available";
                    }
                }

                setAccount({
                    username,
                    email,
                    institution,
                    role: roles,
                });
            } catch (requestError) {
                setError("Unable to load account details right now.");
            } finally {
                setLoading(false);
            }
        };

        void loadAccount();
    }, []);

    const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordState({ loading: true, success: null, error: null });

        if (!passwordForm.currentPassword.trim() || !passwordForm.newPassword.trim() || !passwordForm.confirmPassword.trim()) {
            setPasswordState({ loading: false, success: null, error: "All fields are required." });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordState({ loading: false, success: null, error: "New password and confirmation do not match." });
            return;
        }

        try {
            await api.post('/auth/change-password', {
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword,
                confirm_password: passwordForm.confirmPassword,
            });
            setPasswordState({ loading: false, success: "Password updated successfully.", error: null });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (requestError: unknown) {
            const message = requestError instanceof Error ? requestError.message : "Unable to update password at the moment.";
            setPasswordState({ loading: false, success: null, error: message });
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-8 shadow-[var(--shadow-lg)]">
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-400">Settings</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-strong)]">Account and security</h1>
                <p className="mt-3 max-w-2xl text-base text-[var(--app-text-muted)]">Manage your profile details and keep your account access protected.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6 shadow-[var(--shadow-md)]">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-2 text-violet-300">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--app-strong)]">Account Information</h2>
                            <p className="text-sm text-[var(--app-text-muted)]">Your current workspace details.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="mt-6 rounded-2xl border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm text-[var(--app-text-muted)]">Loading account details…</div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {error ? (
                                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
                            ) : null}
                            {[
                                { label: "Username", value: account.username },
                                { label: "Email", value: account.email },
                                { label: "Institution Name", value: account.institution },
                                { label: "Role", value: account.role },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                                    <p className="text-sm text-[var(--app-text-soft)]">{item.label}</p>
                                    <p className="mt-1 font-medium text-[var(--app-strong)]">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-6 shadow-[var(--shadow-md)]">
                        <h2 className="text-xl font-semibold text-[var(--app-strong)]">Security</h2>
                        <p className="mt-2 text-sm text-[var(--app-text-muted)]">Keep your account access protected.</p>
                        <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="mt-5 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {isPasswordModalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--app-surface)]/70 p-4">
                    <div className="w-full max-w-md rounded-3xl border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--shadow-lg)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--app-strong)]">Change Password</h3>
                                <p className="mt-1 text-sm text-[var(--app-text-muted)]">Update your account password securely.</p>
                            </div>
                            <button type="button" onClick={() => { setIsPasswordModalOpen(false); setPasswordState({ loading: false, success: null, error: null }); }} className="rounded-xl border-[var(--app-border)] p-2 text-[var(--app-text-muted)] transition hover:text-[var(--app-text)]">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]">Current Password</label>
                                <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} className="w-full rounded-2xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-violet-500" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]">New Password</label>
                                <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} className="w-full rounded-2xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-violet-500" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--app-text-muted)]">Confirm Password</label>
                                <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full rounded-2xl border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-violet-500" />
                            </div>

                            {passwordState.error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{passwordState.error}</div> : null}
                            {passwordState.success ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{passwordState.success}</div> : null}

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => { setIsPasswordModalOpen(false); setPasswordState({ loading: false, success: null, error: null }); }} className="rounded-2xl border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text-muted)] transition hover:text-[var(--app-text)]">Cancel</button>
                                <button type="submit" disabled={passwordState.loading} className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-[var(--app-surface)] transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-400">
                                    {passwordState.loading ? "Updating..." : "Save Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default SettingsPage;
