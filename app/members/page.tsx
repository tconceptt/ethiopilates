"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, X, Clock, Users } from "lucide-react";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { packageSummary } from "../../lib/pricing";
import ClassesEditor from "./ClassesEditor";
import PricingEditor from "./PricingEditor";
import SettingsEditor from "./SettingsEditor";

const TABS = [
  { id: "registrations", label: "Registrations" },
  { id: "classes", label: "Classes & schedule" },
  { id: "pricing", label: "Prices" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Members() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabId>("registrations");

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const registrations = useQuery(api.registrations.get);
  const settings = useQuery(api.settings.get);
  const updateStatus = useMutation(api.registrations.updateStatus);
  const markPaid = useMutation(api.registrations.markPaid);
  const seedIfEmpty = useMutation(api.content.seedIfEmpty);
  const [payingId, setPayingId] = useState<Id<"registrations"> | null>(null);

  // The editable tables start empty; the public site renders built-in defaults
  // until they're filled in. Seeding here means the first admin visit turns
  // those defaults into editable rows without a manual migration step.
  useEffect(() => {
    if (!isAuthenticated) return;
    seedIfEmpty().catch((err) => console.error("Failed to seed content:", err));
  }, [isAuthenticated, seedIfEmpty]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "ethiopilates" && password === "biggerdreams") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
  };

  const handleUpdateStatus = async (id: Id<"registrations">, status: string) => {
    try {
      await updateStatus({ id, status });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-secondary/20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary/20 flex flex-col">
        <header className="bg-white py-4 shadow-sm">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-primary transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm uppercase tracking-widest">Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image src="/logo.jpeg" alt="Ethio Pilates Logo" fill sizes="32px" className="object-contain" />
              </div>
              <span className="font-serif text-lg tracking-widest uppercase text-primary-dark hidden sm:block">
                Ethio Pilates
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center py-12 px-6">
          <div className="w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-sm shadow-md overflow-hidden"
            >
              <div className="bg-primary-dark p-8 text-center text-white">
                <h1 className="font-serif text-3xl mb-2">Members Login</h1>
                <p className="text-primary-light text-sm tracking-widest uppercase">Admin Access Only</p>
              </div>

              <form onSubmit={handleLogin} className="p-8">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-sm mb-6 text-sm border border-red-100">
                    {error}
                  </div>
                )}
                <div className="mb-6">
                  <label htmlFor="username" className="block text-sm font-medium text-stone-700 mb-2">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter username"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Enter password"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-sm text-sm uppercase tracking-widest transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Sign In
                </button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  const totalMembers = registrations?.filter(r => r.status !== "cancelled").length || 0;
  // Rows created before payments were recorded in full only ever held the
  // advance in `price`, so fall back to it rather than counting them as zero.
  const totalPayment = registrations
    ?.filter(r => r.status === "paid")
    .reduce((sum, r) => sum + (r.paidAmount ?? r.price ?? 0), 0) || 0;

  const payingRegistration =
    registrations?.find((r) => r._id === payingId) ?? null;

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      <header className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm uppercase tracking-widest hidden md:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600 hidden sm:inline">Logged in as Admin</span>
            <button 
              onClick={handleLogout}
              className="text-sm text-primary hover:text-primary-dark underline font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <nav className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap px-4 py-4 text-xs uppercase tracking-widest border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary-dark font-medium"
                    : "border-transparent text-stone-500 hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="flex-grow py-8 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {tab === "classes" && <ClassesEditor />}
          {tab === "pricing" && <PricingEditor />}
          {tab === "settings" && <SettingsEditor />}

          <div className={tab === "registrations" ? "" : "hidden"}>
          {/* Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 uppercase tracking-wider mb-1 font-semibold">Active Members</p>
                <h3 className="text-3xl font-serif text-primary-dark">{totalMembers}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500 uppercase tracking-wider mb-1 font-semibold">Confirmed Revenue</p>
                <h3 className="text-3xl font-serif text-primary-dark">{totalPayment.toLocaleString()} ETB</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="p-6 md:p-8 border-b border-stone-100 bg-stone-50/50">
              <h1 className="font-serif text-2xl md:text-3xl text-primary-dark mb-1">Recent Registrations</h1>
              <p className="text-sm text-stone-500">Manage member sign-ups and payments</p>
            </div>
            
            <div className="p-0">
              {registrations === undefined ? (
                <div className="text-center py-16 text-stone-500 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
                  <p>Loading registrations...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-16 text-stone-500">No registrations found.</div>
              ) : (
                <>
                  {/* Desktop Table View (Hidden on mobile) */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-stone-50">
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">Name / Contact</th>
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">Class, package & schedule</th>
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">Price</th>
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {registrations.map((reg) => (
                          <tr key={reg._id} className={`hover:bg-stone-50/50 transition-colors ${reg.status === 'cancelled' ? 'bg-stone-100/50 text-stone-400' : ''}`}>
                            <td className="py-4 px-6 text-sm text-stone-500 whitespace-nowrap align-top">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 align-top">
                              <div className="font-medium text-stone-800 flex items-center gap-2">
                                {reg.firstName} {reg.lastName}
                                {reg.isMember && (
                                  <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-blue-200 uppercase tracking-wider">
                                    <Users size={10} /> Member
                                  </span>
                                )}
                              </div>
                              {reg.phone && <div className="text-sm text-stone-600 mt-1">{reg.phone}</div>}
                              {reg.email && <div className="text-xs text-stone-500">{reg.email}</div>}
                            </td>
                            <td className="py-4 px-6 align-top">
                              <span className="inline-block bg-primary/10 text-primary-dark px-2.5 py-1 rounded text-xs font-medium border border-primary/20 mb-1">
                                {reg.package}
                              </span>
                              {packageSummary(reg) ? (
                                <div className="text-xs text-stone-700 mt-1.5 font-medium">
                                  {packageSummary(reg)}
                                </div>
                              ) : reg.isMember ? (
                                <div className="text-xs text-stone-500 mt-1.5">On membership</div>
                              ) : null}
                              {reg.schedule && (
                                <div className="text-xs text-stone-600 mt-1.5">{reg.schedule}</div>
                              )}
                              {reg.goals && (
                                <p className="text-xs text-stone-500 mt-2 truncate max-w-[200px]" title={reg.goals}>
                                  Goal: {reg.goals}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-6 align-top">
                              <PriceCell reg={reg} />
                            </td>
                            <td className="py-4 px-6 align-top">
                              {reg.status === "confirmed" && (
                                <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold border border-green-200">
                                  <Check size={12} /> Confirmed
                                </span>
                              )}
                              {reg.status === "paid" &&
                                (reg.paidInFull === false ? (
                                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-xs font-semibold border border-amber-200">
                                    <Check size={12} /> Advance only
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold border border-green-200">
                                    <Check size={12} /> Paid
                                  </span>
                                ))}
                              {reg.status === "pending" && (
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-xs font-semibold border border-amber-200">
                                  <Clock size={12} /> Pending
                                </span>
                              )}
                              {reg.status === "cancelled" && (
                                <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2 py-1 rounded-md text-xs font-semibold border border-stone-200">
                                  <X size={12} /> Cancelled
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 align-top text-right">
                              <div className="flex flex-col gap-2 items-end">
                                {reg.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => setPayingId(reg._id)}
                                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors w-full max-w-[120px]"
                                    >
                                      Mark Paid
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateStatus(reg._id, "cancelled")}
                                      className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded transition-colors w-full max-w-[120px]"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {reg.status === "paid" && (
                                  <button
                                    onClick={() => setPayingId(reg._id)}
                                    className="text-xs border border-stone-200 text-stone-600 hover:bg-stone-50 px-3 py-1.5 rounded transition-colors w-full max-w-[120px]"
                                  >
                                    {reg.paidInFull === false ? "Record balance" : "Edit payment"}
                                  </button>
                                )}
                                {(reg.status === "paid" || reg.status === "confirmed") && (
                                  <button
                                    onClick={() => handleUpdateStatus(reg._id, "cancelled")}
                                    className="text-xs border border-stone-200 text-stone-500 hover:bg-stone-50 px-3 py-1.5 rounded transition-colors w-full max-w-[120px]"
                                  >
                                    {reg.status === "confirmed" ? "Cancel" : "Revoke"}
                                  </button>
                                )}
                                {reg.status === "cancelled" && (
                                  <button
                                    onClick={() => handleUpdateStatus(reg._id, reg.isMember ? "confirmed" : "pending")}
                                    className="text-xs border border-stone-200 text-stone-500 hover:bg-stone-50 px-3 py-1.5 rounded transition-colors w-full max-w-[120px]"
                                  >
                                    Restore
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View (Hidden on desktop) */}
                  <div className="lg:hidden flex flex-col divide-y divide-stone-100">
                    {registrations.map((reg) => (
                      <div key={reg._id} className={`p-4 sm:p-6 ${reg.status === 'cancelled' ? 'bg-stone-100/50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-stone-800 flex items-center gap-2">
                              {reg.firstName} {reg.lastName}
                              {reg.isMember && (
                                <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-blue-200 uppercase tracking-wider">
                                  <Users size={10} /> Member
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-stone-500">{new Date(reg.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            {reg.status === "confirmed" && (
                              <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
                                <Check size={12} /> Confirmed
                              </span>
                            )}
                            {reg.status === "paid" &&
                              (reg.paidInFull === false ? (
                                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-200">
                                  <Check size={12} /> Advance only
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
                                  <Check size={12} /> Paid
                                </span>
                              ))}
                            {reg.status === "pending" && (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-200">
                                <Clock size={12} /> Pending
                              </span>
                            )}
                            {reg.status === "cancelled" && (
                              <span className="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md text-xs font-semibold border border-stone-200">
                                <X size={12} /> Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Contact</p>
                            <p className="font-medium text-stone-700">{reg.phone || "—"}</p>
                            {reg.email && <p className="text-stone-500 truncate">{reg.email}</p>}
                          </div>
                          <div>
                            <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Amount</p>
                            <PriceCell reg={reg} />
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">Class & package</p>
                          <span className="inline-block bg-primary/10 text-primary-dark px-2.5 py-1 rounded text-xs font-medium border border-primary/20">
                            {reg.package}
                          </span>
                          {packageSummary(reg) ? (
                            <p className="text-sm text-stone-700 font-medium mt-2">
                              {packageSummary(reg)}
                            </p>
                          ) : reg.isMember ? (
                            <p className="text-sm text-stone-500 mt-2">On membership</p>
                          ) : null}
                          {reg.schedule && (
                            <p className="text-sm text-stone-600 mt-2">{reg.schedule}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                          {reg.status === "pending" && (
                            <>
                              <button
                                onClick={() => setPayingId(reg._id)}
                                className="flex-1 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors text-center font-medium"
                              >
                                Mark as Paid
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(reg._id, "cancelled")}
                                className="flex-1 text-sm bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded transition-colors text-center font-medium"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {reg.status === "paid" && (
                            <button
                              onClick={() => setPayingId(reg._id)}
                              className="flex-1 text-sm border border-stone-200 text-stone-600 hover:bg-stone-50 px-4 py-2 rounded transition-colors text-center"
                            >
                              {reg.paidInFull === false ? "Record balance" : "Edit payment"}
                            </button>
                          )}
                          {(reg.status === "paid" || reg.status === "confirmed") && (
                            <button
                              onClick={() => handleUpdateStatus(reg._id, "cancelled")}
                              className="flex-1 text-sm border border-stone-200 text-stone-500 hover:bg-stone-50 px-4 py-2 rounded transition-colors text-center"
                            >
                              {reg.status === "confirmed" ? "Cancel Booking" : "Revoke Payment"}
                            </button>
                          )}
                          {reg.status === "cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(reg._id, reg.isMember ? "confirmed" : "pending")}
                              className="w-full text-sm border border-stone-200 text-stone-500 hover:bg-stone-50 px-4 py-2 rounded transition-colors text-center"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </main>

      {payingRegistration && (
        <MarkPaidDialog
          key={payingRegistration._id}
          reg={payingRegistration}
          advancePayment={settings?.advancePayment ?? 0}
          onClose={() => setPayingId(null)}
          onConfirm={async (amount, paidInFull) => {
            await markPaid({ id: payingRegistration._id, amount, paidInFull });
            setPayingId(null);
          }}
        />
      )}
    </div>
  );
}

/** What the booking is worth, and what's actually been collected against it. */
function PriceCell({ reg }: { reg: Doc<"registrations"> }) {
  if (reg.isMember) {
    return <p className="font-medium text-stone-800">Membership</p>;
  }

  const full = reg.packagePrice;
  const fullLabel = reg.packagePriceLabel;
  const collected = reg.status === "paid" ? (reg.paidAmount ?? reg.price ?? 0) : null;
  const outstanding = full !== undefined && collected !== null ? full - collected : null;

  return (
    <div className="space-y-0.5">
      <p className="font-medium text-stone-800">
        {full !== undefined
          ? `${full.toLocaleString()} ETB`
          : fullLabel
            ? `${fullLabel} ETB`
            : "N/A"}
      </p>
      {collected === null ? (
        <p className="text-xs text-stone-500">
          Advance {(reg.price ?? 0).toLocaleString()} ETB due
        </p>
      ) : (
        <>
          <p className="text-xs text-green-700">
            Collected {collected.toLocaleString()} ETB
          </p>
          {outstanding !== null && outstanding > 0 && (
            <p className="text-xs text-amber-700">
              {outstanding.toLocaleString()} ETB outstanding
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Records a payment. Defaults to the full package price because that's the
 * normal case — the advance only holds the slot, and the balance is settled at
 * the studio before the first session. Unticking drops it back to the advance.
 */
function MarkPaidDialog({
  reg,
  advancePayment,
  onClose,
  onConfirm,
}: {
  reg: Doc<"registrations">;
  advancePayment: number;
  onClose: () => void;
  onConfirm: (amount: number, paidInFull: boolean) => Promise<void>;
}) {
  const advance = reg.price ?? advancePayment;
  const fullPrice = reg.packagePrice;
  // Reopening an already-paid booking edits what was recorded; a fresh one
  // starts on "paid in full", which is the usual outcome.
  const isRecorded = reg.status === "paid";
  const [paidInFull, setPaidInFull] = useState(
    isRecorded ? reg.paidInFull !== false : true,
  );
  const [amount, setAmount] = useState(() => {
    if (isRecorded && reg.paidAmount !== undefined) return String(reg.paidAmount);
    return fullPrice !== undefined ? String(fullPrice) : "";
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (checked: boolean) => {
    setPaidInFull(checked);
    setAmount(
      checked ? (fullPrice !== undefined ? String(fullPrice) : "") : String(advance),
    );
  };

  const parsed = Number(amount.trim());
  const isValid = amount.trim() !== "" && Number.isFinite(parsed) && parsed >= 0;

  const handleConfirm = async () => {
    if (!isValid) return;
    setIsSaving(true);
    try {
      await onConfirm(parsed, paidInFull);
    } catch (err) {
      console.error("Failed to record payment:", err);
      alert("Failed to record the payment.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40">
      <div className="w-full max-w-md bg-white rounded-sm shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100 bg-stone-50/60">
          <h2 className="font-serif text-xl text-primary-dark">Record payment</h2>
          <p className="text-sm text-stone-500 mt-0.5">
            {reg.firstName} {reg.lastName} — {reg.package}
          </p>
          {packageSummary(reg) && (
            <p className="text-sm text-stone-700 font-medium mt-1">{packageSummary(reg)}</p>
          )}
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={paidInFull}
              onChange={(e) => handleToggle(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--color-primary,#8a6a4f)] shrink-0"
            />
            <span className="min-w-0">
              <span className="block text-sm text-stone-700">
                Paid the full package price
              </span>
              <span className="block text-xs text-stone-400">
                Untick if only the {advance.toLocaleString()} ETB advance came in.
              </span>
            </span>
          </label>

          {paidInFull && fullPrice === undefined && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
              {reg.packagePriceLabel
                ? `This package's price is written as "${reg.packagePriceLabel}", which isn't a plain number — enter the amount collected.`
                : "This booking has no package on it, so enter the amount collected."}
            </p>
          )}

          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Amount collected (ETB)
            </span>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 30000"
              className="w-full px-3 py-2 rounded-sm border border-stone-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white"
            />
          </label>
        </div>

        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 px-3 py-2.5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid || isSaving}
            className="text-xs uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Confirm payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
