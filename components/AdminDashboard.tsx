"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  LogOut,
  MapPin,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type GuestType = "individual" | "couple" | "family";
type InvitationStatus = "active" | "revoked";

type Guest = {
  id: string;
  guestType: GuestType;
  primaryGuestName: string;
  secondaryGuestName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  invitationStatus: InvitationStatus;
};

type GuestFormValues = {
  guestType: GuestType;
  primaryGuestName: string;
  secondaryGuestName: string;
  familyName: string;
  email: string;
  phone: string;
};

type Wedding = {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  dressCode: string;
  weddingDescription: string;
};

type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

const emptyGuestForm: GuestFormValues = {
  guestType: "individual",
  primaryGuestName: "",
  secondaryGuestName: "",
  familyName: "",
  email: "",
  phone: "",
};

const emptyWedding: Wedding = {
  groomName: "",
  brideName: "",
  weddingDate: "",
  weddingTime: "",
  venueName: "",
  venueAddress: "",
  googleMapsUrl: "",
  dressCode: "",
  weddingDescription: "",
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || !result.success) {
    throw new Error(result.success ? "The request could not be completed." : result.error);
  }
  return result.data;
}

function guestName(guest: Guest) {
  if (guest.guestType === "couple") {
    return `${guest.primaryGuestName} & ${guest.secondaryGuestName}`;
  }
  if (guest.guestType === "family" && guest.familyName) {
    return `${guest.primaryGuestName} ${guest.familyName}`;
  }
  return guest.primaryGuestName;
}

function formatType(type: GuestType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function AdminDashboard({
  admin,
}: {
  admin: { name: string; email: string };
}) {
  const router = useRouter();
  const [section, setSection] = useState<"guests" | "wedding">("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestTotal, setGuestTotal] = useState(0);
  const [wedding, setWedding] = useState<Wedding>(emptyWedding);
  const [hasWedding, setHasWedding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingWedding, setSavingWedding] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [guestEditorOpen, setGuestEditorOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [invitationUrl, setInvitationUrl] = useState("");
  const limit = 50;

  const guestQuery = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (query.trim()) params.set("search", query.trim());
    if (filterType) params.set("guestType", filterType);
    if (filterStatus) params.set("invitationStatus", filterStatus);
    return params.toString();
  }, [filterStatus, filterType, page, query]);

  const loadGuests = useCallback(async () => {
    const data = await request<{ guests: Guest[]; total: number }>(
      `/api/admin/guests?${guestQuery}`,
    );
    setGuests(data.guests);
    setGuestTotal(data.total);
  }, [guestQuery]);

  const loadWedding = useCallback(async () => {
    const data = await request<{ wedding: Wedding | null }>("/api/admin/wedding");
    setWedding(data.wedding || emptyWedding);
    setHasWedding(Boolean(data.wedding));
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      await Promise.all([loadGuests(), loadWedding()]);
      setError("");
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load dashboard.";
      setError(message);
      if (message === "Authentication required.") router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [loadGuests, loadWedding, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadDashboard]);

  async function handleLogout() {
    try {
      await request<null>("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to sign out.");
    }
  }

  function startCreateGuest() {
    setEditingGuest(null);
    setInvitationUrl("");
    setGuestEditorOpen(true);
  }

  function startEditGuest(guest: Guest) {
    setEditingGuest(guest);
    setInvitationUrl("");
    setGuestEditorOpen(true);
  }

  async function saveGuest(values: GuestFormValues) {
    setError("");
    setNotice("");
    const payload: Record<string, string> = {
      guestType: values.guestType,
      primaryGuestName: values.primaryGuestName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    };
    if (values.guestType === "couple") {
      payload.secondaryGuestName = values.secondaryGuestName.trim();
    }
    if (values.guestType === "family") {
      payload.familyName = values.familyName.trim();
    }

    try {
      if (editingGuest) {
        await request<{ guest: Guest }>(`/api/admin/guests/${editingGuest.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setGuestEditorOpen(false);
        setNotice("Guest details updated.");
      } else {
        const created = await request<{ guest: Guest; invitationUrl: string }>(
          "/api/admin/guests",
          { method: "POST", body: JSON.stringify(payload) },
        );
        setInvitationUrl(created.invitationUrl);
        setGuestEditorOpen(false);
        setNotice("Guest added. Copy this invitation link now; it cannot be retrieved later.");
      }
      await loadGuests();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save guest.");
      throw saveError;
    }
  }

  async function changeInvitationStatus(guest: Guest) {
    const action = guest.invitationStatus === "active" ? "revoke" : "reactivate";
    setError("");
    setNotice("");
    try {
      await request<{ guest: Guest }>(`/api/admin/guests/${guest.id}/${action}`, {
        method: "POST",
      });
      setNotice(`Invitation ${action === "revoke" ? "revoked" : "reactivated"}.`);
      await loadGuests();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update invitation.");
    }
  }

  async function deleteGuest(guest: Guest) {
    if (!window.confirm(`Permanently delete the invitation for ${guestName(guest)}?`)) return;
    setError("");
    setNotice("");
    try {
      await request<null>(`/api/admin/guests/${guest.id}`, { method: "DELETE" });
      setNotice("Guest and invitation deleted.");
      await loadGuests();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete guest.");
    }
  }

  async function saveWedding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingWedding(true);
    setError("");
    setNotice("");
    try {
      await request<{ wedding: Wedding }>("/api/admin/wedding", {
        method: hasWedding ? "PUT" : "POST",
        body: JSON.stringify(wedding),
      });
      setHasWedding(true);
      setNotice("Wedding details saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save wedding details.");
    } finally {
      setSavingWedding(false);
    }
  }

  async function copyInvitation() {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setNotice("Invitation link copied to clipboard.");
    } catch {
      setError("Could not copy the link. Select and copy it manually.");
    }
  }

  const activeOnPage = guests.filter((guest) => guest.invitationStatus === "active").length;
  const revokedOnPage = guests.length - activeOnPage;
  const pageCount = Math.max(1, Math.ceil(guestTotal / limit));

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#29251F]">
      <header className="border-b border-[#E8E1D4] bg-[#FCFBF8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2EBD9] text-[#9A7934]">
              <Heart size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-lg leading-tight">Wedding dashboard</span>
              <span className="text-xs text-[#81796C]">Private admin area</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-[#81796C]">{admin.email}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E0D4] px-3 py-2 text-sm transition hover:bg-white"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A88739]">
              <ShieldCheck className="mr-1 inline" size={15} aria-hidden="true" />
              Admin only
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl">Welcome, {admin.name}</h1>
            <p className="mt-2 text-sm text-[#70695D]">
              Manage guest invitations and the wedding information shown on your site.
            </p>
          </div>
          {section === "guests" && (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#302B22] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#514631]"
              onClick={startCreateGuest}
              type="button"
            >
              <Plus size={17} aria-hidden="true" />
              Add guest
            </button>
          )}
        </div>

        <nav className="mb-7 flex gap-2 border-b border-[#E2DBCE]" aria-label="Dashboard sections">
          <button
            aria-current={section === "guests" ? "page" : undefined}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
              section === "guests"
                ? "border-[#A88739] text-[#755B22]"
                : "border-transparent text-[#70695D] hover:text-[#29251F]"
            }`}
            onClick={() => setSection("guests")}
            type="button"
          >
            <Users size={17} aria-hidden="true" />
            Guest list
          </button>
          <button
            aria-current={section === "wedding" ? "page" : undefined}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
              section === "wedding"
                ? "border-[#A88739] text-[#755B22]"
                : "border-transparent text-[#70695D] hover:text-[#29251F]"
            }`}
            onClick={() => setSection("wedding")}
            type="button"
          >
            <Settings2 size={17} aria-hidden="true" />
            Wedding details
          </button>
        </nav>

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            <span>{error}</span>
            <button aria-label="Dismiss error" onClick={() => setError("")} type="button">
              <X size={17} />
            </button>
          </div>
        )}
        {notice && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            <span>{notice}</span>
            <button aria-label="Dismiss notice" onClick={() => setNotice("")} type="button">
              <X size={17} />
            </button>
          </div>
        )}
        {invitationUrl && (
          <div className="mb-5 rounded-2xl border border-[#D9C99E] bg-[#FBF8EF] p-4 sm:p-5">
            <p className="mb-2 text-sm font-semibold">Invitation link — copy and save this now</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                aria-label="New invitation link"
                className="min-w-0 flex-1 rounded-lg border border-[#E6E0D4] bg-white px-3 py-2 text-sm"
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                value={invitationUrl}
              />
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#302B22] px-4 py-2 text-sm text-white"
                onClick={copyInvitation}
                type="button"
              >
                <Copy size={15} aria-hidden="true" />
                Copy link
              </button>
            </div>
          </div>
        )}

        {section === "guests" ? (
          <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryCard icon={<Users size={18} />} label="Matching guests" value={guestTotal} />
              <SummaryCard icon={<Check size={18} />} label="Active on this page" value={activeOnPage} />
              <SummaryCard icon={<X size={18} />} label="Revoked on this page" value={revokedOnPage} />
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#E8E1D4] bg-white">
              <div className="flex flex-col gap-3 border-b border-[#EEE9E0] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <h2 className="font-serif text-xl">Guest invitations</h2>
                  <p className="mt-1 text-xs text-[#81796C]">
                    Invitation links are only shown once, immediately after creation.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative">
                    <span className="sr-only">Search guests</span>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#928A7D]" size={16} aria-hidden="true" />
                    <input
                      className="w-full rounded-lg border border-[#E6E0D4] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#A88739] sm:w-48"
                      onChange={(event) => { setPage(1); setQuery(event.target.value); }}
                      placeholder="Search names"
                      value={query}
                    />
                  </label>
                  <label>
                    <span className="sr-only">Filter by guest type</span>
                    <select
                      className="w-full rounded-lg border border-[#E6E0D4] bg-white px-3 py-2 text-sm sm:w-auto"
                      onChange={(event) => { setPage(1); setFilterType(event.target.value); }}
                      value={filterType}
                    >
                      <option value="">All types</option>
                      <option value="individual">Individual</option>
                      <option value="couple">Couple</option>
                      <option value="family">Family</option>
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Filter by invitation status</span>
                    <select
                      className="w-full rounded-lg border border-[#E6E0D4] bg-white px-3 py-2 text-sm sm:w-auto"
                      onChange={(event) => { setPage(1); setFilterStatus(event.target.value); }}
                      value={filterStatus}
                    >
                      <option value="">All invitations</option>
                      <option value="active">Active</option>
                      <option value="revoked">Revoked</option>
                    </select>
                  </label>
                </div>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-[#81796C]">Loading guests...</div>
              ) : guests.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <Users className="mx-auto mb-3 text-[#B6AA92]" size={30} aria-hidden="true" />
                  <p className="font-medium">No guests found</p>
                  <p className="mt-1 text-sm text-[#81796C]">Add a guest or change your search filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#FCFBF8] text-xs uppercase tracking-wide text-[#81796C]">
                      <tr>
                        <th className="px-5 py-3 font-medium">Guest</th>
                        <th className="px-5 py-3 font-medium">Type</th>
                        <th className="px-5 py-3 font-medium">Contact</th>
                        <th className="px-5 py-3 font-medium">Invitation</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0ECE4]">
                      {guests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#FDFCF9]">
                          <td className="px-5 py-4 font-medium">{guestName(guest)}</td>
                          <td className="px-5 py-4 text-[#70695D]">{formatType(guest.guestType)}</td>
                          <td className="px-5 py-4 text-[#70695D]">
                            <span className="block">{guest.email || "—"}</span>
                            {guest.phone && <span className="mt-1 block text-xs">{guest.phone}</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              guest.invitationStatus === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-[#F3F0EA] text-[#756E62]"
                            }`}>
                              {guest.invitationStatus === "active" ? "Active" : "Revoked"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                className="rounded-lg border border-[#E6E0D4] px-3 py-1.5 text-xs hover:bg-[#F7F4EE]"
                                onClick={() => startEditGuest(guest)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className="rounded-lg border border-[#E6E0D4] px-3 py-1.5 text-xs hover:bg-[#F7F4EE]"
                                onClick={() => void changeInvitationStatus(guest)}
                                type="button"
                              >
                                {guest.invitationStatus === "active" ? "Revoke" : "Reactivate"}
                              </button>
                              <button
                                aria-label={`Delete ${guestName(guest)}`}
                                className="rounded-lg border border-red-100 p-1.5 text-red-700 hover:bg-red-50"
                                onClick={() => void deleteGuest(guest)}
                                type="button"
                              >
                                <Trash2 size={15} aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#EEE9E0] px-4 py-3 text-xs text-[#81796C] sm:px-5">
                <span>
                  {guestTotal ? `${(page - 1) * limit + 1}–${Math.min(page * limit, guestTotal)} of ${guestTotal}` : "0 guests"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Previous page"
                    className="rounded-md border border-[#E6E0D4] p-1.5 disabled:opacity-40"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((current) => current - 1)}
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span>{page} / {pageCount}</span>
                  <button
                    aria-label="Next page"
                    className="rounded-md border border-[#E6E0D4] p-1.5 disabled:opacity-40"
                    disabled={page >= pageCount || loading}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-[#E8E1D4] bg-white p-5 sm:p-8">
            <div className="mb-7 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2EBD9] text-[#9A7934]">
                <CalendarDays size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-serif text-xl">Wedding information</h2>
                <p className="mt-1 text-sm text-[#81796C]">
                  These details appear on the public wedding page and invitations.
                </p>
              </div>
            </div>
            <form className="grid gap-5 md:grid-cols-2" onSubmit={saveWedding}>
              <TextField label="Groom's name" value={wedding.groomName} onChange={(value) => setWedding({ ...wedding, groomName: value })} required />
              <TextField label="Bride's name" value={wedding.brideName} onChange={(value) => setWedding({ ...wedding, brideName: value })} required />
              <TextField label="Wedding date" type="date" value={wedding.weddingDate} onChange={(value) => setWedding({ ...wedding, weddingDate: value })} required />
              <TextField label="Wedding time" value={wedding.weddingTime} onChange={(value) => setWedding({ ...wedding, weddingTime: value })} placeholder="e.g. 4:30 PM" required />
              <TextField label="Venue name" value={wedding.venueName} onChange={(value) => setWedding({ ...wedding, venueName: value })} required />
              <TextField label="Venue address" value={wedding.venueAddress} onChange={(value) => setWedding({ ...wedding, venueAddress: value })} required />
              <TextField label="Google Maps link" value={wedding.googleMapsUrl} onChange={(value) => setWedding({ ...wedding, googleMapsUrl: value })} placeholder="https://maps.google.com/..." />
              <TextField label="Dress code" value={wedding.dressCode} onChange={(value) => setWedding({ ...wedding, dressCode: value })} />
              <label className="block text-sm font-medium md:col-span-2">
                Wedding description
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3 outline-none focus:border-[#A88739] focus:ring-2 focus:ring-[#A88739]/15"
                  maxLength={2000}
                  onChange={(event) => setWedding({ ...wedding, weddingDescription: event.target.value })}
                  value={wedding.weddingDescription}
                />
              </label>
              <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs text-[#81796C]">
                  <MapPin size={14} aria-hidden="true" />
                  Maps links must be secure Google Maps URLs.
                </p>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#302B22] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#514631] disabled:opacity-60"
                  disabled={savingWedding}
                  type="submit"
                >
                  {savingWedding ? "Saving..." : hasWedding ? "Save wedding details" : "Create wedding details"}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      {guestEditorOpen && (
        <GuestEditor
          guest={editingGuest}
          onClose={() => setGuestEditorOpen(false)}
          onSave={saveGuest}
        />
      )}
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E8E1D4] bg-white p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E2] text-[#9A7934]">
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-[#81796C]">{label}</p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3 outline-none focus:border-[#A88739] focus:ring-2 focus:ring-[#A88739]/15"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function GuestEditor({
  guest,
  onClose,
  onSave,
}: {
  guest: Guest | null;
  onClose: () => void;
  onSave: (values: GuestFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<GuestFormValues>(
    guest
      ? {
          guestType: guest.guestType,
          primaryGuestName: guest.primaryGuestName,
          secondaryGuestName: guest.secondaryGuestName || "",
          familyName: guest.familyName || "",
          email: guest.email || "",
          phone: guest.phone || "",
        }
      : emptyGuestForm,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(values);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save guest.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#211D17]/50 p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        aria-labelledby="guest-editor-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        role="dialog"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A88739]">
              Guest invitation
            </p>
            <h2 className="mt-1 font-serif text-2xl" id="guest-editor-title">
              {guest ? "Edit guest" : "Add a guest"}
            </h2>
          </div>
          <button aria-label="Close guest form" className="rounded-full p-2 hover:bg-[#F7F4EE]" onClick={onClose} type="button">
            <X size={19} />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <label className="block text-sm font-medium">
            Invitation type
            <select
              className="mt-2 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3"
              onChange={(event) => setValues({ ...values, guestType: event.target.value as GuestType })}
              value={values.guestType}
            >
              <option value="individual">Individual</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
            </select>
          </label>
          <EditorField
            label={values.guestType === "family" ? "Primary guest name" : "Guest name"}
            required
            value={values.primaryGuestName}
            onChange={(primaryGuestName) => setValues({ ...values, primaryGuestName })}
          />
          {values.guestType === "couple" && (
            <EditorField
              label="Second guest name"
              required
              value={values.secondaryGuestName}
              onChange={(secondaryGuestName) => setValues({ ...values, secondaryGuestName })}
            />
          )}
          {values.guestType === "family" && (
            <EditorField
              label="Family name (optional)"
              value={values.familyName}
              onChange={(familyName) => setValues({ ...values, familyName })}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <EditorField label="Email (optional)" type="email" value={values.email} onChange={(email) => setValues({ ...values, email })} />
            <EditorField label="Phone (optional)" type="tel" value={values.phone} onChange={(phone) => setValues({ ...values, phone })} />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button className="rounded-full border border-[#E6E0D4] px-5 py-2.5 text-sm" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="rounded-full bg-[#302B22] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60" disabled={saving} type="submit">
              {saving ? "Saving..." : guest ? "Save changes" : "Create invitation"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EditorField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  const id = `guest-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <input
        className="mt-2 w-full rounded-xl border border-[#E6E0D4] bg-[#FDFCF9] px-4 py-3 outline-none focus:border-[#A88739] focus:ring-2 focus:ring-[#A88739]/15"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
